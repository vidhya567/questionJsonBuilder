import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class QuestionParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textValue: '',
            subject: '',
            year:'',
            exam:'',
            questions: '',
            fileName: ''
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
            var splitWords = questionText.split(" ");
            var options = ["(1)","(2)","(3)","(4)"];
            var questionStartRegex = RegExp('^\\d+[.]$');
            var index = 0;
            var traversalLength = splitWords.length;
            var questions = {"questions":[]};

            while (index < traversalLength) {
                var word = splitWords[index];
                if (questionStartRegex.test(word)) {
                    var questionBuilder = {};
                    index += 1;
                    word = splitWords[index];
                    var questionPart = "";
                    while (word != options[0]) {
                        //console.log("Trying to find Question Part",questionPart);
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
                        if (word == currentOption) {
                            index += 1;
                            word = splitWords[index];
                            var optionPart = "";
                            while (word != nextOption && !questionStartRegex.test(word)) {
                                // console.log("Option Building",i, optionPart);
                                optionPart += (word + " ");
                                index += 1;
                                word = splitWords[index];
                            }
                            questionOptions.push(optionPart);
                        }
                    }
                    questionBuilder["options"] = questionOptions;
                }
                questions["questions"].push(questionBuilder);
            }
        }
        console.log("questions",questions);
        if (questions) {
            this.setState({questions:questions["questions"]})
        }
        const fileName = this.state.exam + '_' + this.state.subject + '_' + this.state.year;
        const param = this.state;
        param['fileName'] = fileName;
        this.makePostRequest(param);
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
            console.log("Sucess",response.json());
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
                    <textarea name="textValue" className="form-control" value={this.state.textValue} onChange={this.handleInputChange} rows="20" cols="150">Put text questions here...</textarea>
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>Parse Text</button>
            </div>
        );
    }
}