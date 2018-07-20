import { Map, List } from 'immutable';

const initialState = Map({ 
    nextTaskId: 1,
    byId: Map({
        task_0: Map({
            name: 'Root',
            subtasks: undefined,
            isExpanded: false,
            done: false,
        }),
    }), 
    allByIds: List(['task_0']),
});

export function findParentTaskId(tasksState, taskId) {
    for (const currentTaskId of tasksState.get('allByIds')) {
        if (
            tasksState.getIn(['byId', currentTaskId, 'subtasks']) 
         && tasksState.getIn(['byId', currentTaskId, 'subtasks']).includes(taskId)
        ) {
            return currentTaskId;
        }
    }
}

export function taskTreeReducer(state = initialState, action) {
    switch (action.type) {
        case 'DRAG_TASK_ON_TARGET': {
            const { targetTaskId } = action.payload;
            return state.set('dragTargetTaskId', targetTaskId);
        }
        case 'END_DRAG': {
            const dragTaskId = state.get('dragTaskId')
            if ( dragTaskId === undefined) return state;
            const parentTaskId = findParentTaskId(state, dragTaskId);
            // const parentSubtasks = state.getIn(['byId', parentTaskId, 'subtasks']) ? state.getIn(['byId', parentTaskId, 'subtasks']).filter((it) => it !== dragTaskId) : List();
            
            const dragTargetTaskId = state.get('dragTargetTaskId');

            return state
                .set('dragTargetTaskId', undefined)
                .set('dragTaskId', undefined)
                .updateIn(['byId', dragTargetTaskId, 'subtasks'], (subtasks) => {
                    if (subtasks === undefined) return List([dragTaskId]);
                    return subtasks.push(dragTaskId)
                })
                .updateIn(['byId', parentTaskId, 'subtasks'], (subtasks) => {
                    const filtredSubtasks = subtasks.filter((subtask) => subtask !== dragTaskId);
                    if (filtredSubtasks.isEmpty()) return undefined;
                    return filtredSubtasks;
                })
        }
        case 'START_DRAG': {
            const { taskId } = action.payload;
            if (taskId === 'task_0') return state;

            return state.set('dragTaskId', taskId);
        }
        case 'ADD_TASK': {
            const { name, parentId } = action.payload;
            const nextTaskId = state.get('nextTaskId');
            const newTaskId = 'task_' + nextTaskId;

            return state
                .set('nextTaskId', nextTaskId + 1)
                .setIn(
                    ['byId', newTaskId], 
                    Map({
                        name,
                        isExpanded: false,
                        isEditing: true,
                        done: false,
                        subtasks: undefined,
                   })
                )
                .updateIn(
                    ['byId', parentId],
                    (p) => p
                        .set('isExpanded', true)
                        .update('subtasks', (s) => {
                            if (s === undefined) return List([newTaskId]);
                            return s.push(newTaskId);
                        })
                )
                .update('allByIds', a => a.push(newTaskId))
            ;
        }
        case 'REMOVE_TASK': {
            const { taskId } = action.payload;

            // The root task can't be deleted.
            if (taskId === 'task_0') return state;

            const tasksToRemove = [];
            const findTasksToRemove = (currentTaskId, removeSubtree = false) => {
                const removeState = removeSubtree || currentTaskId === taskId;
                if (removeState) {
                    tasksToRemove.push(currentTaskId);
                }
                const currentTaskSubtasks = state.getIn(['byId', currentTaskId, 'subtasks']);
                if (currentTaskSubtasks === undefined) return;
                currentTaskSubtasks.forEach( t => findTasksToRemove(t, removeState));
            }
            findTasksToRemove('task_0');
            // retrive parent task id on ^^^ step?
            const parentTaskId = findParentTaskId(state, taskId);
        
            return state
                .updateIn(
                    ['byId', parentTaskId, 'subtasks'], 
                    s => 
                        s.filter(i => i !== taskId)
                )
                .update(
                    'byId',
                    (t) => 
                        t.filter(
                            (v, k) => !tasksToRemove.includes(k)
                        )
                )
                .update('allByIds', a => a.filter( i => !tasksToRemove.includes(i)));
        }
        case 'UPDATE_TASK': {
            // Needs Refactoring.
            const { taskId, name, isExpanded, done, isEditing } = action.payload;

            return state
                .updateIn(
                    ['byId', taskId],
                    t => t
                        .update('name', x => name === undefined ? x : name)
                        .update('isExpanded', x => isExpanded === undefined ? x : isExpanded)
                        .update('isEditing', x => isEditing === undefined ? x : isEditing)
                        .update('done', x => done === undefined ? x : done)
                )
        }
        default:
            return state;
    }
}