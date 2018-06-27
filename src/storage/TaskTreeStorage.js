/*
    node:
        id: number
        label: string
        done: boolean
        childNodes: node[]

    taskTree: 
        nodes: node[]
        nextNodeId: number
*/

export function saveTaskTree(taskTree) {
    window.localStorage.setItem('task_tree', JSON.stringify(taskTree));
}

export function loadTaskTree() {
    const taskTree = window.localStorage.getItem('task_tree');
    if (taskTree) {
        return JSON.parse(taskTree);
    }
    return {
        tasks: [{
            id: -1,
            label: 'Root',
        }],
        nextTaskId: 1,
    };
 }