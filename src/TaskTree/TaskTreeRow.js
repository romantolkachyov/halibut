import React from 'react';
import { connect } from 'react-redux';
import { Row } from './Row';

export function taskTreeRow(taskId) {
    const mapStateToProps = (state) => {
        const task = state.getIn(['byId', taskId]);
        return {
            taskId,
            defaultValue: task.get('name'),
            done: task.get('done'),
            isEditing: task.get('isEditing'),
        };
    }

    const mapDispatchToProps = (dispatch) => ({
        doneHandler: (taskId, done) => {
            dispatch(
                {
                    type: 'UPDATE_TASK',
                    payload: {
                        taskId,
                        done,
                    },
                },
            )
        },
        removeHandler: (taskId) => {
            dispatch(
                {
                    type: 'REMOVE_TASK',
                    payload: {
                        taskId,
                    }
                }
            )
        },
        addTaskHandler: (taskId) => {
            dispatch({ 
                type: 'ADD_TASK',
                payload: {
                    parentId: taskId,
                    name: '',
                },
            })
        },
        editConfirmHandler: (name) => {
            dispatch({
                type: 'UPDATE_TASK',
                payload: {
                    taskId,
                    name,
                    isEditing: false,
                }
            })
        }
    });
    return connect(mapStateToProps, mapDispatchToProps)(Row);
}
