import React from 'react';
import { Rect } from 'react-konva';
import './Playhead.scss';

export enum PlayheadType {
  Current = "Current",
  Target = "Target"
}

export interface IPlayheadProps {
  position: number,
  type: PlayheadType,
  height: number
}

const scale = 1;
const start = 128;

const Playhead: React.FC<IPlayheadProps> = (props) => {

  const style = {
    left: props.type === PlayheadType.Current 
      ? props.position / scale + start 
      : props.position / scale,
    backgroundColor: props.type === PlayheadType.Current ? 'green' : 'grey'
  }
  return (
    <Rect
      x={props.position}
      y={0}
      width={2}
      height={props.height}
      fill={props.type === PlayheadType.Current ? "blue": "gray"}
      opacity={0.6}
    />
  )
}

export default Playhead;