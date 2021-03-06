import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Question from './individualQuestionDisplay';
import DisplayEquation from './displayEquation';


export default class QuestionsDisplayer extends React.Component {
    constructor(props) {
        super(props);
        const initialEquationText = this.formEquationHelper(props.questions);
        this.state = {
            equationsInputted : '',
            textEquations: initialEquationText,
            showEquations: false,
            showWithEquations: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    formEquationHelper(questions) {
        let initialEquationJson = {};
        initialEquationJson['equations'] = [];
        for (let question of questions) {
            const equations = question['equations'];
            const equation = Array(equations.length).fill(' ');
            initialEquationJson['equations'].push(equation);
        }
        return JSON.stringify(initialEquationJson);
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

    renderEquations () {
        const equations = this.formProperEquations();

        const eqns = equations.map( (eqn,partIndex) => {
            const eachQuestionPart = eqn.map((data,qeqnIndex) => {
                if (data) {
                    return <div className="displayEquation">
                        <DisplayEquation key={qeqnIndex} equationString={data}/>
                    </div>;
                }
            });
            return <div className="row" key={partIndex}>{partIndex} &nbsp; {eachQuestionPart}</div>
        });
        return <div className="jumbotron scrollable equationBox">
                    {eqns}
                </div>
    }


    renderEquation (asciiString, key) {
        console.log("asciiString", asciiString);
        if (asciiString) {
            return (<DisplayEquation key={key} equationString = {asciiString}/>);
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
        let someData = false;
        for (let objEqn of obj2) {
            if (objEqn.trim().length !== 0) {
                someData = true;
                break;
            }
        }
        return (length1 === length2) && someData;
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
        let data = null;
        if (equationsInputted) {
            data = equationsInputted.map((equationInputted,i) => {
                const checkLengthMatching = this.checkLengthMatching(questions[i]['equations'], equationInputted);
                if (checkLengthMatching) {
                    return this.putEquationsIntoQuestions(questions[i], equationInputted);
                } else {
                    return <div> Some thing Wrong Question Data Had:{questions[i]['equations'].length} Equations EquationData Had:{equationsInputted[i].length}</div>
                }
            } ) ;
        }
        return <div className="jumbotron scrollable equationBox">
            {data}
        </div>;
    }

    render() {
        const questions = this.props.questions;
        console.log("questions",questions);
        const asciiEqns = this.state.textEquations;
        let equations = null;
        let textWithEquations;
        if (asciiEqns && this.state.showEquations) {
            equations = this.renderEquations();
        }
        if (asciiEqns && this.state.showWithEquations) {
            textWithEquations = this.renderQuestionsWithEquations();
        }
        return (
            <div>
                <div className="form-group">
                    <div className="form-control questionsWrapper"  rows="20" cols="150">
                        {questions.map((question, index) => <Question key={index} questionIndex={index+"."} questionData = {question}/>)}
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