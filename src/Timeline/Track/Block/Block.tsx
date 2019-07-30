import React from 'react';
import { 
  Rect,
  Group
} from 'react-konva';
import { Vector2d } from 'konva/types/types';
import { KonvaEventObject } from 'konva/types/Node';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
  height: number
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number
}

const scale = 1;

enum trimMode {
  left = 'left',
  right = 'right'
}


class Block extends React.Component<IBlockProps> {

  state = {      

  }

  constrainDrag = (pos: Vector2d) => {
    return ({
      x: pos.x,
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
        onDragEnd={(e: KonvaEventObject<DragEvent>) => { this.props.moveBlock(this.props.layerId, this.props.id, e.currentTarget.attrs.x) }}
        x={x}
        >
        <Rect 
          x={0}
          y={0}
          width={width}
          height={this.props.height}
          fill={"#ff0000"}
        />
        <Rect
          x={0}
          y={0}
          width={4}
          height={this.props.height}
          fill={"#333333"}
          draggable={true}
          dragBoundFunc={this.constrainDrag}
        />
      </Group>
    )
  }
  
}

export default Block;
