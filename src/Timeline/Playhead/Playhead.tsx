import React from 'react';
import './Playhead.scss';

export interface IPlayheadProps {
  position: number
}

const scale = 1;

const Playhead: React.FC<IPlayheadProps> = (props) => {
  const style = {
    left: props.position * scale
  }
  return (
    <div className="Playhead" style={style} />
  )
}

export default Playhead;