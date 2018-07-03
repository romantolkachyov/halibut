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


const mapStateToProps = (state) => {
    return {
        taskTree: [buildTree(state, 'task_0')],
    }
};

const mapDispatchToProps = (dispatch) => ({
    expandHandler: (task) => {
        dispatch({ type: 'UPDATE_TASK', payload: { 
            ...task,
            taskId: task.id,
            isExpanded: !task.isExpanded,
         }})
    },
    collpseHandler: () => () => ({}),
})

export const TaskTree = connect(mapStateToProps, mapDispatchToProps)(Tree);
