let badge = document.getElementById("badge");
let comment = document.getElementById("comment");
let selector = document.getElementById("selector");
let placeholder = "Why do you want to be a part of our team?";
let site;

let SLC1_Lists = ["IT", "Learning", "Safety"];
let SLC3_Lists = ["LP", "Non-Inventory", "Outbound"];
let DUT1_Lists = ["Night Shift", "Day Shift"];

var siteLists = {};
siteLists["SLC1"] = SLC1_Lists;
siteLists["SLC3"] = SLC3_Lists;
siteLists["DUT1"] = DUT1_Lists;

function load() {
    loadSite();
    loadLists();
    loadPlaceholder();
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

function clear() {
    badge.value = "";
    selector.selectedIndex = 0;
    comment.value = "";
}

function loadLists() {
    var lists = siteLists[site];
    for (var i=0; i<lists.length; i++) {
        let list = lists[i];
        let newOption = document.createElement("option");
        newOption.setAttribute("value", "" + list);
        newOption.innerHTML = list;
        document.getElementById("selector").appendChild(newOption);
    }
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
    comment.placeholder = placeholder;
}