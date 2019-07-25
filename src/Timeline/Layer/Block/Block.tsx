import React from 'react';
import './Block.scss';

export interface BlockProps {
    id: number,
    name: string,
    start: number,
    duration: number
}

const scale = 2;

const Block: React.FC<BlockProps> = (props) => {

  const style = {
    left: props.start * scale,
    width: props.duration * scale
  }

  return (
    <div className="Block" style={style}>
        {props.name}
    </div>
  );
}

export default Block;
