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

  const style = {
    height: props.height,
    top: props.height * props.id
  }

  return (
    <div className="track" style={style}>
      <div className="name">
        {props.name}
      </div>
      <div className="blocks">
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
