import React from 'react';
import Layer, { LayerProps } from './Layer/Layer';

interface TimelineProps {
    timeline: {
      layers: [ LayerProps ]
    }
}

const Timeline: React.FC<TimelineProps> = (props) => {
  const layers = props.timeline.layers;
  return (
    <div className="Timeline">
        <div className="debug">
            <code>
                {JSON.stringify(props.timeline)}
            </code>
        </div>

        <div className="layers">
          {layers.map(layer => <Layer {...layer} key={layer.id} /> )}
        </div>

    </div>
  );
}

export default Timeline;
