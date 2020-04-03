let badge = document.getElementById("badge");
let comment = document.getElementById("comment");
let selector = document.getElementById("selector");
let prompts = {};
let listNames = [];
let site;

async function loadLists() {
    site = window.location.href.split('site=')[1];

    let url = "/" + site + '/loadListsWithPrompt';
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(url, options);
    const lists = JSON.parse(await response.text());

    for (const [key, value] of Object.entries(lists)) {
        listNames[listNames.length] = key;
        console.log(key, value);
    }

    prompts = lists;
    listNames.sort();

    for (let i=0; i<listNames.length; i++) {
        let list = listNames[i];
        let newOption = document.createElement("option");
        newOption.setAttribute("value", "" + list);
        newOption.innerHTML = list;
        document.getElementById("selector").appendChild(newOption);
    }
    loadPlaceholder();
}

function clear() {
    badge.value = "";
    selector.selectedIndex = 0;
    comment.value = "";
}

async function submit() {
    let selectedList = selector.options[selector.selectedIndex].value;
    let commentValue = comment.value;
    let badgeValue = badge.value;

    const data = {
        badgeValue,
        commentValue
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        site: site,
        selectedList: selectedList
    };

    const url = '/' + site + '/' + selectedList + '/applied';
    const response = await fetch(url, options);
    const promise = await response.text();
    if (promise.includes("successful")) {
        clear()
    }
    window.alert(promise);
}

function loadPlaceholder() {
    let key = listNames[selector.selectedIndex];
    comment.placeholder = prompts[key];
}