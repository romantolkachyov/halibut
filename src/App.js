import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { taskTreeInitialDataSample } from './storage/initialData';
import { taskTreeReducer } from './reducers/taskTreeReducer';


import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import { TaskTree } from './TaskTree/TaskTree';

const store = createStore(taskTreeReducer, taskTreeInitialDataSample);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
            <TaskTree />
        </div>
      </Provider>
    );
  }
}

export default App;
