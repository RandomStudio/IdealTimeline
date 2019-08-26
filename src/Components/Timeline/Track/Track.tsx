import React from 'react';
import './Track.scss';
import Block, { IBlock, IBlockFunctions } from './Block/Block';

export interface ITrack {
    id: number,
    name: string;
    blocks: IBlock[],
    selectedBlocks: IBlock[]
  }
  
  export interface ITrackProps extends ITrack, IBlockFunctions {
    width: number;
    height: number;
    scale: { x: number, y: number };
    offset: { x: number, y: number };
    trackTitleWidth: number
  }

const Track: React.FC<ITrackProps> = (props) => {

  const style = {
    width: props.width,
    height: props.height,
    // top: props.height * props.id
  }

  return (
    <div className="Track" style={style}>
      <div className="name">
        {props.name}
      </div>
      <div className="blocks">
        {props.blocks.map(block => 
          <Block 
            key={block.id}
            id={block.id}
            trackId={props.id}
            name={block.name}
            start={block.start}
            duration={block.duration}
            height={props.height}
            scale={props.scale}
            moveBlock={props.moveBlock}
            trimBlock={props.trimBlock}
            moveTargetPosition={props.moveTargetPosition}
            changeCursor={props.changeCursor}
            selectBlock={props.selectBlock}
            offset={props.offset}
            selected={props.selectedBlocks.find(b => b.id === block.id) !== undefined}
          />
        )}
      </div>
    </div>
  );
}

export default Track;
