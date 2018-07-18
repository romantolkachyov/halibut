import { Map, List } from 'immutable';
import { taskTreeReducer, findParentTaskId } from './taskTreeReducer';

const initialState = Map({
        nextTaskId: 5,
        byId: Map({
            task_0: Map({
                name: 'Root',
                subtasks: List(['task_1', 'task_2', 'task_3']),
                isExpanded: true,
                done: false,
            }),
            task_1: Map({
                name: 'Task 1',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            }),
            task_2: Map({
                name: 'Task 2',
                subtasks: List(['task_4', 'task_3']),
                isExpanded: true,
                done: false,
            }),
            task_3: Map({
                name: 'Task 3',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            }),
            task_4: Map({
                name: 'Task 4',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            }),
        }),
        allByIds: List(['task_0', 'task_1', 'task_2', 'task_3', 'task_4']),
    });


it('finds parent taskId', () => {
    expect(findParentTaskId(initialState, 'task_4')).toBe('task_2');
    expect(findParentTaskId(initialState, 'task_2')).toBe('task_0');
});


it('handels drag task on target task', () => {
    expect(
        taskTreeReducer(
            initialState.set('dragTaskId', 'task_4'),
            { 
                type: 'DRAG_TASK_ON_TARGET', 
                payload: {
                    targetTaskId: 'task_0',
                },
            }
        )
    ).toEqual(
        initialState
            .set('dragTaskId', 'task_4')
            .set('dragTargetTaskId', 'task_0')
    )
});

it('ends drag task', () => {
    // move subtask
    const initialTestState = initialState
        .set('dragTaskId', 'task_4')
        .set('dragTargetTaskId', 'task_0');

    const expectedState = initialTestState
        .updateIn(
            ['byId', 'task_0', 'subtasks'],
            (subtasks) => subtasks.push('task_4')
        )
        .setIn(['byId', 'task_2', 'subtasks'], List(['task_3']))
        .set('dragTaskId', undefined)
        .set('dragTargetTaskId', undefined);

    expect(
        taskTreeReducer(
            initialTestState,
            { 
                type: 'END_DRAG', 
                payload: {},
            }
        )
    ).toEqual(expectedState);

    // move last subtask
});

it('starts drag task', () => {
    expect(
        taskTreeReducer(
            initialState,
            { 
                type: 'START_DRAG', 
                payload: {
                    taskId: 'task_4',
                },
            }
        )
    ).toEqual(
        initialState.set('dragTaskId', 'task_4')
    )
});

it('returns default state of task tree', () => {
    expect(taskTreeReducer(
        undefined, 
        { type: 'TEST_ACTION' }
    )).toEqual(
        Map({ 
            nextTaskId: 1,
            byId: Map({
                task_0: Map({
                    name: 'Root',
                    subtasks: undefined,
                    isExpanded: false,
                    done: false,
                })
            }),
            allByIds: List(['task_0']),
        })
    );
});


it('adds new task to task tree', () => {
    const nextTaskId = initialState.get('nextTaskId');
    const newTaskId = `task_${nextTaskId}`;
    expect(
        taskTreeReducer(
            initialState,
            { 
                type: 'ADD_TASK',
                payload: {
                    name: 'This is totaly new task!',
                    parentId: 'task_0',
                } 
            }
        )
    ).toEqual(
        initialState
            .set('nextTaskId', nextTaskId + 1)
            .setIn(
                ['byId', newTaskId],
                Map({
                    name: 'This is totaly new task!',
                    isExpanded: false,
                    isEditing: true,
                    done: false,
                    subtasks: undefined,
                })
            )
            .updateIn(['byId', 'task_0', 'subtasks'], (s) => s.push(newTaskId))
            .update('allByIds', (x) => x.push(newTaskId))
        );
})

it('remove task', () => {
    expect(taskTreeReducer({
        nextTaskId: 6,
        byId: {
            task_0: {
                name: 'Root task',
                subtasks: ['task_1'],
            },
            task_1: {
                name: 'Task 1',
                subtasks: ['task_2', 'task_3', 'task_4'],
            },
            task_2: {
                name: 'Task 2',
                subtasks: undefined,
            },
            task_3: {
                name: 'Task 3',
                subtasks: ['task_5'],
            },
            task_4: {
                name: 'Task 4',
                subtasks: [],
            },
            task_5: {
                name: 'Task 5',
                subtasks: [],
            },
        },
        allByIds: ['task_0', 'task_1','task_2', 'task_3', 'task_4', 'task_5' ],
    },
    {
        type: 'REMOVE_TASK',
        payload: {
            taskId: 'task_3',
        }
    }
    )).toEqual({
            nextTaskId: 6,
            byId: {
                task_0: {
                    name: 'Root task',
                    subtasks: ['task_1'],
                },
                task_1: {
                    name: 'Task 1',
                    subtasks: ['task_2', 'task_4'],
                },
                task_2: {
                    name: 'Task 2',
                    subtasks: undefined,
                },
                task_4: {
                    name: 'Task 4',
                    subtasks: [],
                },
            },
            allByIds: ['task_0', 'task_1','task_2', 'task_4' ],
            }
        )
    });



it('remove root task', () => {
    expect(taskTreeReducer({
        nextTaskId: 6,
        byId: {
            task_0: {
                name: 'Root task',
                subtasks: ['task_1'],
            },
            task_1: {
                name: 'Task 1',
                subtasks: [],
            },
        },
        allByIds: ['task_0', 'task_1'],
    },
    {
        type: 'REMOVE_TASK',
        payload: {
            taksId: 'task_0',
        }
    }
    )).toEqual({
            nextTaskId: 6,
            byId: {
                task_0: {
                    name: 'Root task',
                    subtasks: ['task_1'],
                },
                task_1: {
                    name: 'Task 1',
                    subtasks: [],
                },
            },
            allByIds: ['task_0', 'task_1'],
        })
    });


it('update task', () => {
    expect(taskTreeReducer({
        nextTaskId: 6,
        byId: {
            task_0: {
                name: 'Root task',
                subtasks: ['task_1'],
                isExpanded: false,
            },
            task_1: {
                name: 'Task 1',
                subtasks: [],
                isExpanded: false,
            },
        },
        allByIds: ['task_0', 'task_1'],
    },
    {
        type: 'UPDATE_TASK',
        payload: {
            taskId: 'task_1',
            name: 'task 42',
            isExpanded: true,
        }
    }
    )).toEqual({
            nextTaskId: 6,
            byId: {
                task_0: {
                    name: 'Root task',
                    subtasks: ['task_1'],
                    isExpanded: false,
                },
                task_1: {
                    name: 'task 42',
                    subtasks: [],
                    isExpanded: true,
                },
            },
            allByIds: ['task_0', 'task_1'],
        }
        )
    });