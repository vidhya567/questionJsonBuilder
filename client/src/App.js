import React, { Component } from 'react';
import './App.css';
import QuestionParser from './questionParser';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
      };
  }
  render() {
    const ascii = 'm_0 + m_1';
    return (
      <div className="App">
          <QuestionParser/>
      </div>
    );
  }
}

export default App;
