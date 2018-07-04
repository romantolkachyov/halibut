import React from 'react';
import { connect } from 'react-redux';
import { Row } from './Row';

export function taskTreeRow(taskId) {
    const mapStateToProps = (state) => {
        const task = state.byId[taskId];

        return {
            taskId,
            defaultValue: task.name,
            done: task.done,
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
        }
    });

    return connect(mapStateToProps, mapDispatchToProps)(Row);
}