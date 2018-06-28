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
        default:
            return state;
    }
}