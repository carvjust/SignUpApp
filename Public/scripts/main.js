let selector = document.getElementById("selector");

async function loadSites() {
    let url = "/sites";
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(url, options);
    const sites = JSON.parse(await response.text());

    for (let i=0; i<sites.length; i++) {
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