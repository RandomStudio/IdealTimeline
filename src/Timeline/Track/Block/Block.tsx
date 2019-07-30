import React from 'react';
import { 
  Rect,
  Group,
  Text
} from 'react-konva';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';
import { posix } from 'path';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
  height: number
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void,
  moveTargetPosition: (newPosition: number | null) => void,
  trimBlock: (trackId: number, blockId: number, startDelta: number, durationDelta: number) => void
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number
}

const scale = 1;
const handleWidth = 10;


class Block extends React.Component<IBlockProps> {

  state = {      

  }

  constrainDrag = (pos: Vector2d) => {
    return ({
      x: pos.x >= 0 ? pos.x : 0,
      y: 0
    });
  }

  

  render = () => {
    const x = this.props.start * scale;
    const width = this.props.duration * scale;
    return (
      <Group
        draggable={true}
        dragBoundFunc={this.constrainDrag}
        onDragMove={(e: KonvaEventObject<DragEvent>) => { this.props.moveTargetPosition(e.currentTarget.attrs.x) }}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => { 
          this.props.moveBlock(this.props.layerId, this.props.id, e.currentTarget.attrs.x);
          this.props.moveTargetPosition(null);
        }}
        x={x}
        >
        <Rect 
        x={0}
          y={0}
          width={width}
          height={this.props.height}
          fill={"black"}
        />
        <Text
          text={this.props.name}
          fill={"white"}
        />
        <Rect
          key="trim-right"
          x={width}
          y={0}
          width={handleWidth}
          height={this.props.height}
          fill={"red"}
          draggable={true}
          dragBoundFunc={this.constrainDrag}
          onDragMove={(e: KonvaEventObject<DragEvent>) => { this.props.trimBlock(this.props.layerId, this.props.id, 0, e.currentTarget.attrs.x - width)}}
          opacity={0.5}
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
          opacity={0.5}
        />
      </Group>
    )
  }
  
}

export default Block;