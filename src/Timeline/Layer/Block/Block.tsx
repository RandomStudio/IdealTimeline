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
const LAYER_LEFT = 128;

enum trimMode {
  left = 'left',
  right = 'right'
}


class Block extends React.Component<IBlockProps> {

  state = {
    trim: null,
    drag: {
      targetX: 0,
      mouseRelativeLeft: 0,
    }
  }

  handleDrag = (event: React.DragEvent) => {
    const target = event.target as HTMLElement;
    if (target.parentElement !== null) {

      if (this.state.drag) {
        const layerLeft = LAYER_LEFT;
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
    console.log(target.parentElement);
    if (target.parentElement) {
      const layerLeft = LAYER_LEFT;
      const blockLeftAbsolute = target.parentElement.offsetLeft + layerLeft;
      const mouseX = event.clientX;
      const mouseRelativeLeft = mouseX - blockLeftAbsolute;
      this.setState({ drag: { mouseRelativeLeft }});
    }
  }

  trimStart = () => {
    console.log('trim start!')
    this.setState({ trim: trimMode.left });
  }

  trimStop = () => {
    console.log('trim stop!');
    this.setState({ trim: null });
  }

  trimHandle = (event: any) => {
    if (this.state.trim) {
      console.log('trimming:', event);
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
        >
        <div className="middle"
          onDrag={(e) => { this.handleDrag(e) }}
          onDragEnd={(e) => { this.handleDragEnd(e) }} 
          onDragStart={(e)=> { this.handleDragStart(e) }}
          draggable={true}
        >
          <div className="label">
            {this.props.name}
          </div>
        </div>

        <div 
          className="edge left" 
          onMouseDown={() => this.trimStart()} 
          onMouseUp={() => this.trimStop()}
          onMouseMove={this.trimHandle}
        />
        <div className="edge right" />
      </div>
    );
  }

  
}

export default Block;
