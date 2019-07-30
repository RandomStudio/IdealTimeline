import React from 'react';
import './Track.scss';
import Block, { IBlock, IBlockFunctions } from './Block/Block';

import { Group } from 'react-konva';

export interface ITrack {
    id: number,
    name: string;
    blocks: IBlock[]
}

export interface ITrackProps extends ITrack, IBlockFunctions {}

const Track: React.FC<ITrackProps> = (props) => {
  return (
    <Group>
      {props.blocks.map(block => 
        <Block 
          id={block.id}
          layerId={props.id}
          name={block.name}
          start={block.start}
          duration={block.duration}
          height={64}
          moveBlock={props.moveBlock}
          trimBlock={props.trimBlock}
        />
      )}
    </Group>
  );
}

export default Track;
