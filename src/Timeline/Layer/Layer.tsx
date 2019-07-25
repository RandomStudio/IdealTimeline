import React from 'react';
import { BlockProps } from './Block/Block';

export interface LayerProps {
    id: number,
    name: string;
    blocks: [ BlockProps? ] 
}

const Layer: React.FC<LayerProps> = (props) => {
  return (
    <div className="Layer">
        {props.id}: {props.name}
    </div>
  );
}

export default Layer;
