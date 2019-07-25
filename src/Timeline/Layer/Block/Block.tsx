import React from 'react';
import './Block.scss';

export interface IBlock {
  id: number,
  name: string,
  start: number,
  duration: number
}

export interface IBlockProps extends IBlock, IBlockFunctions {
  layerId: number,
}

export interface IBlockFunctions {
    moveBlock: (layerId: number, blockId: number, newStart: number) => void
}

const scale = 1;





class Block extends React.Component<IBlockProps> {

  state = {
    mouseRelativeLeft: this.props.start
  }

  handleDrag = (event: React.DragEvent<HTMLElement>) => {
    console.log(event);
    // console.log(event.clientX, event.screenX, event.pageX);
    const target = event.target as HTMLElement;
      if (target.parentElement !== null) {
        const mouseX = event.clientX;
        const layerLeft = target.parentElement.offsetLeft;
        const blockLeftAbsolute = target.offsetLeft + layerLeft;
        const blockShift = this.state.mouseRelativeLeft;
        const x = mouseX - layerLeft - blockShift;
        // console.log(mouseX, blockStart, blockShift);
        // console.log('from', this.state.blockLeft, 'relative:', blockShift);
        // console.log(pointerInBlock);
        this.props.moveBlock(this.props.layerId, this.props.id, x);
      }
  }

  handleDragStart = (event: React.DragEvent) => {
    const target = event.target as HTMLElement;
    if (target.parentElement) {
      const layerLeft = target.parentElement.offsetLeft;
      const blockLeftAbsolute = target.offsetLeft + layerLeft;
      const mouseX = event.clientX;
      const mouseRelativeLeft = mouseX - blockLeftAbsolute;
      // console.log('start at', blockLeftAbsolute, 'with mouse offset', mouseRelativeLeft);
      this.setState({ mouseRelativeLeft });
    }
  }

  render = () => {
    const style = {
      left: this.props.start * scale,
      width: this.props.duration * scale
    }
  
    return (
      <div 
        className="Block" 
        style={style} 
        onDragEnd={(e) => { this.handleDrag(e) }} 
        onDragStart={(e)=> { this.handleDragStart(e) }}
        draggable={true}
      >
          {this.props.name}
      </div>
    );
  }

  
}

export default Block;
