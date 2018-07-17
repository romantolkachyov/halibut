import { taskTreeReducer, findParentTaskId } from './taskTreeReducer';

const initialState = {
        nextTaskId: 5,
        byId: {
            task_0: {
                name: 'Root',
                subtasks: ['task_1', 'task_2', 'task_3'],
                isExpanded: true,
                done: false,
            },
            task_1: {
                name: 'Task 1',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            },
            task_2: {
                name: 'Task 2',
                subtasks: ['task_4', 'task_3'],
                isExpanded: true,
                done: false,
            },
            task_3: {
                name: 'Task 3',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            },
            task_4: {
                name: 'Task 4',
                subtasks: undefined,
                isExpanded: false,
                done: false,
            },
        },
        allByIds: ['task_0', 'task_1', 'task_2', 'task_3', 'task_4'],
    };


it('finds parent taskId', () => {
    expect(findParentTaskId(initialState, 'task_4')).toBe('task_2');
    expect(findParentTaskId(initialState, 'task_2')).toBe('task_0');
});


it('handels drag task on target task', () => {
    expect(
        taskTreeReducer(
            {
                ...initialState,
                dragTaskId: 'task_4',
            },
            { 
                type: 'DRAG_TASK_ON_TARGET', 
                payload: {
                    targetTaskId: 'task_0',
                },
            }
        )
    ).toEqual(
        {
            ...initialState,
            dragTaskId: 'task_4',
            dragTargetTaskId: 'task_0',
        }
    )
});

it('ends drag task', () => {
    // move subtask
    expect(
        taskTreeReducer(
            {
                ...initialState,
                dragTaskId: 'task_4',
                dragTargetTaskId: 'task_0'
            },
            { 
                type: 'END_DRAG', 
                payload: {},
            }
        )
    ).toEqual(
        {
            ...initialState,
            byId: {
                ...initialState.byId,
                task_0: {
                    ...initialState.byId.task_0,
                    subtasks: [...initialState.byId.task_0.subtasks, 'task_4'],
                },
                task_2: {
                    ...initialState.byId.task_2,
                    subtasks: ['task_3'],
                },
            },
            dragTaskId: undefined,
            dragTargetTaskId: undefined,
        }
    )

    // move last subtask
    // expect(
    //     taskTreeReducer(
    //         {
    //             ...initialState,
    //             dragTaskId: 'task_4',
    //             dragTargetTaskId: 'task_0'
    //         },
    //         { 
    //             type: 'END_DRAG', 
    //             payload: {},
    //         }
    //     )
    // ).toEqual(
    //     {
    //         ...initialState,
    //         byId: {
    //             ...initialState.byId,
    //             task_0: {
    //                 ...initialState.byId.task_0,
    //                 subtasks: [...initialState.byId.task_0.subtasks, 'task_4'],
    //             },
    //             task_2: {
    //                 ...initialState.byId.task_2,
    //                 subtasks: undefined,
    //                 isExpanded: false,
    //             },
    //         },
    //         dragTaskId: undefined,
    //         dragTargetTaskId: undefined,
    //     }
    // )
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
        {
            ...initialState,
            dragTaskId: 'task_4',
        }
    )
});

it('returns default state of task tree', () => {
    expect(taskTreeReducer(
        undefined, 
        { type: 'TEST_ACTION' }
    )).toEqual({ 
        nextTaskId: 1,
        byId: {
            task_0: {
                name: 'Root',
                subtasks: [],
                isExpanded: false,
                done: false,
            }
        },
        allByIds: ['task_0'],
    });
});


it('adds new task to task tree', () => {
    expect(
        taskTreeReducer(
            { 
                nextTaskId: 1,
                byId: {
                    task_0: {
                        name: 'Root task',
                        subtasks: []
                    }
                },
                allByIds: ['task_0'],
            }, 
            { 
                type: 'ADD_TASK',
                payload: {
                    name: 'This is totaly new task!',
                    parentId: 'task_0',
                } 
            }
        )
    ).toEqual({ 
        nextTaskId: 2,
        byId: { 
            task_0: { 
                name: 'Root task',
                isExpanded: true,
                subtasks: ['task_1'],
            },
            task_1: { 
                name: 'This is totaly new task!',
                isExpanded: false,
                isEditing: true,
                done: false,
                subtasks: undefined,
            },
        }, 
        allByIds: ['task_0', 'task_1'],
    });
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