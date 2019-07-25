import React from 'react';
import Layer, { LayerProps } from './Layer/Layer';

export interface TimelineProps {
  layers: [ LayerProps ]
}

const Timeline: React.FC<TimelineProps> = (props) => {
  const layers = props.layers;
  return (
    <div className="Timeline">
        <div className="debug">
            <code>
                {JSON.stringify(props)}
            </code>
        </div>

        <div className="layers">
          {layers.map(layer => <Layer {...layer} key={layer.id} /> )}
        </div>

    </div>
  );
}

export default Timeline;
