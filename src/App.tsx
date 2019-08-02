import React from 'react';
import './App.css';
import Timeline, { ITimeline } from './Timeline/Timeline';


import { CursorType } from './Timeline/Track/Block/Block';


const dummy = {
  tracks: [
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
          start: 60,
          duration: 120
        }
      ]
    }    
  ],
  targetPosition: null
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
          />
        </main>

      </div>
    );
  
} 

export default App;
