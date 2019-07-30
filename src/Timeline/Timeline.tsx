import React from 'react';
import { Stage, Layer, Rect} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { IBlockFunctions, CursorType } from './Track/Block/Block';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';


export interface ITimeline {
  tracks: ITrack[],
  currentPosition: number,
  targetPosition: number | null,
}

interface ITimelineProps extends ITimeline, IBlockFunctions {
  setPlayhead: (newPosition: number) => void
}  

class Timeline extends React.Component<ITimelineProps> {
  
  changeCursor = (style: CursorType)

  render = () => {
    const tracks = this.props.tracks;
    return (
      <div className="Timeline">
  
        <div className="debug">
          <code>
            {JSON.stringify(this.props)}
          </code>
        </div>
  
        <Stage 
          width={1000} 
          height={256}
          onClick={(e: KonvaEventObject<MouseEvent>) => { this.props.setPlayhead(e.evt.layerX * 1000 / 60) }}
        >
          <Layer>
            {tracks.map(track => <Track 
              {...track} 
              key={track.id} 
              moveBlock={this.props.moveBlock}
              trimBlock={this.props.trimBlock}
              moveTargetPosition={this.props.moveTargetPosition}
              changeCursor={(style) => this.changeCursor}
              /> 
            )}
          </Layer>
          <Layer>
            <Playhead type={PlayheadType.Current} position={this.props.currentPosition / 1000 * 60} height={256} />
          </Layer>
          {this.props.targetPosition !== null &&
            <Layer>
              <Playhead type={PlayheadType.Target} position={this.props.targetPosition} height={256} />
            </Layer>
          }
        </Stage>
      </div>
    );
  }
  }

  

export default Timeline;
