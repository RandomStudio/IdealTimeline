import React from 'react';
import './UnitMarkers.scss';

import { IScale} from '../Timeline';

interface IUnitMarkersProps {
  scale: IScale,
  parentWidth: number
}

const UnitMarkers: React.FC<IUnitMarkersProps> = (props) => {
  const numMarkers = Math.floor(props.parentWidth / props.scale.x);
  const markers = Array(numMarkers).fill(null).map( (m, index) => {
    const style = {
      left: index * props.scale.x
    }
    return (
      <div className="marker" style={style}>
        {index}
      </div>

    );
  });

  return <div className="UnitMarkers">
    {markers}
  </div>
}

export default UnitMarkers;