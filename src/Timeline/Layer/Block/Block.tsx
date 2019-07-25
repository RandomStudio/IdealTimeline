import React from 'react';

export interface BlockProps {
    id: number,
    name: string;
}

const Block: React.FC<BlockProps> = (props) => {
  return (
    <div className="Block">
        {props.id}: {props.name}
    </div>
  );
}

export default Block;
