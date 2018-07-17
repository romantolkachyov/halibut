import React from 'react';
import { connect } from 'react-redux';
import { Tree } from './Tree';
import { taskTreeRow } from './TaskTreeRow';

function buildTree(state, taskId) {
    const task = state.byId[taskId];
    const TaskTreeRow = taskTreeRow(taskId);
    return {
        label: <TaskTreeRow />,
        id: taskId,
        isExpanded: task.isExpanded,
        childNodes: task.subtasks && task.subtasks.map((subtaskId) => buildTree(state, subtaskId)),
    };
}

let lastTaskTreeState;
let lastTree;
const mapStateToProps = (state) => {
    const tasksById = state.byId;
    if (lastTaskTreeState === tasksById) {
        lastTaskTreeState = tasksById;
        return {
            taskTree: lastTree,
        }
    }

    lastTaskTreeState = tasksById;
    lastTree = [buildTree(state, 'task_0')];
    return {
        taskTree: lastTree,
    }
};

const mapDispatchToProps = (dispatch) => ({
    mouseUpHandler: () => {
        dispatch({
            type: 'END_DRAG',
            payload: {},
        })
    },
    expandHandler: (taskNode) => {
        dispatch({ type: 'UPDATE_TASK', payload: { 
            ...taskNode,
            taskId: taskNode.id,
            isExpanded: !taskNode.isExpanded,
         }})
    },
});

export const TaskTree = connect(mapStateToProps, mapDispatchToProps)(Tree);
