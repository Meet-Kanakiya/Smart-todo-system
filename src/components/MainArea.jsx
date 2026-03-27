import React from 'react';
import TodoList from './TodoList';
import Planner from './Planner';
import Pomodoro from './Pomodoro';
import Notes from './Notes';
import Groups from './Groups';
import Analytics from './Analytics';
import AISuggest from './AISuggest';

export default function MainArea(){
  return (
    <div>
      <div id="todo" className="card"><TodoList/></div>
      <div id="planner" className="card"><Planner/></div>
      <div id="pomodoro" className="card"><Pomodoro/></div>
      <div id="notes" className="card"><Notes/></div>
      <div id="groups" className="card"><Groups/></div>
      <div id="analytics" className="card"><Analytics/></div>
      <div id="ai" className="card"><AISuggest/></div>
    </div>
  )
}
