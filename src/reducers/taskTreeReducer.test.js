import { taskTreeReducer } from './taskTreeReducer';

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
                isExpanded: true,
                isEditing: true,
                done: false,
                subtasks: [],
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