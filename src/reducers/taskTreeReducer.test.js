import { taskTreeReducer } from './taskTreeReducer';

it('returns default state of task tree', () => {
    expect(taskTreeReducer(undefined, { type: 'TEST_ACTION' })).toEqual({ byId: {}, allByIds: [] });
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
                subtasks: ['task_1'],
            },
            task_1: { 
                name: 'This is totaly new task!',
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
                subtasks: [],
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
                    subtasks: [],
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
        }
        )
    });