import React from 'react';
import { EditableText, Icon } from '@blueprintjs/core';
import './TaskTreeRow.css';

export class Row extends React.PureComponent {
    render() {
        return (
        <div className={ 'task-tree__row' }>
            <Icon icon='tick' onClick={() => this.props.doneHandler(this.props.taskId, !this.props.done)} />
            <EditableText
                defaultValue={this.props.defaultValue}
                onConfirm={this.props.editConfirmHandler}
                placeholder='empty'
                className={ `task-tree--label ${this.props.done ? 'task-tree--task-done' : ''}` }
                isEditing={this.props.isEditing}
            />
            <Icon icon='plus' onClick={() => this.props.addTaskHandler(this.props.taskId)} />
            { this.props.taskId !== 'task_0' ? <Icon icon='cross' onClick={() => this.props.removeHandler(this.props.taskId)} /> : <div /> }
        </div>
        )
    }
}
