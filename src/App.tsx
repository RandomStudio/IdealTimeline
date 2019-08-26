import React from 'react';
import './App.scss';
import Timeline, { ITimeline, IVector2, ITimelinePlayback } from './Timeline/Timeline';
import Defaults from './Data/Defaults';
import * as Dummy from './Data/Dummy';

interface IAppState {
  timeline: ITimeline,
  scale: IVector2,
  playbackState: ITimelinePlayback
}



class App extends React.Component<any, IAppState> {

  state = {
    timeline: Dummy.dummy1,
    scale: Defaults.scale
  } as IAppState

  handleZoom = (newScale: { x: number, y: number }, absolute: boolean = false) => {
    let { scale } = this.state;
    scale = absolute === true
      ? newScale
      : {
        x: scale.x + newScale.x,
        y: scale.y + newScale.y
      }
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
            reportPlaybackState={(timelineState: ITimelinePlayback) => this.setState({ playbackState: timelineState })}
          />

          <div className="clock">
            {this.state.playbackState && 
              <code>
                POSITION: {this.state.playbackState.currentPosition.toFixed(2)}
                {' '}
                TRANSPORT: {this.state.playbackState.playing ? 'playing': 'paused'}
              </code>
            }
          </div>

          <div className="controls">
              <button onClick={(e) => { this.handleZoom({ x: -4, y: 0 }) }}>
              zoom -
            </button>
            <button onClick={(e) => { this.handleZoom({ x: 4, y: 0 }) }}>
              zoom +
            </button>
            <button onClick={(e) => { this.handleZoom(Defaults.scale, true) }}>
              reset
            </button>
          </div>

          {this.state.playbackState &&
            <div className="debug">
              <ol>
              {this.state.playbackState.currentUnderPlayhead.map(block => 
                <li><code>{JSON.stringify(block)}</code></li>                
              )}
              </ol>
            </div>
          }
          
        </main>

      </div>
    );
  
} 

export default App;
