let usernameElement = document.getElementById("username");
let listNameElement = document.getElementById("listname");
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

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        site: site,
        username: username,
        listName: listName,
        prompt: prompt
    };

    const url = '/' + site + '/' + listName + '/createList';
    const response = await fetch(url, options);
    const promise = await response.text();
    window.alert(promise);
}