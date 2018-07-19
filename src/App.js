import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { taskTreeReducer } from './reducers/taskTreeReducer';

import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import { fromJS } from 'immutable';
import './App.css';

import { TaskTree } from './TaskTree/TaskTree';

const loadedState = window.localStorage.getItem('app_state');
let store;
if (loadedState === null) {
  store = createStore(taskTreeReducer);
} else {
  store = createStore(taskTreeReducer, fromJS(JSON.parse(loadedState)));
}

let saveTimeout;
store.subscribe(() => {
  if (!store.getState()) return;
  console.log(store.getState());
  
  if (saveTimeout) {
      clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
      window.localStorage.setItem('app_state', JSON.stringify(store.getState().toJS()));
  }, 1 * 1000);
});

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
