let username = document.getElementById("username");
let listname = document.getElementById("listname");
let site;

function load() {
    loadSite();
}

function loadSite() {
    site = window.location.href.split('site=')[1];
}

function createList() {
    window.alert("Starting creation of list: " + listname.value + " | to site: " + site + " | user: " + username.value.toLowerCase());
}