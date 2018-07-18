import { Map, List } from 'immutable';

const initialState = { 
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
};

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
            return {
                ...state,
                dragTargetTaskId: targetTaskId,
            }
        }
        case 'END_DRAG': {
            const dragTaskId = state.get('dragTaskId')
            if ( dragTaskId === undefined) return state;
            const parentTaskId = findParentTaskId(state, dragTaskId);
            const parentSubtasks = state.getIn(['byId', parentTaskId, 'subtasks']) ? state.getIn(['byId', parentTaskId, 'subtasks']).filter((it) => it !== dragTaskId) : List();
            
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

            return {
                ...state,
                dragTaskId: taskId,
            }
        }
        case 'ADD_TASK': {
            const { name, parentId, isExpanded, isEditing, done } = action.payload;
            const newTaskId = 'task_' + state.nextTaskId;
            const parent = state.byId[parentId];

            return {
                ...state,
                nextTaskId: state.nextTaskId + 1,
                byId: {
                    ...state.byId,
                    [newTaskId]: {
                        name,
                        isExpanded: false,
                        isEditing: true,
                        done: false,
                        subtasks: undefined,
                    },
                    [parentId]: {
                        ...parent,
                        isExpanded: true,
                        subtasks: parent.subtasks ? [...parent.subtasks, newTaskId] : [newTaskId],
                    }
                },
                allByIds: [...state.allByIds, newTaskId],
            }
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