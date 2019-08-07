import React from 'react';
import './Playhead.scss';
import { timelineToAbsolute } from '../Track/Block/Block';


export enum PlayheadType {
  Current = "Current",
  Target = "Target"
}

export interface IPlayheadProps {
  position: number,
  type: PlayheadType,
  height: number,
  scale: { x: number, y: number }
}

const Playhead: React.FC<IPlayheadProps> = (props) => {

  const style = {
    left: timelineToAbsolute(props.position, props.scale.x),
    height: props.height,
    backgroundColor: props.type === PlayheadType.Current ? 'green' : 'grey'
  }
  return (
    <div className="Playhead" style={style} />
  )
}

export default Playhead;