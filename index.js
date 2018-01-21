const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/questionJsonBuilder', function (req, res) {
    const questionJson = req.query.q;
    saveQuestionJson(questionJson,function(err) {
        if (err) {
            res.status(404).send('Question not saved');
            return;
        }
        res.send('Question saved');
    });
    readQuestionJson();
});


function saveQuestionJson(questionJson, callback) {
    fs.writeFile('./public/question.json', JSON.stringify(questionJson),'utf-8',callback);
}

function readQuestionJson() {
    fs.readFile('./public/question.json', (err, data) => {
        if (err) throw err;
        console.log(data);
        const readData = JSON.parse(data);
        console.log("Parsed Data",data);
    });
}

app.listen(5000, function () {console.log('Example app listening on port 5000!')})