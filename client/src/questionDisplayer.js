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
            showEquations: false,
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
        this.setState({
            showEquations : true
        });
        console.log("Handling Input Change for Questions",name,value);
    }


    renderEquation (asciiString) {
        console.log("asciiString", asciiString);
        if (asciiString) {
            return ( <div className="jumbotron scrollable">
                        <DisplayEquation equationString = {asciiString}/>
                    </div>
                );
        } else {
            return null;
        }
    }

    handleSubmit() {
            this.setState({
                showEquations : true,
                showWithEquations: true
            });
    }

    checkLengthMatching (obj1,obj2) {
        const length1 = obj1.length;
        const length2 = obj2.length;
        return (length1 === length2);
    }

    putEquationsIntoQuestions (questionData, eqnData) {
        let index = 0;
        let questionDataArray = [];
        questionDataArray.push(questionData['questionPart'].split(' '));
        questionDataArray.push(questionData['options'][0].split(' '));
        questionDataArray.push(questionData['options'][1].split(' '));
        questionDataArray.push(questionData['options'][2].split(' '));
        questionDataArray.push(questionData['options'][3].split(' '));

        return (
            questionDataArray.map( (questionData,partIndex) => {
                const eachQuestionPart = questionData.map((data) => {
                    if (data === '*') {
                        const showIndex = index;
                        index += 1;
                        return <div className="displayEquation">
                                    <DisplayEquation key={showIndex} equationString={eqnData[showIndex]}/>
                               </div>;
                    } else {
                        return <div> {data} &nbsp; </div>;
                    }
                });
                if (partIndex === 0) {
                    return <div className="questionPart row" key={partIndex}>{eachQuestionPart}</div>
                }
                return <div className="row" key={partIndex}>{eachQuestionPart}</div>
            })
        );

    }

    formProperEquations() {
        const eqnData = this.state.textEquations;
        console.log(eqnData);
        const eqnDataJson = JSON.parse(eqnData);
        console.log("JSON OBJECT:",eqnDataJson);
        if (eqnDataJson) {
            const equations = eqnDataJson['equations'];
            return equations;
        } else {
            return;
        }
    }

    renderQuestionsWithEquations() {
        const questions = this.props.questions;
        console.log("questions",questions);
        const equationsInputted = this.formProperEquations();
        console.log("equations:",equationsInputted);
        if (equationsInputted) {
            for (let i=0; i< equationsInputted.length; i++) {
                const checkLengthMatching = this.checkLengthMatching(questions[i]['equations'], equationsInputted[i]);
                if (checkLengthMatching) {
                    return this.putEquationsIntoQuestions(questions[i], equationsInputted[i]);
                } else {
                    return <div> Some thing Wrong Question Data Had:{questions[i]['equations'].length} Equations EquationData Had:{equationsInputted[i].length}</div>
                }
            }
        }
        return;
    }

    render() {
        const questions = this.props.questions;
        console.log("questions",questions);
        const asciiEqns = this.state.textEquations;
        let equations = null;
        let textWithEquations;
        if (asciiEqns && this.state.showEquations) {
            equations = this.renderEquation(asciiEqns);
        }
        if (asciiEqns && this.state.showWithEquations) {
            textWithEquations = this.renderQuestionsWithEquations();
        }
        return (
            <div>
                <div className="form-group">
                    <div className="form-control questionsWrapper"  rows="20" cols="150">
                        {questions.map((question, index) => <Question key={index} questionData = {question}/>)}
                    </div>
                </div>
                <div className="form-group">
                    <label> Equations Data:</label>
                    <textarea name="textEquations" className="form-control" value={this.state.textEquations} onChange={this.handleInputChange} rows="20" cols="30">Put equations here...</textarea>
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>Equations Output</button>
                {equations}
                {textWithEquations}
            </div>
        );
    }
}