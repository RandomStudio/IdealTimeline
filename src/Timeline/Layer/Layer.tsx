import React from 'react';

interface LayerProps {
    name: string;
  }

const Layer: React.FC<LayerProps> = (props) => {
  return (
    <div className="Layer">
        {props.name}
    </div>
  );
}

export default Layer;
