import React from 'react';
import { Stage, Layer} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';
import { IBlockFunctions } from './Track/Block/Block';


export interface ITimeline {
  tracks: ITrack[],
  currentPosition: number,
  targetPosition: number | null
}

interface ITimelineProps extends ITimeline, IBlockFunctions {};

const Timeline: React.FC<ITimelineProps> = (props) => {
  const tracks = props.tracks;
  return (
    <div>
      <Stage width={1000} height={1000}>
        <Layer>
          {tracks.map(track => <Track 
            {...track} 
            key={track.id} 
            moveBlock={props.moveBlock}
            trimBlock={props.trimBlock}
            /> 
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default Timeline;
