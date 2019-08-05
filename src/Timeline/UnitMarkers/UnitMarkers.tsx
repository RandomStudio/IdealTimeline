import React from 'react';
import { Group, Text, Line } from 'react-konva';

interface IUnitMarkersProps {
  distance: number,
  parentWidth: number
  parentHeight: number
}

const UnitMarkers: React.FC<IUnitMarkersProps> = (props) => {
  const numMarkers = Math.floor(props.parentWidth / props.distance);
  const markers = Array(numMarkers).fill(null).map((m, index) => {
    const x = props.distance * index;
    const height = props.parentHeight;
    const color = "#dddddd"
    return (
      <Group>
        <Line 
          points={[ x, 0, x, height]}
          stroke={color}
        />
        <Text
          text={String(index)}
          x={x+ 5}
          y={height - 10}
          fill={color}
        />
      </Group>

    )
  }
  );

  return (
    <Group>
      {markers}
    </Group>
  )
}

export default UnitMarkers;