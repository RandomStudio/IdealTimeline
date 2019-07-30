import React from 'react';
import { Rect } from 'react-konva';
import { Vector2d } from 'konva/types/types';

import './Block.scss';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number
}

export interface IBlockProps extends IBlock {}

const scale = 1;
const LAYER_LEFT = 128;

enum trimMode {
  left = 'left',
  right = 'right'
}


class Block extends React.Component<IBlockProps> {

  state = {
  }

  handleDrag = (pos: Vector2d) => {
    return ({
      x: pos.x,
      y: 0
    });
  }

  render = () => <Rect 
    x={this.props.start * scale}
    y={0}
    width={this.props.duration * scale}
    height={64}
    fill={"#ff0000"}
    draggable={true}
    dragBoundFunc={this.handleDrag}
  />
  
}

export default Block;
