import React from 'react';
import './Timeline.scss';
import Layer, { ILayer } from './Layer/Layer';
import { IBlockFunctions } from './Layer/Block/Block';
import Playhead, { PlayheadType } from './Playhead/Playhead';

export interface ITimeline {
  layers: ILayer[],
  currentPosition: number,
  targetPosition: number | null
}

interface ITimelineProps extends ITimeline, IBlockFunctions {}

const Timeline: React.FC<ITimelineProps> = (props) => {
  const layers = props.layers;
  return (
    <div className="Timeline">
        <div className="debug">
            <code>
                {JSON.stringify(props)}
            </code>
        </div>

        <Playhead position={props.currentPosition} type={PlayheadType.Current} />

        {typeof props.targetPosition === 'number' &&
          <Playhead position={props.targetPosition} type={PlayheadType.Target} />
        }

        <div className="layers">
          {layers.map(layer => <Layer 
            {...layer} 
            key={layer.id} 
            moveBlock={props.moveBlock} 
            moveTargetPosition={props.moveTargetPosition}
          /> 
          )}
        </div>
    </div>
  );
}

export default Timeline;
