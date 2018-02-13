import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Question from './individualQuestionDisplay';
import DisplayEquation from './displayEquation';


export default class QuestionsDisplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            equationsInputted : '',
            textEquations: '',
            showWithEquations: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        console.log("Handling Input Change for Questions",name,value);
    }


    renderEquation (asciiString) {
        console.log("asciiString", asciiString);
        if (asciiString) {
            return ( <div className="mb-4 box-shadow">
                        <DisplayEquation equationString = {asciiString}/>
                    </div>
                );
        } else {
            return null;
        }
    }

    handleSubmit() {
            this.setState({
                showWithEquations : true
            });

    }

    checkEqnsSanity() {
        const questions = this.props.questions;
        const equationsInputted = this.state.equationsInputted;

    }

    render() {
        const questions = this.props.questions;
        const asciiEqns = this.state.textEquations;
        let equations = null;
        if (asciiEqns && this.state.showWithEquations) {
            equations = this.renderEquation(asciiEqns);
        }
        return (
            <div>
                <div className="form-group">
                    <div className="form-control questionsWrapper"  rows="20" cols="150">
                        {questions.map((question, index) => <Question key={index} questionData = {question}/>)}
                    </div>
                </div>
                <div className="form-group">
                    <label> Text to Parse:</label>
                    <textarea name="textEquations" className="form-control" value={this.state.textEquations} onChange={this.handleInputChange} rows="20" cols="30">Put equations here...</textarea>
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>Apply Equations</button>
                {equations}
            </div>
        );
    }
}