import React from 'react';
import './Block.scss';

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
  scale: { x: number, y: number },
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
      left: -HANDLE_WIDTH
    }

    const trimStyleRight = {
      ...trimStyle,
      left: width
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
            const deltaX = absoluteToTimelinePosition(offsetX, this.props.offset.x, 0, this.props.scale.x);
            this.props.trimBlock(this.props.trackId, this.props.id, 0, deltaX)
          }}
        />
      </div>
    )
  }
  
}

export default Block;