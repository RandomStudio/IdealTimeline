import React from 'react';
import './Track.scss';
import Block, { IBlock } from './Block/Block';

import { Group } from 'react-konva';

export interface ITrack {
    id: number,
    name: string;
    blocks: IBlock[]
}

export interface ITrackProps extends ITrack {}

const Track: React.FC<ITrackProps> = (props) => {
  return (
    <Group>
      {props.blocks.map(block => 
        <Block 
          id={block.id}
          name={block.name}
          start={block.start}
          duration={block.duration}
        />
      )}
    </Group>
  );
}

export default Track;
