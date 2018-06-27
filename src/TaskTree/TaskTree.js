import React, { Component } from 'react';
import { Tree, EditableText, Icon } from '@blueprintjs/core';
import { loadTaskTree, saveTaskTree } from '../storage/TaskTreeStorage';
import './TaskTree.css';

export class TaskTree extends Component {
    saveTimeout = null;

    constructor(props) {
        super(props);
        this.state = loadTaskTree();
    }

    getNextTaskId() {
        const nextTaskId = this.state.nextTaskId;
        this.setState({ 
            nextTaskId: nextTaskId + 1,
        });
        this.setupSaveTimeout();
        return nextTaskId;
    }

    applyToTree(tree, fn) {
        if (!tree) return;

        tree.forEach( node => {
            fn(node);
            if (node.childNodes) {
                this.applyToTree(node.childNodes, fn);    
            }
        });
    }

    setupSaveTimeout() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(() => {
            saveTaskTree(this.state);
        }, 1 * 1000);
    }
    
    removeTask(tasks, taskToRemove) {
        if (!tasks) return;
        return tasks
            .filter(task => task.id !== taskToRemove.id)
            .map(task => {
                return { 
                    ...task, 
                    childNodes: (task.childNodes && this.removeTask(task.childNodes, taskToRemove)) || null,
                }
            });
    }

    deleteHandler(task) {
        const tasks = this.removeTask(this.state.tasks, task);
        this.setState({ tasks });
        this.setupSaveTimeout();
    }

    taskDoneHandler(task) {
        this.applyToTree(this.state.tasks, (node) => {
            if (node.id === task.id) {
                node.done = !node.done;
            }
        });
        this.setState(this.state);
        this.setupSaveTimeout();
    }

    handleTaskLabelChangeConfirm(task, newValue) {
        task.isEditing = false;
        task.label = newValue;
        this.forceUpdate();
        this.setupSaveTimeout();
    }

    handleExpand = (task) => {
        this.applyToTree(this.state.tasks, (node) => {
            if (task.id === node.id) {
                node.isExpanded = true;
            }
        });
        this.setState(this.state);
        this.setupSaveTimeout();
    }

    handleCollapse = (task) => {
        this.applyToTree(this.state.tasks, (node) => {
            if (task.id === node.id) {
                node.isExpanded = false;
            }
        });
        this.setState(this.state);
        this.setupSaveTimeout();
    }

    handeleCreateNewTask(parentTaskNode) {
        parentTaskNode.childNodes = parentTaskNode.childNodes || [];
        parentTaskNode.isExpanded = true;
        parentTaskNode.childNodes.unshift(
            { 
                id: this.getNextTaskId(), 
                label: '', 
                done: false,
                isEditing: true,
            }
        );
        this.forceUpdate();
        this.setupSaveTimeout();
    }

    replaceLabelsWithEditableText(tasks) {
        return tasks.map(task => {
            return {
                ...task,
                label: (
                    <div className='task-tree--row'>
                        <Icon icon='tick' onClick={(e) => this.taskDoneHandler(task)} />
                        <EditableText 
                            defaultValue={task.label} 
                            onConfirm={(newValue) => this.handleTaskLabelChangeConfirm(task, newValue)} 
                            placeholder='empty' 
                            className={ `task-tree--label ${task.done ? 'task-tree--task-done' : ''}` }
                            isEditing={task.isEditing} 
                        />
                        <Icon icon='plus' onClick={(e) => this.handeleCreateNewTask(task)} />
                        { task.id > 0 ? <Icon icon='cross' onClick={(e) => this.deleteHandler(task)} /> : '' }
                    </div>
                ),
                childNodes: task.childNodes && this.replaceLabelsWithEditableText(task.childNodes),
            }
        });
    }


    render() {
        return (
        <div className='task-tree'>
            <Tree contents={this.replaceLabelsWithEditableText(this.state.tasks)} onNodeExpand={this.handleExpand} onNodeCollapse={this.handleCollapse} />
        </div>
        )
    }
}