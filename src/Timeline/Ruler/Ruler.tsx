import React from 'react';
import './Ruler.scss';

import { IVector2} from '../Timeline';
import { absoluteToTimelinePosition } from '../Track/Block/Block';

interface IUnitMarkersProps {
  width: number, 
  height: number,
  scale: IVector2,
  offset: IVector2,
  parentWidth: number,
  setPlayhead: (position: number) => void
}

const UnitMarkers: React.FC<IUnitMarkersProps> = (props) => {
  const numMarkers = Math.floor((props.width - props.offset.x) / props.scale.x);
  const markers = Array(numMarkers).fill(null).map( (m, index) => {
    const markerStyle = {
      left: index * props.scale.x,
    }
    return (
      <div className="marker" style={markerStyle} key={index}>
        {index}
      </div>

    );
  });

  const rulerStyle = {
    width: props.width,
    height: props.height
  }

  return (
    <div 
      className="UnitMarkers" 
      style={rulerStyle}
      onClick={(e) => {
        console.log(e.currentTarget.scrollLeft);
        props.setPlayhead(absoluteToTimelinePosition(e.clientX, props.offset.x, 0, props.scale.x))
      }}
    >
      {markers}
    </div>
  )
}

export default UnitMarkers;