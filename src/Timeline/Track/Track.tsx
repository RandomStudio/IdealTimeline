import React from 'react';
import './Track.scss';
import Block, { IBlock, IBlockFunctions } from './Block/Block';

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
    <div>
      <span>
        {props.name}
      </span>
      <div>
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
      </div>
    </div>
  );
}

export default Track;
