const express = require('express');
const DataStore = require('nedb');
const fs = require('fs');
const app = express();

const hostname = ''; // u3239b235428f5e.ant.amazon.com
const port = 3000;

app.listen(port, hostname, () => {
    console.log('Listening at http://'+hostname+':'+port+'/');
});

app.use(express.static(__dirname+'/Public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit: '1mb'}));

const directoryPath = "C:\\Users\\carvjust\\WebstormProjects\\SignupApplication\\";

function respond(response, error, message) {
    let res = "Submission ";
    if (error === "") {
        res += "successful." + message;
    } else {
        res += "unsuccessful." + message;
        console.log(error);
    }

    response.send(res);
    response.end();
}

function pathExists(path) {
    const actualPath = directoryPath+path;
    return fs.existsSync(actualPath);
}

app.get('masterPass', (request, response) => {

});

// Get a specific list from site db. Whether it is closed or not
app.get('/:site/:list', (request, response) => {

});

// Get all open list from a specified site db. THIS WILL ONLY GET THE NAMES OF SITES NOT THE DBS THEMSELVES
// This should only be used for loading into selectors
app.get('/:site/getOpenListNames', (request, response) => {

});

// Get applied DB from specified list
app.get('/:site/:list/getApplied', (request, response) => {

});

// Close a list db
app.post('/:site/closeList', (request, response) => {

});

// Create a site DB to store lists
app.post('/:site/createSite', (request, response) => {
    const data = request.body;

    const username = data.username;
    const site = data.siteName;
    const password = data.password;

    const sitePath = "api\\"+site+"\\"+site+".db";
    const siteDB = new DataStore({ filename: ''+sitePath, autoload: true });

    const timestamp = Date.now();
    const siteInfo = {"siteName": site, "created": timestamp, "createdBy": username, "password": password};

    let error = "";
    let sitePathExists = pathExists(sitePath);
    if (sitePathExists)  {
        respond(response, "ERROR: (CREATING SITE) Site already exists.", " Site " + site + " already exists.");
        return;
    }

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

    const sitePath = "api\\"+site;
    const listPath = "api\\"+site+"\\lists\\"+listName+"\\"+listName+".db";
    const listDB = new DataStore({filename: ''+listPath, autoload: true});

    const timestamp = Date.now();
    const listInfo = {"prompt": prompt, "createdBy": userName, isClosed: false, closedBy: "", "timestamp": timestamp};

    if (!(pathExists(sitePath))) {
        respond(response, "ERROR: (Creation Error) Site selected does not exist.", " Site " + site + " does not exist.");
        return;
    } else if (pathExists(listPath)) {
        respond(response, "ERROR: (Creation Error) List already exists.", " List " + listName + " already exists in site " + site + ".");
        return;
    }

    let error = "";
    listDB.insert(listInfo, (err, doc) => {
        error = err;
    });

    respond(response, error, " Created new list: " + listName);
});

app.post('/:site/:selectedList/applied', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;

    const sitePath = "api\\"+site;
    const listPath = "api\\"+site+"\\lists\\"+selectedList;
    const appliedPath = "api\\"+site+"\\lists\\"+selectedList+"\\applied.db";
    const appliedDB = new DataStore({ filename: ''+appliedPath, autoload: true });

    const data = request.body;
    data.timestamp = Date.now();

    if (!(pathExists(sitePath))) {
        respond(response, "ERROR: (Application Error) Applying to non existent site.", " Site " + site + " does not exist.");
        return;
    } else if (!(pathExists(listPath))) {
        respond(response, "ERROR: (Application Error) Applying to non existent list.", " List " + selectedList + " does not exist.");
        return;
    }

    let error = "";
    appliedDB.insert(data, (err, doc) => {
        error = err;
    });

    respond(response, error, "");
});
