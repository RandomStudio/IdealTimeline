import React from 'react';
import './Layer.scss';
import Block, { IBlock, IBlockFunctions } from './Block/Block';

export interface ILayer {
    id: number,
    name: string;
    blocks: IBlock[]
}

export interface ILayerProps extends ILayer, IBlockFunctions {}

const Layer: React.FC<ILayerProps> = (props) => {
  return (
    <div className="Layer">
      <div className="layer-label">
        {props.id}: {props.name}
      </div>
      <div className="layer-content">
        {props.blocks.map(block => <Block 
          {...block} 
          layerId={props.id} 
          key={`${props.id}-${block.id}`} 
          moveBlock={props.moveBlock} 
          moveTargetPosition={props.moveTargetPosition}
        />)}      
      </div>
    </div>
  );
}

export default Layer;
