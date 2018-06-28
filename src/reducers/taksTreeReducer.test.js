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
});