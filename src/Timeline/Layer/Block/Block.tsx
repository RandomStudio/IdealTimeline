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
    moveBlock: (layerId: number, blockId: number, newStart: number) => void,
    moveTargetPosition: (newPosition: number | null) => void
}

const scale = 1;





class Block extends React.Component<IBlockProps> {

  state = {
    layerLeft: null,
    drag: {
      targetX: 0,
      mouseRelativeLeft: 0,
    }
  }

  handleDrag = (event: React.DragEvent) => {
    const target = event.target as HTMLElement;
    if (target.parentElement !== null) {

      if (this.state.drag) {
        const layerLeft = this.state.layerLeft || target.parentElement.offsetLeft ;
        const mouseX = event.clientX;
        const blockShift = this.state.drag.mouseRelativeLeft;
        if (blockShift && mouseX > 0) {
          const targetX = mouseX - layerLeft - blockShift;
          this.setState({ drag: { ...this.state.drag, targetX }});
          this.props.moveTargetPosition(targetX + layerLeft);
        }
      }


    }
  }

  handleDragEnd = (event: React.DragEvent) => {
    const target = event.target as HTMLElement;
      if (target.parentElement !== null && this.state.drag) {
        this.props.moveBlock(this.props.layerId, this.props.id, this.state.drag.targetX);
        setTimeout(() => { 
          this.props.moveTargetPosition(null);
        }, 1000);
      }
  }

  handleDragStart = (event: React.DragEvent) => {
    const target = event.target as HTMLElement;
    if (target.parentElement) {
      const layerLeft = target.parentElement.offsetLeft;
      if (this.state.layerLeft === null) {
        this.setState({ layerLeft });
      }
      const blockLeftAbsolute = target.offsetLeft + layerLeft;
      const mouseX = event.clientX;
      const mouseRelativeLeft = mouseX - blockLeftAbsolute;
      this.setState({ drag: { mouseRelativeLeft }});
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
        onDrag={(e) => { this.handleDrag(e) }}
        onDragEnd={(e) => { this.handleDragEnd(e) }} 
        onDragStart={(e)=> { this.handleDragStart(e) }}
        draggable={true}
      >
        <div className="label">
          {this.props.name}
        </div>
        <div className="edge start" />
        <div className="edge end" />
      </div>
    );
  }

  
}

export default Block;
