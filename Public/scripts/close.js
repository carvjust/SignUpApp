let selector = document.getElementById("selector");
let usernameElement = document.getElementById("username");
let site;
let selectedList;

let SLC1_Lists = ["IT", "Learning", "Safety"];
let SLC3_Lists = ["LP", "Non-Inventory", "Outbound"];
let DUT1_Lists = ["Night Shift", "Day Shift"];

let siteLists = {};
siteLists["SLC1"] = SLC1_Lists;
siteLists["SLC3"] = SLC3_Lists;
siteLists["DUT1"] = DUT1_Lists;

function load() {
    loadSite();
    loadLists();
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

function loadLists() {
    let lists = siteLists[site];
    for (let i=0; i<lists.length; i++) {
        let list = lists[i];
        let newOption = document.createElement("option");
        newOption.setAttribute("value", "" + list);
        newOption.innerHTML = list;
        document.getElementById("selector").appendChild(newOption);
    }
}

async function submit() {
    if (confirm("Are you sure you would like to close list: " + selector.options[selector.selectedIndex].value)) {

        let url = "/" + site + '/createOrClose';

        let data;
        let username = usernameElement.value;
        let shouldCreate = false;
        selectedList = selector.options[selector.selectedIndex].value;

        data = {
            username,
            selectedList,
            shouldCreate
        };

        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        };

        const response = await fetch(url, options);
        const promise = await response.text();
        window.alert(promise);
    }
}