import React from 'react';
import './App.scss';
import Timeline, { ITimeline, IVector2 } from './Timeline/Timeline';
import Defaults from './Defaults';


const dummy = {
  tracks: [
    {
      id: 0,
      name: "T1",
      blocks: [
        {
          id: 0,
          name: "One",
          start: 0,
          duration: 1
        },
        {
          id: 1,
          name: "Two",
          start: 2,
          duration: 2
        }
      ]
    },
    {
      id: 1,
      name: "T2",
      blocks: [
        {
          id: 0,
          name: "Three",
          start: 0.5,
          duration: 3
        },
        {
          id: 1,
          name: "Four",
          start: 3.5,
          duration: 5
        }
      ]
    }    
  ]
} as ITimeline;

interface IAppState {
  timeline: ITimeline,
  scale: IVector2
}



class App extends React.Component<any, IAppState> {

  state = {
    timeline: dummy,
    scale: Defaults.scale,
    playing: false,  
    currentPosition: 0, 
    targetPosition: null
  } as IAppState

  handleZoom = (delta: { x: number, y: number }) => {
    const { scale } = this.state;
    scale.x = scale.x + delta.x;
    scale.y = scale.y + delta.y;
    this.setState({ scale });
  }

  render = () => (
      <div className="App">

        <header className="App-header">
          Timeline Demo
        </header>

        <main>
          <Timeline 
            {...this.state.timeline} 
            width={window.innerWidth}
            height={window.innerHeight/2}
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
          
        </main>

      </div>
    );
  
} 

export default App;
