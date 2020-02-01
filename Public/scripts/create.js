let usernameElement = document.getElementById("username");
let listNameElement = document.getElementById("listName");
let promptElement = document.getElementById("prompt");
let site;

function load() {
    loadSite();
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

async function submit() {
    let username = usernameElement.value;
    let listName = listNameElement.value;
    let prompt = promptElement.value;

    const data = {
        username,
        listName,
        prompt
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
    };

    const url = '/' + site + '/createList';
    const response = await fetch(url, options);
    const promise = await response.text();
    window.alert(promise);
}