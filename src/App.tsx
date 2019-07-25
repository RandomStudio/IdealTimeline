import React from 'react';
import './App.css';
import Timeline, { ITimeline } from './Timeline/Timeline';
//@ts-ignore
import KeyHandler, { KEYPRESS } from 'react-key-handler';

const dummy = {
  layers: [
    {
      id: 0,
      name: "layer1",
      blocks: [
        {
          id: 0,
          name: "One",
          start: 0,
          duration: 60
        },
        {
          id: 1,
          name: "Two",
          start: 70,
          duration: 30
        }
      ]
    },
    {
      id: 1,
      name: "layer2",
      blocks: [
        {
          id: 0,
          name: "Another",
          start: 15,
          duration: 30
        }
      ]
    } 
  ],
} as ITimeline;

interface IAppState {
  timeline: ITimeline,
  playing: boolean,
  currentPosition: number,
}

let lastTime: number;

class App extends React.Component<any, IAppState> {

  state = {
    timeline: dummy,
    playing: false,  
    currentPosition: 0, 
  } as IAppState

  // updateBlock = (layerId: number, blockId: number, updated: {}) => {

  // }

  tick = (now: number) => {
    requestAnimationFrame(this.tick);
    if (!lastTime) {
      lastTime = now;
    }
    const delta = now - lastTime;
    // console.log('now', now, 'delta', delta);
    if (delta > 1000/60) {
      lastTime = now;
      // console.log('tick', delta);
      if (this.state.playing) {
        this.setState({ currentPosition: this.state.currentPosition + delta });
      }
    }
  }

  componentDidMount = () => {
    requestAnimationFrame(this.tick);
  }

  moveBlock = (layerId: number, blockId: number, newStart: number) => {
    // console.log(`moveBlock ${layerId}/${blockId} to x: ${newStart}`);
    const updateTimeline = {
      ...this.state.timeline,
      layers: this.state.timeline.layers.map(layer => layer.id === layerId
        ? { 
          ...layer, 
          blocks: layer.blocks.map(block => block.id === blockId
            ? {
              ...block,
              start: newStart
            }
            : block
          )
        }
        : layer
      )
    }
    this.setState({ timeline: updateTimeline });
  }

  moveTargetPosition = (newPosition: number | null) => {
    const updateTimeline =  { ...this.state.timeline, targetPosition: newPosition };
    this.setState({ timeline: updateTimeline });
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

  render = () => (
      <div className="App">

        <header className="App-header">
          Timeline Demo
        </header>

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

        <main>
          <Timeline 
            {...this.state.timeline} 
            currentPosition={this.state.currentPosition}
            moveBlock={this.moveBlock} 
            moveTargetPosition={this.moveTargetPosition} 
          />
        </main>

      </div>
    );
  
} 

export default App;
