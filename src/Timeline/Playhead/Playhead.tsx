import React from 'react';
import './Playhead.scss';

export enum PlayheadType {
  Current = "Current",
  Target = "Target"
}

export interface IPlayheadProps {
  position: number,
  type: PlayheadType
}

const scale = 10;
const start = 128;

const Playhead: React.FC<IPlayheadProps> = (props) => {

  const style = {
    left: props.type === PlayheadType.Current 
      ? props.position / scale + start 
      : props.position / scale,
    backgroundColor: props.type === PlayheadType.Current ? 'green' : 'grey'
  }
  return (
    <div className="Playhead" style={style} />
  )
}

export default Playhead;