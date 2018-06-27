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