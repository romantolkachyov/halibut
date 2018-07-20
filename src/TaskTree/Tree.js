import React, { PureComponent } from 'react';
import { Tree as PTTree } from '@blueprintjs/core';
import './TaskTree.css';

export class Tree extends PureComponent {
    render() {
        console.log('tree render!', this.props.taskTree.toJS());
        return (
            <div onMouseUp={ () => this.props.mouseUpHandler() } 
                className='task-tree'>
                <PTTree 
                    contents={this.props.taskTree.toJS()} 
                    onNodeExpand={this.props.expandHandler} 
                    onNodeCollapse={this.props.expandHandler} />
            </div>
        );
    }
}