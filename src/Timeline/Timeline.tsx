import React from 'react';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { CursorType, IBlock } from './Track/Block/Block';
//@ts-ignore
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import UnitMarkers from './UnitMarkers/UnitMarkers';

export interface ITimeline {
  tracks: ITrack[],
}

export interface ITimelineState {
  currentPosition: number,
  targetPosition: number | null,
  playing: boolean,
  lastTime: number | null,
  tracks: ITrack[],
  scale: { x: number, y: number },
  trackTitleWidth: number,
  cursorStyle: CursorType,
  currentUnderPlayhead: IActiveBlock[]
}

interface ITimelineProps extends ITimeline {
  width: number,
  height: number
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


class Timeline extends React.Component<ITimelineProps, ITimelineState> {

  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  state = {
    currentPosition: 0,
    targetPosition: null,
    playing: false,
    lastTime: null,
    tracks: [],
    scale: { x: 100.0, y: 64.0 },
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
        // console.log('tick', delta);
        if (this.state.playing) {
          const newPosition = Math.fround(this.state.currentPosition + delta/1000);
          this.setState({ 
            lastTime: now,
            currentPosition: newPosition,
            currentUnderPlayhead: getCurrentBlocksUnderPlayhead(newPosition, this.state.tracks)
          });
        }
      }
    }
  }

  moveBlock = (trackId: number, blockId: number, newStart: number) => {
    // console.log(`moveBlock ${trackId}/${blockId} to x: ${newStart}`);
    const tracks = this.state.tracks.map(track => track.id === trackId
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
  }

  trimBlock = (trackId: number, blockId: number, startDelta: number, durationDelta: number) => {
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
    console.log('changeCursor to:', style);
    this.setState({ cursorStyle: style });
  }

  handleZoom = (delta: { x: number, y: number }) => {
    const { scale } = this.state;
    scale.x = scale.x + delta.x;
    scale.y = scale.y + delta.y;
    this.setState({ scale });
  }


  render = () => {
    const tracks = this.state.tracks;
    const rect = (this.ref && this.ref.current) 
      ? this.ref.current.getBoundingClientRect() 
      : null;
    const offset = rect === null 
      ? { x: 0, y: 0 }
      : { x: rect.left, y: rect.top };

    const tracksStyle = {
      height: this.state.tracks.length * this.state.scale.y
    }

    const style = {
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
  
        <div className="tracks" style={tracksStyle}>
          {tracks.map(track => 
            <Track 
              {...track}
              key={track.id}
              height={this.state.scale.y}
              scale={this.state.scale}
              trackTitleWidth={0}
              moveBlock={this.moveBlock}
              moveTargetPosition={this.moveTargetPosition}
              trimBlock={this.trimBlock}
              changeCursor={this.changeCursor}
              offset={offset}
            />
          )}
        </div>

      {this.state.targetPosition &&
       <Playhead 
          position={this.state.targetPosition}
          type={PlayheadType.Target}
          height={this.state.tracks.length * this.state.scale.y}
          scale={this.state.scale}
       />
      }
      
      <Playhead
        position={this.state.currentPosition}
        type={PlayheadType.Current}
        height={this.state.tracks.length * this.state.scale.y}
        scale={this.state.scale}
      />

        <div className="controls">
          <button onClick={(e) => { this.handleZoom({ x: -4, y: 0 }) }}>
            zoom -
          </button>
          <button onClick={(e) => { this.handleZoom({ x: 4, y: 0 }) }}>
            zoom +
          </button>
        </div>

        <div className="debug">
          <code>
            {JSON.stringify(this.state)}
          </code>
        </div>

      </div>
    );
  }

}
  

export default Timeline;
