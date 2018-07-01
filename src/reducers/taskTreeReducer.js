export function taskTreeReducer(state = { byId: {}, allByIds: [] }, action) {
    switch (action.type) {
        case 'ADD_TASK': {
            const { name, parentId } = action.payload;
            const newTaskId = 'task_' + state.nextTaskId;
            return {
                ...state,
                nextTaskId: state.nextTaskId + 1,
                byId: {
                    ...state.byId,
                    [newTaskId]: {
                        name,
                        subtasks: [],
                    },
                    [parentId]: {
                        ...state.byId[parentId],
                        subtasks: [...state.byId[parentId].subtasks, newTaskId],
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
        
        case 'SET_TASK_NAME': {
            const { taskId, name } = action.payload;
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [taskId]: {
                        ...state.byId[taskId],
                        name
                    }
                }
            }
        }
        default:
            return state;
    }
}