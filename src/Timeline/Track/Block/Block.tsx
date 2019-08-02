import React from 'react';
import { 
  Rect,
  Group,
  Text
} from 'react-konva';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';
import { posix } from 'path';
import Konva from 'konva';

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

  state = {      

  }

  constrainDrag = (pos: Vector2d) => {
    return ({
      x: pos.x >= 0 ? pos.x : 0,
      y: this.props.height * this.props.layerId
    });
  }

  

  render = () => {
    const x = this.props.start * this.props.scaleX;
    const width = this.props.duration * this.props.scaleX;
    return (
      <Group
        x={x}
        y={0}
        draggable={true}
        dragBoundFunc={this.constrainDrag}
        onDragMove={(e: KonvaEventObject<DragEvent>) => { 
          this.props.changeCursor(CursorType.moving);
          this.props.moveTargetPosition(e.currentTarget.attrs.x);
        }}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => { 
          this.props.moveBlock(this.props.layerId, this.props.id, e.currentTarget.attrs.x / this.props.scaleX);
          this.props.moveTargetPosition(null);
          this.props.changeCursor(CursorType.move);
        }}
      >
        <Rect 
          x={0}
          y={0}
          width={width}
          height={this.props.height}
          fill={"black"}
          onMouseEnter={() => this.props.changeCursor(CursorType.move)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
        <Text
          text={this.props.name}
          fill={"white"}
        />
        <Rect
          key="trim-right"
          x={width-handleWidth}
          y={0}
          width={handleWidth}
          height={this.props.height}
          fill={"red"}
          draggable={true}
          dragBoundFunc={this.constrainDrag}
          onDragMove={(e: KonvaEventObject<DragEvent>) => { this.props.trimBlock(this.props.layerId, this.props.id, 0, e.currentTarget.attrs.x - width)}}
          opacity={0.2}
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
        <Rect
          key="trim-left"
          x={0}
          y={0}
          width={handleWidth}
          height={this.props.height}
          fill={"green"}
          draggable={true}
          dragBoundFunc={this.constrainDrag}
          onDragMove={(e: KonvaEventObject<DragEvent>) => { this.props.trimBlock(this.props.layerId, this.props.id, e.currentTarget.attrs.x, -e.currentTarget.attrs.x)}}
          opacity={0.2}
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />
      </Group>
    )
  }
  
}

export default Block;