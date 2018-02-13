import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import QuestionsDisplayer from './questionDisplayer';

export default class QuestionParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textValue: '',
            subject: '',
            year:'',
            exam:'',
            questions: '',
            fileName: '',
            showQuestions: false
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
        console.log("Handling Input Change",name,value);
    }

    handleSubmit() {
        var questionText = this.state.textValue;
        if (questionText && questionText.length > 0) {
            questionText = questionText.replace(/(\r\n|\n|\r)/gm,' ');
            questionText = questionText.replace(/\s{2,}/g,' ');
            var splitWords = questionText.split(" ");
            var options = ["(1)","(2)","(3)","(4)"];
            var questionStartRegex = RegExp('^\\d+[.]$');
            var index = 0;
            var traversalLength = splitWords.length;
            var questions = {"questions":[]};

            while (index < traversalLength) {
                var word = splitWords[index];
                if (questionStartRegex.test(word) || word === 'END') {
                    var questionBuilder = {};
                    var equations = [];
                    var images = [];
                    index += 1;
                    word = splitWords[index];
                    var questionPart = "";
                    while (word != options[0]) {
                        //console.log("Trying to find Question Part",questionPart);
                        if (word === '*') {
                            equations.push(index);
                        }
                        if (word === '#') {
                            images.push(index);
                        }
                        questionPart += (word+" ");
                        index += 1;
                        word = splitWords[index];
                    }

                    questionBuilder["questionPart"] = questionPart;
                    var questionOptions = [];
                    for (var i = 0;i < 4;i++) {
                        var currentOption = options[i];
                        var nextOption;
                        if (i != 3) {
                            nextOption = options[i + 1];
                        } else {
                            nextOption = undefined;
                        }

                        if (word === currentOption) {
                            index += 1;
                            word = splitWords[index];
                            var optionPart = "";
                            while (word != nextOption && !questionStartRegex.test(word)) {
                                // console.log("Option Building",i, optionPart);
                                if (word === '*') {
                                    equations.push(index);
                                }
                                if (word === '#') {
                                    images.push(index);
                                }
                                optionPart += (word + " ");
                                index += 1;
                                word = splitWords[index];
                            }
                            questionOptions.push(optionPart);
                        }
                    }
                    questionBuilder['options'] = questionOptions;
                    questionBuilder['equations'] = equations;
                    questionBuilder['images'] = images;
                    questions["questions"].push(questionBuilder);
                }
            }
        }
        console.log("questions",questions);
        if (questions) {
            this.setState({
                questions:questions["questions"],
                showQuestions: true
            })
        }

        // const fileName = this.state.exam + '_' + this.state.subject + '_' + this.state.year;
        // const param = this.state;
        // param['fileName'] = fileName;
        // this.makePostRequest(param);
    }

    makePostRequest (param) {

        const jsonBuilderPath = `/questionJsonBuilder`;
        const url = jsonBuilderPath;
        fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body:  JSON.stringify(param)
        }).then( (response) => {
            console.log("Success",response.json());
            this.fetchResource(param['fileName']);
        }).catch( (response) => {
            console.log("ERROR",response);
        });
    }

    fetchResource(fileName) {

        if (fileName) {
            const filePath = "../" + fileName + ".json";
            fetch(filePath).then((response) => {
                console.log("Sucessfull Fetch");
            }).catch((error) => {
                console.log("Error in fetching", error);
            });
        } else {
            console.log("FileName UNDEFINED,No Fetch Possible");
        }
    }

    render() {
        let questionData = null;
        if (this.state.showQuestions) {
            questionData =  <QuestionsDisplayer questions={this.state.questions}/>;
        }
        return (
            <div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Exam: </label>
                    <div className="col-sm-4">
                        <input name="exam" className="form-control" type="text" value={this.state.exam} onChange={this.handleInputChange}/>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Subject: </label>
                    <div className="col-sm-4">
                        <input name="subject" className="form-control" type="text" value={this.state.subject} onChange={this.handleInputChange}/>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Year: </label>
                    <div className="col-sm-4">
                        <input name="year" className="form-control" type="number" min="2005" max="2018" step="1" value={this.state.year} onChange={this.handleInputChange}/>
                    </div>
                </div>

                <div className="form-group">
                    <label> Text to Parse:</label>
                    <textarea name="textValue" className="form-control" value={this.state.textValue} onChange={this.handleInputChange} rows="20" cols="30">Put text questions here...</textarea>
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>Parse Text</button>
                {questionData}
            </div>
        );
    }
}