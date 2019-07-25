import React from 'react';
import './App.css';
import Timeline, { TimelineProps } from './Timeline/Timeline';
import { LayerProps } from './Timeline/Layer/Layer';

const dummy = {
  layers: [
      {
          id: 0,
          name: "layer1",
          blocks: []
      } 
  ]
} as TimelineProps;

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        Timeline Demo
      </header>
      <main>
        <Timeline {...dummy} />
      </main>
    </div>
  );
}

export default App;
