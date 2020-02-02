let usernameElement = document.getElementById("username");
let listSiteNameElement = document.getElementById("listSiteName");
let promptPasswordElement = document.getElementById("promptPassword");
let submitButtonElement = document.getElementById("submitButton");
let site;
var createSite;

function load() {
    loadSite();
    createSite = false;
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

function createSiteClicked() {
    createSite = !createSite;
    if (createSite) {
        listSiteNameElement.placeholder = "Site Name";
        promptPasswordElement.placeholder = "Password";
    } else {
        listSiteNameElement.placeholder = "List Name";
        promptPasswordElement.placeholder = "Prompt";
    }
}

async function submit() {
    let data;
    let username = usernameElement.value;
    let endpoint;
    if (createSite) {
        let siteName = listSiteNameElement.value;
        let password = promptPasswordElement.value;
        endpoint = '/createSite';
        data = {
            username,
            siteName,
            password
        };
    } else {
        let listName = listSiteNameElement.value;
        let prompt = promptPasswordElement.value;
        endpoint = '/createList';
        data = {
            username,
            listName,
            prompt
        };
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    };

    const url = endpoint;
    const response = await fetch(url, options);
    const promise = await response.text();
    window.alert(promise);
}