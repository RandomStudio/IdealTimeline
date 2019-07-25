import React from 'react';
import './Layer.scss';
import Block, { BlockProps } from './Block/Block';

export interface LayerProps {
    id: number,
    name: string;
    blocks: BlockProps[]
}

const Layer: React.FC<LayerProps> = (props) => {
  return (
    <div className="Layer">
      <div className="layer-label">
        {props.id}: {props.name}
      </div>
      <div className="layer-content">
        {props.blocks.map(block => <Block {...block} key={block.id} />)}      
      </div>
    </div>
  );
}

export default Layer;
