const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/questionJsonBuilder', function (req, res) {
    const questionJson = req.body;
    console.log("questionJson",questionJson);
    saveQuestionJson(questionJson,function(err) {
        if (err) {
            res.status(404).send('Question not saved');
            return;
        }
    });
    res.json({"messagae":"JSON written"});
});


function saveQuestionJson(questionJson, callback) {
    const fileName = questionJson['fileName'];
    let filePath = './public/unknownFileName.json';
    if (fileName) {
        filePath = './public/'+questionJson['fileName']+'.json';;
    }

    fs.writeFile(filePath, JSON.stringify(questionJson),'utf-8',callback);
}


app.listen(5000, function () {console.log('Example app listening on port 5000!')})