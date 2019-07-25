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

const scale = 1;

const Playhead: React.FC<IPlayheadProps> = (props) => {

  const style = {
    left: props.position * scale,
    backgroundColor: props.type === PlayheadType.Current ? 'green' : 'grey'
  }
  return (
    <div className="Playhead" style={style} />
  )
}

export default Playhead;