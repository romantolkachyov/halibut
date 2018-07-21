import { Map, List } from 'immutable';
import { taskTreeReducer, findParentTaskId } from './taskTreeReducer';

const initialState = Map({
    nextTaskId: 5,
    dragTargetTaskId: undefined,
    dragTaskId: undefined,
    byId: Map({
        task_0: Map({
            name: 'Root',
            subtasks: List(['task_1', 'task_2']),
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

    // move task on it self
    const moveTaskOnSelfInitialState = initialState
        .set('dragTargetTaskId', 'task_4')
        .set('dragTaskId', 'task_4');

    expect(
        taskTreeReducer(
            moveTaskOnSelfInitialState,
            {
                type: 'END_DRAG',
                payload: {},
            }
        )
    ).toEqual(initialState);
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
    const removeTaskId = 'task_3'
    expect(
        taskTreeReducer(
            initialState,
            {
                type: 'REMOVE_TASK',
                payload: {
                    taskId: removeTaskId,
                }
            }
        )
    ).toEqual(
        initialState
            .removeIn(['byId', removeTaskId])
            .updateIn(['byId', 'task_2', 'subtasks'], s => s.filter(i => i !== removeTaskId))
            .update('allByIds', a => a.filter(i => i !== removeTaskId))
    );
});
    

it('remove root task', () => {
    expect(
        taskTreeReducer(
            initialState,
            {
                type: 'REMOVE_TASK',
                payload: {
                    taskId: 'task_0',
                }
            }
        )
    ).toEqual(
        initialState
    )
});


it('update task', () => {
    const updateTaskId = 'task_1';
    expect(
        taskTreeReducer(
            initialState,
            {
                type: 'UPDATE_TASK',
                payload: {
                    taskId: updateTaskId,
                    name: 'task 42',
                    isExpanded: true,
                }
            }
    )).toEqual(
        initialState.updateIn(
            ['byId', updateTaskId],
            t => t
                .set('name', 'task 42')
                .set('isExpanded', true)
        )
    )
});