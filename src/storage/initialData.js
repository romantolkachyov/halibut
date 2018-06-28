export const taskTreeInitialData =  [
    {
      id: 0,
      label: 'Upper Level Folder',         
      childNodes: [
        {
          id: 1,
          label: 'First Task',
          description: 'asdfasdfadsfa'
        },
        {
          id: 2,
          done: true,
          label: '2 Task',
        },
        {
          id: 3,
          label: '3 Task',
        },
        {
          id: 4,
          label: 'Upper Level Folder',
          childNodes: [
            {
              id: 5,
              label: 'First Task',
            },
            {
              id: 6,
              label: '2 Task',
            },
            {
              id: 7,
              label: '3 Task',
            },
          ]
        },
      ],

      
    }
  ];

///////

  export const timesheetInitailData = {
    endOfDay: '18-00',
    rows: [
      {
        startAt: '10-00',
        taskId: 2,
        description: '123',
        duration: 60,
      },

      {
        startAt: '11-00',
        taskId: 3,
        description: '345',
        duration: 90,
      },


      {
        startAt: '12-30',
        taskId: 4,
        description: '6746',
        duration: 330,
      },

    ]
  };


////////////

export const taskTreeInitialDataSample =  {
  nextTaskId: 7,
  byId: {
    task_1: {
      name: 'First Task',
      description: 'asdfasdfadsfa',
    },
    task_2: {
      done: true,
      name: '2 Task',
    },
    task_3: {
      done: true,
      name: '3 Task',
    },
    task_4: {
      done: true,
      name: 'Upper Level Folder',
      subtasks: ['task_5', 'task_6'],
    },
    task_5: {
      name: '5 task',
    },
    task_6: {
      name: '6 task',
    },
    task_0: {
      name: 'Upper Level Folder',         
      subtasks: ['task_1', 'task_2', 'task_3', 'task_4'],
    },
  },
  allByIds: ['task_1', 'task_2', 'task_3', 'task_4', 'task_5', 'task_6'],
};
////////