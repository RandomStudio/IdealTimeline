import React from 'react';

export interface LayerProps {
    id: number,
    name: string;
}

const Layer: React.FC<LayerProps> = (props) => {
  return (
    <div className="Layer">
        {props.id}: {props.name}
    </div>
  );
}

export default Layer;
