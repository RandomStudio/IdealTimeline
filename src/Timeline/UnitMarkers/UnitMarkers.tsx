import React from 'react';
import './UnitMarkers.scss';

import { IVector2} from '../Timeline';
import { absoluteToTimelinePosition } from '../Track/Block/Block';

interface IUnitMarkersProps {
  scale: IVector2,
  offset: IVector2,
  parentWidth: number,
  setPlayhead: (position: number) => void
}

const UnitMarkers: React.FC<IUnitMarkersProps> = (props) => {
  const numMarkers = Math.floor((props.parentWidth - props.offset.x) / props.scale.x);
  const markers = Array(numMarkers).fill(null).map( (m, index) => {
    const style = {
      left: index * props.scale.x
    }
    return (
      <div className="marker" style={style} key={index}>
        {index}
      </div>

    );
  });

  return (
    <div 
      className="UnitMarkers" 
      onClick={(e) => 
        props.setPlayhead(absoluteToTimelinePosition(e.clientX, props.offset.x, 0, props.scale.x))
      }
    >
      {markers}
    </div>
  )
}

export default UnitMarkers;