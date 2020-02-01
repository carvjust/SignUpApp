const express = require('express');
const DataStore = require('nedb');
const app = express();

const hostname = ''; // u3239b235428f5e.ant.amazon.com
const port = 3000;

app.listen(port, hostname, () => {
    console.log('Listening at http://'+hostname+':'+port+'/');
});

app.use(express.static(__dirname+'/Public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit: '1mb'}));

function respond(response, error, message) {
    let res = "Submission ";
    if (error === "") {
        res += "Successful." + message;
    } else {
        res += "Unsuccessful. Please refresh the site and try again.";
        console.log(error);
    }

    response.send(res);
    response.end();
}

app.post('/:site/createSite', (request, response) => {
    const site = request.params.site;

    const sitePath = "api/"+site+"/"+site+".db";
    const siteDB = new DataStore({ filename: ''+sitePath, autoload: true });

    const timestamp = Date.now();
    const siteInfo = {"siteName": site, "created": timestamp, "createdBy": username};
    console.log("Create site request submitted");

    let error = "";
    siteDB.insert(siteInfo, (err, doc) => {
        error = err;
    });

    respond(response, error, " Created new site: " + site);
});


app.post('/:site/createList', (request, response) => {
    const site = request.params.site;
    const data = request.body;

    const listName = data.listName;
    const userName = data.username;
    const prompt = data.prompt;

    const listPath = "api/"+site+"/lists/"+listName+"/"+listName+".db";
    const listDB = new DataStore({filename: ''+listPath, autoload: true});

    const timestamp = Date.now();
    const listInfo = {"prompt": prompt, "createdBy": userName, isClosed: false, closedBy: "", "timestamp": timestamp};
    console.log("Create list request submitted");

    let error = "";
    listDB.insert(listInfo, (err, doc) => {
        error = err;
    });

    respond(response, error, " Created new list: " + listName);
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

    respond(response, error, "");
});
