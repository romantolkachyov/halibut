import React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Tree } from './Tree';
import { taskTreeRow } from './TaskTreeRow';

function buildTree(state, taskId) {

    const task = state.getIn(['byId', taskId]);
    const TaskTreeRow = taskTreeRow(taskId);

    return Map({
        label: <TaskTreeRow />,
        id: taskId,
        isExpanded: task.get('isExpanded'),
        childNodes: task.get('subtasks') && task.get('subtasks').map((subtaskId) => buildTree(state, subtaskId)),
    });
}

let lastTaskTreeState;
let lastTree;
const mapStateToProps = (state) => {
    const tasksById = state.get('byId');
    if (lastTaskTreeState && lastTaskTreeState.equals(tasksById)) {
        lastTaskTreeState = tasksById;
        return {
            taskTree: lastTree,
        }
    }

    lastTaskTreeState = tasksById;
    lastTree = List([buildTree(state, 'task_0')]);
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
        console.log('tasknode', taskNode);
        dispatch({ type: 'UPDATE_TASK', payload: { 
            ...taskNode,
            taskId: taskNode.id,
            isExpanded: !taskNode.isExpanded,
         }})
    },
    dragAndDropHandler: (dragTaskId, dragTargetTaskId, dragAndDropType) => {
        console.log('drag and drop!');
        dispatch(
            {
                type: 'DRAG_TASK',
                payload: {
                    dragTargetTaskId,
                    dragTaskId,
                    dragAndDropType,
                },
            }
        )
    },
});

export const TaskTree = connect(mapStateToProps, mapDispatchToProps)(Tree);
