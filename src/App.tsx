import React from 'react';
import './App.scss';
import Timeline, { ITimeline } from './Timeline/Timeline';


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
          duration: 4
        }
      ]
    }    
  ]
} as ITimeline;

interface IAppState {
  timeline: ITimeline 
}



class App extends React.Component<any, IAppState> {

  state = {
    timeline: dummy,
    playing: false,  
    currentPosition: 0, 
    targetPosition: null
  } as IAppState


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
          />
        </main>

      </div>
    );
  
} 

export default App;
