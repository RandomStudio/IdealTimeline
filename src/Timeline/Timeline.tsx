import React from 'react';
import './Timeline.scss';
import Layer, { ILayer } from './Layer/Layer';
import { IBlockFunctions } from './Layer/Block/Block';
import Playhead from './Playhead/Playhead';

export interface ITimeline {
  layers: ILayer[],
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

        {typeof props.targetPosition === 'number' &&
          <Playhead position={props.targetPosition} />
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
