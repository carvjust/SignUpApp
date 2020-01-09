let selector = document.getElementById("selector");
var sites = ["SLC1", "SLC3", "DUT1"];

function loadSites() {
    var i;
    for (i=0; i<sites.length; i++) {
        let site = sites[i];
        let newOption = document.createElement("option");
        newOption.setAttribute("value", "" + site);
        newOption.innerHTML = site;
        document.getElementById("selector").appendChild(newOption);
    }
}

function goToApply() {
    window.location.href = "apply.html?site=" + selector.options[selector.selectedIndex].value;
}