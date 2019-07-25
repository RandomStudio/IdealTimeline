import React from 'react';
import Layer, { ILayer } from './Layer/Layer';
import { IBlockFunctions } from './Layer/Block/Block';

export interface ITimeline {
  layers: ILayer[]
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

        <div className="layers">
          {layers.map(layer => <Layer {...layer} key={layer.id} moveBlock={props.moveBlock} /> )}
        </div>

    </div>
  );
}

export default Timeline;
