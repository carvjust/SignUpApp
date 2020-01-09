const express = require('express');
const DataStore = require('nedb');

const app = express();
app.listen(3000, () => console.log('Listening'));
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json({limit: '1mb'}));

app.post('/:site/:selectedList/create', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;
    const appliedPath = "api/"+site+"/lists/"+selectedList+"/applied.db";
    const sitePath = "api/"+site+"/"+site+".db";
    const listsPath = "api/"+site+"/lists/"+"lists.db";
    const selectedListPath = "api/"+site+"/lists/"+selectedList+"/"+selectedList+".db";
    const appliedDB = new DataStore({ filename: ''+appliedPath, autoload: true });
    const siteDB = new DataStore({ filename: ''+sitePath, autoload: true });
    const listsDB = new DataStore({ filename: ''+listsPath, autoload: true });
    const selectedListDB = new DataStore({ filename: ''+selectedListPath, autoload: true });

    console.log("Create request submitted");
    const data = request.body;
    data.timestamp = Date.now();

    let error = "";
    appliedDB.insert(data, (err, doc) => {
        error = err;
    });

    let res = "Submission ";
    if (!(site == "") && error == "") {
        res += "Successful.";
    } else {
        res += "Unsuccessful. Please refresh the site and try again.";
        console.log(error);
    }

    response.send(res);
    response.end();
});

app.post('/:site/:selectedList/applied', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;
    const appliedPath = "api/"+site+"/lists/"+selectedList+"/applied.db";
    const appliedDB = new DataStore({ filename: ''+appliedPath, autoload: true });

    console.log("Put request submitted");
    const data = request.body;
    data.timestamp = Date.now();

    let error = "";
    appliedDB.insert(data, (err, doc) => {
        error = err;
    });

    let res = "Submission ";
    if (!(site == "") && error == "") {
        res += "Successful.";
    } else {
        res += "Unsuccessful. Please refresh the site and try again.";
        console.log(error);
    }

    response.send(res);
    response.end();
});