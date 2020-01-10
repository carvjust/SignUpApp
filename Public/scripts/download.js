let selector = document.getElementById("selector");
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
}

function loadSite() {
    site = window.location.href.split('site=')[1];
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

function download() {
    window.alert("Starting download of site: " + site + " | list: " + selector.options[selector.selectedIndex].value);
}