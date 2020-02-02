let usernameElement = document.getElementById("username");
let listSiteNameElement = document.getElementById("listSiteName");
let promptPasswordElement = document.getElementById("promptPassword");
let createSiteButtonElement = document.getElementById("createSite");
let topCreateTextElement = document.getElementById("topCreateText");
let site;
var createSite;
// TODO: Change this so it cannot be seen by user
const masterPass = "Washeslow?";

function load() {
    loadSite();
    createSite = false;
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

function clear() {
    usernameElement.value = "";
    listSiteNameElement.value = "";
    promptPasswordElement.value = "";
}

function createSiteClicked() {
    if (createSite) {
        createSite = !createSite;
        clear();
        createSiteButtonElement.value = "Create Site";
        topCreateTextElement.innerHTML = "Create A New List";
        listSiteNameElement.placeholder = "List Name";
        promptPasswordElement.placeholder = "Prompt";
        return;
    }

    let pass = prompt("Please enter Master Password.");
    if (pass === masterPass) {
        createSite = !createSite;
        if (createSite) {
            clear();
            createSiteButtonElement.value = "Create List";
            topCreateTextElement.innerText = "!CAUTION! | Create A New Site | !CAUTION!";
            listSiteNameElement.placeholder = "Site Name";
            promptPasswordElement.placeholder = "Password";
        }
    } else {
        alert("Incorrect password. Please verify and try.");
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

    const url = "/" + site + endpoint;
    const response = await fetch(url, options);
    const promise = await response.text();
    window.alert(promise);
    clear();
}