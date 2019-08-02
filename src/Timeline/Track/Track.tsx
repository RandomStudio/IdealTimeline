import React from 'react';
import './Track.scss';
import Block, { IBlock, IBlockFunctions } from './Block/Block';

import { Group, Text } from 'react-konva';

export interface ITrack {
    id: number,
    name: string;
    blocks: IBlock[],
  }
  
  export interface ITrackProps extends ITrack, IBlockFunctions {
    height: number;
    scaleX: number;
    trackTitleWidth: number
  }

const Track: React.FC<ITrackProps> = (props) => {
  return (
    <Group
      y={props.height * props.id}
    >
      <Text
        text={props.name}
      />
      <Group
        x={props.trackTitleWidth}
      >
        {props.blocks.map(block => 
          <Block 
            key={block.id}
            id={block.id}
            layerId={props.id}
            name={block.name}
            start={block.start}
            duration={block.duration}
            height={props.height}
            scaleX={props.scaleX}
            moveBlock={props.moveBlock}
            trimBlock={props.trimBlock}
            moveTargetPosition={props.moveTargetPosition}
            changeCursor={props.changeCursor}
          />
        )}
      </Group>
    </Group>
  );
}

export default Track;
