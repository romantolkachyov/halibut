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
            const checkTasksToRemove = (removeTaskId, removeSubtree = false) => {
                const removeState = removeSubtree || removeTaskId === taskId;
                if (removeState) {
                    tasksToRemove.push(removeTaskId);
                }
                const currentTask = state.byId[removeTaskId];
                if (!currentTask.subtasks) return;
                currentTask.subtasks.forEach((task) => checkTasksToRemove(task, removeState));
                if (currentTask.subtasks.includes(taskId)) {
                    currentTask.subtasks = currentTask.subtasks.filter((id) => id !== taskId);
                }
            }
            checkTasksToRemove('task_0');

            const tasksById = {};
            Object.keys(state.byId).forEach((id) => {
                if (tasksToRemove.includes(id)) return;
                tasksById[id] = state.byId[id];
            });

            return {
                ...state,
                byId: tasksById,
                allByIds: state.allByIds.filter((id) => !tasksToRemove.includes(id)),
            }
        }
        case 'UPDATE_TASK': {
            // Kind of object.assing? Needs Refactoring.
            const { taskId, name, isExpanded, done, isEditing } = action.payload;
            const task =  state.byId[taskId];

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [taskId]: {
                        ...task,
                        name: name || task.name,
                        isExpanded: (isExpanded !== undefined) ? isExpanded : task.isExpanded,
                        isEditing: (isEditing !== undefined) ? isEditing : task.isEditing,
                        done: (done !== undefined) ? done : task.done,
                    }
                }
            }
        }
        default:
            return state;
    }
}