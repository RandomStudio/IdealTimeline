import React from 'react';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { CursorType } from './Track/Block/Block';
//@ts-ignore
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import { Vector2d } from 'konva/types/types';
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
  scale: Vector2d,
  trackTitleWidth: number
}

interface ITimelineProps extends ITimeline {
  width: number,
  height: number
}  

const NORMAL_HEIGHT = 64;

class Timeline extends React.Component<ITimelineProps, ITimelineState> {

  state = {
    currentPosition: 0,
    targetPosition: null,
    playing: false,
    lastTime: null,
    tracks: [],
    scale: { x: 100.0, y: 1.0 },
    trackTitleWidth: 0
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
    // console.log(`trimBlock ${trackId}/${blockId}: startDelta: ${startDelta}, durationDelta: ${durationDelta}`);
    const tracks = this.state.tracks.map(track => track.id === trackId
        ? { 
          ...track, 
          blocks: track.blocks.map(block => block.id === blockId
            ? {
              ...block,
              start: block.start + startDelta / this.state.scale.x,
              duration: block.duration + durationDelta / this.state.scale.x
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
    // console.log('toggleplayback');
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
    // console.log('changeCursor to:', style);
  }

  handleZoom = (delta: Vector2d) => {
    const { scale } = this.state;
    scale.x = scale.x + delta.x;
    scale.y = scale.y + delta.y;
    this.setState({ scale });
  }

  render = () => {
    const tracks = this.state.tracks;
    return (
      <div className="Timeline">
  
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
  
       <div>
         Timeline goes here
       </div>

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
