let selector = document.getElementById("selector");
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

async function download() {
    selectedList = selector.options[selector.selectedIndex].value;

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
        site: site,
        selectedList: selectedList
    };

    const getUrl = '/' + site + '/' + selectedList + '/download';
    const response = await fetch(getUrl, options);
    const promise = await response.blob();
    const url = window.URL.createObjectURL(promise);
    const anchor = document.createElement('a');
    anchor.href = url;
    const date = new Date();
    anchor.download = selectedList + " Applied " + date.toDateString() + '.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(url);

    window.alert("Starting download of site: " + site + " | list: " + selectedList);
}
