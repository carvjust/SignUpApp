// ---------------------------- //
// ------- NODE.JS VARS ------- //
// ---------------------------- //

const express = require('express');
const DataStore = require('nedb');
const fs = require('fs');
const app = express();
const ExcelJS = require('exceljs');

// ---------------------------- //
// ------- SETUP SERVER ------- //
// ---------------------------- //

const hostname = '127.0.0.1'; // u3239b235428f5e.ant.amazon.com
const port = 3000;

app.listen(port, hostname, () => {
    console.log('Listening at http://'+hostname+':'+port+'/');
});

app.use(express.static(__dirname+'/Public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit: '1mb'}));

const directoryPath = __dirname;

// -------------------------------- //
// ------- HELPER FUNCTIONS ------- //
// -------------------------------- //

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
    const actualPath = directoryPath+"/"+path;
    return fs.existsSync(actualPath);
}

// ------------------------------------- //
// ------- GET REQUEST FUNCTIONS ------- //
// ------------------------------------- //

// Get a specific list from site and, whether it is closed or not, download it
app.get('/:site/:selectedList/download', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;

    const appliedPath = "api/"+site+"/lists/"+selectedList+"/applied.db";
    const appliedDB = new DataStore({ filename: appliedPath, autoload: true });
    appliedDB.loadDatabase();

    appliedDB.find({}, function (err, docs) {
        let applied = docs;
        let workbook = new ExcelJS.Workbook();
        workbook.creator = "SLC1-IT";
        workbook.properties.date1904 = true;

        let sheet = workbook.addWorksheet(selectedList + ' applied');

        sheet.columns = [
            { header: 'Badge #', key: 'badge', width: 10 },
            { header: 'Comment', key: 'comment', width: 32 },
            { header: 'Date Applied', key: 'date', width: 15}
        ];

        sheet.addRow({});

        for (let user in applied) {
            if (applied.hasOwnProperty(user)) {
                let badge = applied[user].badgeValue;
                let comment = applied[user].commentValue;
                let date = new Date(applied[user].timestamp);

                sheet.addRow({badge: badge, comment: comment, date: date})
            }
        }

        let fileName = selectedList + ' applied.xlsx';
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        workbook.xlsx.write(response).then(function(){
            response.end();
        });
    });
});

app.get('/sites', (request, response) => {

    const apiPath = "api/api.db";

    // check if api exists and if not send a BIG error
    if (!(pathExists(apiPath))) {
        respond(response, "ERROR: (HUGE ERROR) API may have been deleted.", "Please try refreshing the page, if problem persists please contact a member of the SignUpApplication Team via signupapp@amazon.com with error code '00F'");
        return;
    }

    // after checking that the api exists create the DB
    const apiDB = new DataStore({filename: ''+apiPath, autoload: true});

    apiDB.find({}, function (err, docs) {
        let apiInfo = docs[0];
        let sites = apiInfo.sites;

        response.send(sites);
        response.end();
    })
});

// Get all open list from a specified site db. THIS WILL ONLY GET THE NAMES OF SITES NOT THE DBS THEMSELVES
// This should only be used for loading into selectors
app.get('/:site/getOpenListNames', (request, response) => {

    // create vars
    const site = request.params.site;
    const sitePath = "api/"+site;
    const siteDBPath = sitePath+"/"+site+".db";

    // check if site exists and if not send an error
    if (!(pathExists(sitePath)) || !(pathExists(siteDBPath))) {
        respond(response, "ERROR: (Creation Error) Site selected does not exist.", " Site " + site + " does not exist. Please verify you have the correct site, if problem persists please contact a member of the SignUpApplication Team via signupapp@amazon.com");
        return;
    }

    // after checking that the site exists create the DB
    const siteDB = new DataStore({filename: ''+siteDBPath, autoload: true});
    // just in case the database didn't load
    siteDB.loadDatabase();

    siteDB.find({}, function (err, docs) {
        let siteInfo = docs[0];
        let openLists = siteInfo.openLists;

        response.send(openLists);
        response.end();
    })
});

// Get all lists names regardless of if the list is open from a specified site db. THIS WILL ONLY GET THE NAMES OF SITES NOT THE DBS THEMSELVES
// This should only be used for loading into selectors
app.get('/:site/getAllListNames', (request, response) => {

    // create vars
    const site = request.params.site;
    const sitePath = "api/"+site;
    const siteDBPath = sitePath+"/"+site+".db";

    // check if site exists and if not send an error
    if (!(pathExists(sitePath)) || !(pathExists(siteDBPath))) {
        respond(response, "ERROR: (Creation Error) Site selected does not exist.", " Site " + site + " does not exist. Please verify you have the correct site, if problem persists please contact a member of the SignUpApplication Team via signupapp@amazon.com");
        return;
    }

    // after checking that the site exists create the DB
    const siteDB = new DataStore({filename: ''+siteDBPath, autoload: true});
    // just in case the database didn't load
    siteDB.loadDatabase();

    siteDB.find({}, function (err, docs) {
        let siteInfo = docs[0];
        let openLists = siteInfo.openLists;
        let closedLists = siteInfo.closedLists;

        let allLists = [];

        for (let i = 0; i < openLists.length; i++) {
            allLists[allLists.length] = openLists[i];
        }
        for (let i = 0; i < closedLists.length; i++) {
            allLists[allLists.length] = closedLists[i];
        }

        response.send(allLists);
        response.end();
    })
});

app.get('/:site/:selectedList/getPrompt', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;


});

// -------------------------------------- //
// ------- POST REQUEST FUNCTIONS ------- //
// -------------------------------------- //

// check master password from api database
app.post('/masterPass', (request, response) => {
    let data = request.body;
    let pass = data.pass;

    const apiPath = "api/api.db";
    const apiDB = new DataStore({ filename: apiPath, autoload: true });
    apiDB.loadDatabase();

    let master = "!@#$%$#@!123ifYouGuessThisAndMyCodeMalfunctionedThenYouCanHaveAccess321!@#$%$#@!";

    apiDB.find({}, function (err, docs) {
        master = docs[0].master;

        response.send(pass === master);
        response.end();
    });
});

// check site password
app.post('/:site/checkPassword', (request, response) => {
    const site = request.params.site;
    const inputPass = request.body.password;

    const sitePath = "api/"+site;
    const siteDBPath = sitePath+"/"+site+".db";

    if (!(pathExists(sitePath)) || !(pathExists(siteDBPath))) {
        respond(response, "ERROR: (Creation Error) Site selected does not exist.", " Site " + site + " does not exist. Please verify you have the correct site, if problem persists please contact a member of the SignUpApplication Team via signupapp@amazon.com");
        return;
    }

    // after checking that the site exists create the DB
    const siteDB = new DataStore({filename: ''+siteDBPath, autoload: true});
    // just in case the database didn't load
    siteDB.loadDatabase();

    siteDB.find({}, function (err, docs) {
        let siteInfo = docs[0];
        let correctPass = siteInfo.password;

        response.send(inputPass === correctPass);
        response.end();
    })
});

// Create a site DB to store lists
app.post('/:site/createSite', (request, response) => {
    const data = request.body;

    let username = data.username;
    let site = data.siteName.toUpperCase();
    let password = data.password;

    const apiPath = "api/api.db";
    const sitePath = "api/"+site+"/"+site+".db";
    const apiDB = new DataStore({ filename: apiPath, autoload: true });

    const timestamp = Date.now();
    const siteInfo = {"siteName": site, "openLists": [], "closedLists": [], "created": timestamp, "createdBy": username, "password": password};

    let error = "";
    let sitePathExists = pathExists(sitePath);
    if (sitePathExists)  {
        respond(response, "ERROR: (CREATING SITE) Site already exists.", " Site " + site + " already exists.");
        return;
    }

    let message = " Created new site: " + site;

    apiDB.find({}, (err, doc) => {

        let apiInfo = doc[0];
        let sites = apiInfo["sites"];
        let length = sites.length;
        sites[length] = site;

        const siteDB = new DataStore({filename: '' + sitePath, autoload: true});

         apiDB.remove({}, (remErr, amountRemoved) => {
             apiDB.insert(apiInfo, (insErr, apiDoc) => {
                 siteDB.insert(siteInfo, (siteErr, siteDoc) => {
                     // check for any errors
                     if (err != null) {
                         error = err;
                         message = "ERROR: " + error;
                         respond(response, error, message);
                     } else if (remErr != null) {
                         error = remErr;
                         message = "ERROR: " + error;
                         respond(response, error, message);
                     } else if (insErr != null) {
                         error = insErr;
                         message = "ERROR: " + error;
                         respond(response, error, message);
                     } else if (siteErr != null) {
                         error = siteErr;
                         message = "ERROR: " + error;
                         respond(response, error, message);
                     } else {
                         respond(response, error, message);
                     }
                 })
             })
         });
    });
});

// create or close a list based on param passed in from user
app.post('/:site/createOrClose', (request, response) => {

    // create vars
    const site = request.params.site;
    const data = request.body;
    const shouldCreate = data.shouldCreate;

    const listName = data.listName;
    const userName = data.username;
    const timestamp = Date.now();

    let error = "";
    let message = " Created new list: " + listName;

    const sitePath = "api/"+site;
    const siteDBPath = sitePath+"/"+site+".db";
    const listPath = sitePath+"/lists/"+listName+"/"+listName+".db";

    // check if site exists and if not send an error
    if (!(pathExists(sitePath))) {
        respond(response, "ERROR: (Creation Error) Site selected does not exist.", " Site " + site + " does not exist.");
        return;
    }

    // after checking that the site exists create the DB
    const siteDB = new DataStore({filename: ''+siteDBPath, autoload: true});
    // just in case the database didn't load
    siteDB.loadDatabase();

    // find the site db and get its info
    siteDB.find({}, function (err, doc) {
        // declare vars for docs found
        const siteInfo = doc[0];
        let prompt;
        let listInfo;

        // check for errors so we don't have any issues going forward
        if (shouldCreate) {
            if (pathExists(listPath)) {
                respond(response, "ERROR: (Creation Error) List already exists.", " List " + listName + " already exists in site " + site + ".");
                return;
            }
        } else {
            if (!pathExists(listPath)) {
                respond(response, "ERROR: (Close Error) List does not exist.", " List " + listName + " does not exist in site  " + site + ".");
                return;
            }
            if (siteInfo.openLists.indexOf(listName) === -1) {
                if (siteInfo.closedLists.indexOf(listName) === -1) {
                    respond(response, "ERROR: (Close Error) Something went wrong.", "Something went wrong with the creation of this list. Please contact a member of the SignUpApplication Team via signupapp@amazon.com");
                    return;
                } else {
                    respond(response, "ERROR: (Close Error) Trying to close a list that is already closed.", "You are trying to close a list that has already been closed. Try refreshing the page and trying again. If problem persists, please contact a member of the SignUpApplication Team via signupapp@amazon.com");
                    return;
                }
            }
        }
        // now that we have checked for errors, create or grab listDB
        let listDB = new DataStore({filename: '' + listPath, autoload: true});
        listDB.loadDatabase();

        if (shouldCreate) {
            // if this else hits it means that we want to create a new list

            // set new list to open list var at the end of the array
            const length = siteInfo.openLists.length;
            siteInfo.openLists[length] = listName;

            // assign vars that will only not be null if create was sent
            prompt = data.prompt;
            listInfo = {
                "listName": listName,
                "prompt": prompt,
                "createdBy": userName,
                isClosed: false,
                closedBy: "",
                "timestamp": timestamp
            };

        } else {
            // if this else hits it means that we want to close the list.
            // get index of list and remove the list from open lists
            let selectedIndex = siteInfo.openLists.indexOf(listName);
            siteInfo.openLists.splice(selectedIndex, 1);

            let length = siteInfo.closedLists.length;
            siteInfo.closedLists[length] = listName;
        }

        // now that we have the updated info we need to remove the old version
        siteDB.remove({siteName: site}, {}, function (remErr, numRemoved) {

            // info should now be removed so we need to re-add the updated version
            siteDB.insert(siteInfo, function (insErr, insDoc) {
                // check if user wants to create or not
                if (shouldCreate) {

                    // now insert the list to its own db
                    listDB.insert(listInfo, (listErr, listDoc) => {

                        // check for any errors
                        if (err != null) {
                            error = err;
                            message = "ERROR: " + error;
                        } else if (remErr != null) {
                            error = remErr;
                            message = "ERROR: " + error;
                        } else if (insErr != null) {
                            error = insErr;
                            message = "ERROR: " + error;
                        } else if (listErr != null) {
                            error = listErr;
                            message = "ERROR: " + error;
                        }

                        respond(response, error, message);
                    })
                } else {
                    // TODO: test whether this works or not. need to hook up the close js to check

                    // grab current list info
                    listDB.find({}, function (err, listDoc) {

                        listInfo = listDoc[0];
                        // update List Info
                        listInfo.isClosed = true;
                        listInfo.closedBy = userName;
                        listInfo.closedDate = timestamp;

                        listDB.remove({}, {}, function (remErr, numRemoved) {

                            // info should now be removed so we need to re-add the updated version
                            listDB.insert(listInfo, function (insErr, insDoc) {

                                // check for any errors
                                if (err != null) {
                                    error = err;
                                    message = "ERROR: " + error;
                                } else if (remErr != null) {
                                    error = remErr;
                                    message = "ERROR: " + error;
                                } else if (insErr != null) {
                                    error = insErr;
                                    message = "ERROR: " + error;
                                }

                                respond(response, error, message);
                            })
                        })
                    })
                }
            })
        })
    })
});

// set a user that has applied to list to selected lists database
app.post('/:site/:selectedList/applied', (request, response) => {
    const site = request.params.site;
    const selectedList = request.params.selectedList;

    const sitePath = "api/"+site;
    const listPath = "api/"+site+"/lists/"+selectedList;
    const appliedPath = "api/"+site+"/lists/"+selectedList+"/applied.db";
    const appliedDB = new DataStore({ filename: appliedPath, autoload: true});

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
