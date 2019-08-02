import React from 'react';
import { Stage, Layer, Rect} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { CursorType } from './Track/Block/Block';
import { KonvaEventObject } from 'konva/types/Node';
//@ts-ignore
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Konva from 'konva';

export interface ITimeline {
  tracks: ITrack[],
}

export interface ITimelineState {
  currentPosition: number,
  targetPosition: number | null,
  playing: boolean,
  lastTime: number | null,
  tracks: ITrack[]
}

interface ITimelineProps extends ITimeline {
}  

class Timeline extends React.Component<ITimelineProps, ITimelineState> {

  stageRef: React.Ref<Stage> = React.createRef();

  state = {
    currentPosition: 0,
    targetPosition: null,
    playing: false,
    lastTime: null,
    tracks: []
  } as ITimelineState;

  componentDidMount = () => {
    this.setState({ tracks: this.props.tracks });
    requestAnimationFrame(this.tick);
  }

  
  tick = (now: number) => {
    requestAnimationFrame(this.tick);
    if (!this.state.lastTime) {
      this.state.lastTime = now;
    }
    const delta = now - this.state.lastTime;
    // console.log('now', now, 'delta', delta);
    if (delta > 1000/60) {
      this.state.lastTime = now;
      // console.log('tick', delta);
      if (this.state.playing) {
        this.setState({ currentPosition: Math.fround(this.state.currentPosition + delta)});
      }
    }
  }


  moveBlock = (trackId: number, blockId: number, newStart: number) => {
    console.log(`moveBlock ${trackId}/${blockId} to x: ${newStart}`);
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
    this.setState({ targetPosition: newPosition });
  }

  togglePlayback = () => {
    console.log('toggleplayback');
    this.setState(prevState => {
      const before = prevState.playing;
      const after = !prevState.playing;
      console.log('PLAYING: was', before, 'now', after);
      return { ...prevState, playing: after, timer: null };
    });
  }

  setPlayhead = (position: number) => {
    console.log('setPlayhead to position', position);
    this.setState({ currentPosition: position });
  }

  changeCursor = (style: CursorType) => {
    console.log('changeCursor to:', style);
    if (this.stageRef) {
      //@ts-ignore -- because .current does not exist on type?!
      this.stageRef.current.container().style.cursor = style;
    }
  }

  render = () => {
    const tracks = this.state.tracks;
    return (
      <div className="Timeline">
  
        <div className="debug">
          <code>
            {JSON.stringify(this.state)}
          </code>
        </div>

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
  
        <Stage 
          ref={this.stageRef}
          width={1000} 
          height={256}
          onClick={(e: KonvaEventObject<MouseEvent>) => { this.setPlayhead(e.evt.layerX * 1000 / 60) }}
        >
          <Layer>
            {tracks.map(track => <Track 
              {...track} 
              key={track.id} 
              moveBlock={this.moveBlock}
              trimBlock={this.trimBlock}
              moveTargetPosition={this.moveTargetPosition}
              changeCursor={this.changeCursor}
              /> 
            )}
          </Layer>
          <Layer>
            <Playhead type={PlayheadType.Current} position={this.state.currentPosition / 1000 * 60} height={256} />
          </Layer>
          {this.state.targetPosition !== null &&
            <Layer>
              <Playhead type={PlayheadType.Target} position={this.state.targetPosition} height={256} />
            </Layer>
          }
        </Stage>
      </div>
    );
  }

}
  

export default Timeline;
