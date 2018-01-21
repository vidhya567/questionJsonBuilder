import React, { Component } from 'react';
import './App.css';
import QuestionParser from './questionParser';

class App extends Component {
  render() {
    return (
      <div className="App">
          <QuestionParser/>
      </div>
    );
  }
}

export default App;
