import React from 'react';
import './App.css';
import Timeline, { ITimeline } from './Timeline/Timeline';

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
  currentPosition: 0
} as ITimeline;


class App extends React.Component {

  state = {
    timeline: dummy,
  }

  // updateBlock = (layerId: number, blockId: number, updated: {}) => {

  // }

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
    // console.log('moveTargetPosition', newPosition);
    const updateTimeline =  { ...this.state.timeline, targetPosition: newPosition };
    this.setState({ timeline: updateTimeline });
  }

  render = () => (
      <div className="App">
        <header className="App-header">
          Timeline Demo
        </header>
        <main>
          <Timeline 
            {...this.state.timeline} 
            moveBlock={this.moveBlock} 
            moveTargetPosition={this.moveTargetPosition} 
          />
        </main>
      </div>
    );
  
} 

export default App;
