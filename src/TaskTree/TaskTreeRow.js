import React from 'react';
import { connect } from 'react-redux';
import { Row } from './Row';

export function taskTreeRow(taskId) {
    const mapStateToProps = (state) => {
        const task = state.byId[taskId];

        return {
            defaultValue: task.name,
            done: task.done,
        };
    }

    const mapDispatchToProps = (dispatch) => ({
        expandHandler: () => () => ({}),
        collpseHandler: () => () => ({}),
    })

    return connect(mapStateToProps, mapDispatchToProps)(Row);
}