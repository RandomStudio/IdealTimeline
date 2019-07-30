import React from 'react';
import { Stage, Layer, Rect} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { IBlockFunctions } from './Track/Block/Block';
import { Vector2d } from 'konva/types/types';


export interface ITimeline {
  tracks: ITrack[],
  currentPosition: number,
  targetPosition: number | null
}

interface ITimelineProps extends ITimeline, IBlockFunctions {};

const Timeline: React.FC<ITimelineProps> = (props) => {
  const tracks = props.tracks;
  return (
    <Stage width={1000} height={256}>
      <Layer>
        {tracks.map(track => <Track 
          {...track} 
          key={track.id} 
          moveBlock={props.moveBlock}
          trimBlock={props.trimBlock}
          /> 
        )}
      </Layer>
      <Layer>
        <Playhead type={PlayheadType.Current} position={props.currentPosition} height={64} />
      </Layer>
    </Stage>
  );
}

export default Timeline;
