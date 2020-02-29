let badge = document.getElementById("badge");
let comment = document.getElementById("comment");
let selector = document.getElementById("selector");
let placeholder = "Why do you want to be a part of this group?";
let site;

async function loadLists() {
    site = window.location.href.split('site=')[1];

    // TODO: change this function to actually do something
    loadPlaceholder();

    let url = "/" + site + '/getOpenListNames';
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(url, options);
    const lists = JSON.parse(await response.text());

    for (let i=0; i<lists.length; i++) {
        let list = lists[i];
        let newOption = document.createElement("option");
        newOption.setAttribute("value", "" + list);
        newOption.innerHTML = list;
        document.getElementById("selector").appendChild(newOption);
    }
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
    // TODO: change this to grab from API and update placeholder with prompt
    comment.placeholder = placeholder;
}