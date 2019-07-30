import React from 'react';
import { Stage, Layer} from 'react-konva';

import './Timeline.scss';
import Track, { ITrack } from './Track/Track';
import Playhead, { PlayheadType } from './Playhead/Playhead';


export interface ITimeline {
  tracks: ITrack[],
  currentPosition: number,
  targetPosition: number | null
}

interface ITimelineProps extends ITimeline {}

const Timeline: React.FC<ITimelineProps> = (props) => {
  const tracks = props.tracks;
  return (
    <div>
      <Stage width={1000} height={1000}>
        <Layer>
          {tracks.map(track => <Track 
            {...track} 
            key={track.id} 
            /> 
          )}
        </Layer>
      </Stage>
    </div>
  );
}


{/* <div className="debug">
<code>
    {JSON.stringify(props)}
</code>
</div>

<Playhead position={props.currentPosition} type={PlayheadType.Current} />

{typeof props.targetPosition === 'number' &&
<Playhead position={props.targetPosition} type={PlayheadType.Target} />
}
 */}


export default Timeline;
