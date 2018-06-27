import React, { Component } from 'react';

import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import { TaskTree } from './TaskTree/TaskTree';

class App extends Component {
  render() {
    return (
      <div className="App">
          <TaskTree />
      </div>
    );
  }
}

export default App;
