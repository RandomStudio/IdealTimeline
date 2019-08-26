import React from 'react';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { CursorType, IBlock } from './Track/Block/Block';
//@ts-ignore
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import UnitMarkers from './Ruler/Ruler';
import Defaults from '../../Data/Defaults';

export interface ITimeline {
  tracks: ITrack[],
}

export interface IVector2 {
  x: number, y: number
}

export interface ITimelinePlayback {
  currentPosition: number,
  playing: boolean,
  currentUnderPlayhead: IActiveBlock[]
}

export interface ITimelineState extends ITimelinePlayback {
  targetPosition: number | null,
  lastTime: number | null,
  tracks: ITrack[],
  trackTitleWidth: number,
  cursorStyle: CursorType,
}

interface ITimelineProps extends ITimeline {
  width: number,
  height: number
  scale: IVector2,
  reportPlaybackState: (timelineState: ITimelinePlayback) => void
}  

interface IActiveBlock extends IBlock {
  trackId: number,
  progress: number
}

const getCurrentBlocksUnderPlayhead = (currentPosition: number, tracks: ITrack[]): IActiveBlock[] => 
  tracks.reduce( (acc, current) => {
    const activeBlock = current.blocks.find(b => 
      currentPosition >= b.start && currentPosition <= (b.start +  b.duration)
    );
    return (activeBlock !== undefined) ?
      [
        ...acc, 
        {
          ...activeBlock,
          trackId: current.id,
          progress: (currentPosition - activeBlock.start) / activeBlock.duration
        }
      ]
      : acc
  }
  , [] as IActiveBlock[]);

const getLastBlock = (blocks: IBlock[]): IBlock =>
  blocks.reduce( (result, block) => 
    (block.start + block.duration) > result.start + result.duration
      ? block
      : result
  );

const getLastBlockInTracks = (tracks: ITrack[]): IBlock | null => {
  let lastBlock: IBlock | null = null;
  tracks.forEach( (track) => {
    if (track.blocks.length > 0) {
      const lastBlockInTrack = getLastBlock(track.blocks);
      if (lastBlock === null) {
        lastBlock = lastBlockInTrack;
      } else {
        if ((lastBlockInTrack.start + lastBlockInTrack.duration) > lastBlock.start + lastBlock.duration) {
          lastBlock = lastBlockInTrack;
        } 
      }
    }
  }, lastBlock)
  return lastBlock;
}

class Timeline extends React.Component<ITimelineProps, ITimelineState> {

  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  state = {
    currentPosition: 0,
    targetPosition: null,
    playing: false,
    lastTime: null,
    tracks: [],
    trackTitleWidth: 0,
    cursorStyle: CursorType.default,
    currentUnderPlayhead: []
  } as ITimelineState;

  componentDidMount = () => {
    this.setState({ tracks: this.props.tracks });
    requestAnimationFrame(this.tick);
  }
  
  tick = (now: number) => {
    requestAnimationFrame(this.tick);
    if (this.state.lastTime === null) {
      this.setState({ lastTime: now });
    }
    if (this.state.lastTime) {
      const delta = now - this.state.lastTime;
      // console.log('now', now, 'delta', delta);
      if (delta > 1000/60) {
        this.props.reportPlaybackState(this.state);
        // console.log('tick', delta);
        if (this.state.playing) {
          const newPosition = Math.fround(this.state.currentPosition + delta/1000);
          this.setState({ 
            lastTime: now,
            currentPosition: newPosition,
            currentUnderPlayhead: getCurrentBlocksUnderPlayhead(newPosition, this.state.tracks)
          });
        } else {
          this.setState({
            currentUnderPlayhead: getCurrentBlocksUnderPlayhead(this.state.currentPosition, this.state.tracks)
          });
        }
      }
    }
  }

  moveBlock = (srcTrackId: number, blockId: string, newStart: number, dstTrackId: number) => {
    // console.log(`moveBlock ${trackId}/${blockId} to x: ${newStart}`);

    if (srcTrackId === dstTrackId) {
      const tracks = this.state.tracks.map(track => track.id === dstTrackId
        ? { 
          ...track, 
          blocks: track.blocks.map(block => block.id === blockId
            ? {
              ...block,
              start: newStart
            }
            : block
          )
        }
        : track
      );
      // console.log('updated tracks:', tracks);
      this.setState({ tracks });
    } else {
      console.warn('need to handle this better')
    }
  }

  trimBlock = (trackId: number, blockId: string, startDelta: number, durationDelta: number) => {
    console.log(`trimBlock ${trackId}/${blockId}: startDelta: ${startDelta}, durationDelta: ${durationDelta}`);
    const tracks = this.state.tracks.map(track => track.id === trackId
        ? { 
          ...track, 
          blocks: track.blocks.map(block => block.id === blockId
            ? {
              ...block,
              start: block.start + startDelta,
              duration: block.duration + durationDelta
            }
            : block
          )
        }
        : track
      )
    // console.log('updated tracks:', tracks);
    this.setState({ tracks });
  }

  moveTargetPosition = (newPosition: number | null) => {   
    // console.log('moveTargetPosition to', newPosition);
    this.setState({ targetPosition: newPosition });
  }

  togglePlayback = () => {
    // console.log('toggleplayback');
    this.setState(prevState => {
      const before = prevState.playing;
      const after = !prevState.playing;
      console.log('PLAYING: was', before, 'now', after);
      return { ...prevState, playing: after, lastTime: null };
    });
  }

  setPlayhead = (position: number) => {
    console.log('setPlayhead to position', position);
    this.setState({ currentPosition: position });
  }

  changeCursor = (style: CursorType) => {
    this.setState({ cursorStyle: style });
  }



  render = () => {
    const tracks = this.state.tracks;
    const rect = (this.ref && this.ref.current) 
      ? this.ref.current.getBoundingClientRect() 
      : null;

    const scroll = (this.ref && this.ref.current)
      ? { 
        left: this.ref.current.scrollLeft,
        top: this.ref.current.scrollTop
      } :
      null;

    const offset = (rect !== null && scroll !== null)
      ? { x: rect.left - scroll.left, y: rect.top }
      : { x: 0, y: 0 }

    const lastBlock = getLastBlockInTracks(tracks);
    const trackMax = lastBlock ? (lastBlock.start + lastBlock.duration) * 2: 0;

    const style = {
      height: this.state.tracks.length * this.props.scale.y + Defaults.rulerHeight * 1.5,
      width: rect !== null ? this.props.width - rect.left *2 : this.props.width,
      cursor: this.state.cursorStyle
    }

    return (
      <div className="Timeline" ref={this.ref} style={style}>
  
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue=" "
          onKeyHandle={this.togglePlayback}
        />
        <KeyHandler
          keyEventName={'keydown'}
          code="Home"
          onKeyHandle={() => { this.setPlayhead(0)}}
        />
        <KeyHandler
          keyEventName={'keydown'}
          code="End"
          onKeyHandle={() => { 
            const lastBlock = getLastBlockInTracks(this.state.tracks);
            if (lastBlock) {
              this.setPlayhead(lastBlock.start + lastBlock.duration);
            }
          }}
        />

            {tracks.map(track => 
              <Track 
                {...track}
                key={track.id}
                height={this.props.scale.y}
                width={this.props.scale.x * trackMax - offset.x}
                scale={this.props.scale}
                trackTitleWidth={0}
                moveBlock={this.moveBlock}
                moveTargetPosition={this.moveTargetPosition}
                trimBlock={this.trimBlock}
                changeCursor={this.changeCursor}
                offset={offset}
              />
            )}

        {this.state.targetPosition &&
          <Playhead 
              position={this.state.targetPosition}
              type={PlayheadType.Target}
              height={this.state.tracks.length * this.props.scale.y + Defaults.rulerHeight}
              scale={this.props.scale}
          />
          }
          
          <Playhead
            position={this.state.currentPosition}
            type={PlayheadType.Current}
            height={this.state.tracks.length * this.props.scale.y + Defaults.rulerHeight}
            scale={this.props.scale}
          />

          <UnitMarkers 
            scale={this.props.scale}
            width={trackMax * this.props.scale.x}
            height={Defaults.rulerHeight}
            offset={offset}
            parentWidth={this.props.width}
            setPlayhead={this.setPlayhead}
          />
          

      </div>
    );
  }

}
  

export default Timeline;
