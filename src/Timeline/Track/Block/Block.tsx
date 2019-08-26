import React from 'react';
import './Block.scss';
import { IScale } from '../../Timeline';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number,
}

export enum CursorType {
  default = 'default',
  move = 'grab',
  moving = 'grabbing',
  resize = 'ew-resize'
}

export interface IBlockFunctions {
  moveBlock: (trackId: number, blockId: number, newStart: number) => void,
  moveTargetPosition: (newPosition: number | null) => void,
  trimBlock: (trackId: number, blockId: number, startDelta: number, durationDelta: number) => void,
  changeCursor: (style: CursorType) => void,
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  trackId: number,
  height: number,
  scale: IScale,
  offset: { x: number, y: number }
}

const HANDLE_WIDTH = 10;


export const absoluteToTimelinePosition = (mouseX: number, timelineOffset: number, dragOffset: number, scaleX: number): number => 
  (mouseX - timelineOffset - dragOffset) / scaleX;

export const timelineToAbsolute = (x: number, scaleX: number): number =>
  x * scaleX;

class Block extends React.Component<IBlockProps> {

  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  state = {
    dragging: false,
    dragStartOffset: 0
  }
  

  constrainDrag = (pos: { x: number, y: number }) => {
    return ({
      x: pos.x >= 0 ? pos.x : 0,
      y: this.props.height * this.props.trackId
    });
  }



  offsetInBlock = (mouseX: number): number => {
    if (this.ref && this.ref.current) {
      const blockX = this.ref.current.getBoundingClientRect().left;
      return mouseX - blockX;
    } else {
      return 0;
    }
  }

  render = () => {
    const x = this.props.start * this.props.scale.x;
    const width = this.props.duration * this.props.scale.x;
    const height = this.props.height;

    const style = {
      width,
      height,
    }
    
    const containerStyle = {
      ...style,
      left: x
    };

    const trimStyle = {
      width: HANDLE_WIDTH,
      height
    }

    const trimStyleLeft = {
      ...trimStyle,
      left: 0
    }

    const trimStyleRight = {
      ...trimStyle,
      left: width - HANDLE_WIDTH
    }

    return (
      <div
        ref={this.ref}
        className="Block"
        style={containerStyle}
        
      >
        <div className="movable"
          style={style}
          draggable={true}
          onDragStart={(e: React.DragEvent) => {
            this.setState({ dragStartOffset: this.offsetInBlock(e.clientX) });
          }}
          onDrag={(e: React.DragEvent) => {
            this.props.changeCursor(CursorType.moving);
            const x = e.clientX;
            this.props.moveTargetPosition(absoluteToTimelinePosition(x, this.props.offset.x, this.state.dragStartOffset, this.props.scale.x));
          }}
          onDragEnd={(e: React.DragEvent) => {
            const x = absoluteToTimelinePosition(e.clientX, this.props.offset.x, this.state.dragStartOffset, this.props.scale.x)
            this.props.moveBlock(this.props.trackId, this.props.id, x);
            this.props.changeCursor(CursorType.move);
          }}
          onMouseEnter={() => this.props.changeCursor(CursorType.move)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
        />

        <div className="name">
          {this.props.name}
        </div>
        <div
          draggable={true}
          className="trim left"
          style={trimStyleLeft}
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
          onDrag={(e: React.DragEvent) => {
            const mouseX = e.clientX;
            const offsetX = mouseX - x - this.props.offset.x;
            const deltaX = offsetX;
            const timelineDeltaX = absoluteToTimelinePosition(deltaX, 0, 0, this.props.scale.x);
            if (mouseX > 0) { // ignore spurious positions (on drag stop)
              this.props.trimBlock(this.props.trackId, this.props.id, timelineDeltaX, -timelineDeltaX)
            }
          }}
        />
        <div
          draggable={true}
          style={trimStyleRight}
          className="trim right"
          onMouseEnter={() => this.props.changeCursor(CursorType.resize)}
          onMouseLeave={() => this.props.changeCursor(CursorType.default)}
          onDrag={(e: React.DragEvent) => {
            const mouseX = e.clientX;
            const offsetX = this.offsetInBlock(mouseX);
            const deltaX = offsetX - width;
            const timelineDeltaX = absoluteToTimelinePosition(deltaX, 0, 0, this.props.scale.x);
            if (mouseX > 0) { // ignore spurious positions (on drag stop)
              this.props.trimBlock(this.props.trackId, this.props.id, 0, timelineDeltaX)
            }
          }}
        />
      </div>
    )
  }
  
}

export default Block;