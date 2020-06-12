import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import DayWorkList from './components/DayWorkList';


const App = () => {

  return (
    <BrowserRouter>
      <div>
        <h1>React-Firebase Work Progress App</h1>
        <ul>
          <li><Link to='/projects'>Project</Link></li>
          <li><Link to='/tasks'>Tasks</Link></li>
          <li><Link to='/day_works'>Day Works</Link></li>
        </ul>
        <hr />

        <Route path='/projects' component={ProjectList} />
        <Route path='/tasks' component={TaskList} />
        <Route path='/day_works' component={DayWorkList} />

      </div>
    </BrowserRouter>
  )
}

export default App;
