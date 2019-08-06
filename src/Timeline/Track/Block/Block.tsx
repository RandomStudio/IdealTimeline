import React from 'react';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
}

export enum CursorType {
  default = 'default',
  move = 'grab',
  moving = 'grabbing',
  resize = 'ew-resize'
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void,
  moveTargetPosition: (newPosition: number | null) => void,
  trimBlock: (trackId: number, blockId: number, startDelta: number, durationDelta: number) => void,
  changeCursor: (style: CursorType) => void,
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number,
  height: number,
  scaleX: number
}

const handleWidth = 10;


class Block extends React.Component<IBlockProps> {

  constrainDrag = (pos: { x: number, y: number }) => {
    return ({
      x: pos.x >= 0 ? pos.x : 0,
      y: this.props.height * this.props.layerId
    });
  }

  render = () => {
    const x = this.props.start * this.props.scaleX;
    const width = this.props.duration * this.props.scaleX;
    return (
      <div
        draggable={true}
      >
        <span>{this.props.name}</span>
        <div
          key="trim-right"
          draggable={true}
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
        <div
          key="trim-left"
          draggable={true}
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
      </div>
    )
  }
  
}

export default Block;