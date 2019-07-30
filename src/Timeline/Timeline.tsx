import React from 'react';
import { Stage, Layer, Rect} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { IBlockFunctions } from './Track/Block/Block';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';


export interface ITimeline {
  tracks: ITrack[],
  currentPosition: number,
  targetPosition: number | null
}

interface ITimelineProps extends ITimeline, IBlockFunctions {
  setPlayhead: (newPosition: number) => void
}  

const Timeline: React.FC<ITimelineProps> = (props) => {
  const tracks = props.tracks;
  return (
    <div className="Timeline">

      <div className="debug">
        <code>
          {JSON.stringify(props)}
        </code>
      </div>

      <Stage 
        width={1000} 
        height={256}
        onClick={(e: KonvaEventObject<MouseEvent>) => { props.setPlayhead(e.evt.layerX * 1000 / 60) }}
      >
        <Layer>
          {tracks.map(track => <Track 
            {...track} 
            key={track.id} 
            moveBlock={props.moveBlock}
            trimBlock={props.trimBlock}
            moveTargetPosition={props.moveTargetPosition}
            /> 
          )}
        </Layer>
        <Layer>
          <Playhead type={PlayheadType.Current} position={props.currentPosition / 1000 * 60} height={256} />
        </Layer>
        {props.targetPosition !== null &&
          <Layer>
            <Playhead type={PlayheadType.Target} position={props.targetPosition} height={256} />
          </Layer>
        }
      </Stage>
    </div>
  );
}

export default Timeline;
