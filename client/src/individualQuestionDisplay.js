import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const question = this.props.questionData;
        const questionPart = question['questionPart'];
        const questionOptions = question['options'];
        const option1 =  questionOptions[0] || '';
        const option2 =  questionOptions[1] || '';
        const option3 =  questionOptions[2] || '';
        const option4 =  questionOptions[3] || '';

        return (
            <div className="questionBox">
                <div className="container">
                    <div className="row questionPart">{questionPart}</div>
                    <div className="row">{option1}</div>
                    <div className="row">{option2}</div>
                    <div className="row">{option3}</div>
                    <div className="row">{option4}</div>
                </div>
            </div>
        );
    }
}