import React, { Component } from 'react';
import { Tree as PTTree } from '@blueprintjs/core';
import './TaskTree.css';

export class Tree extends Component {
    render() {
        return <PTTree contents={this.props.taskTree} onNodeExpand={this.props.expandHandler} onNodeCollapse={this.props.expandHandler} />
    }
}