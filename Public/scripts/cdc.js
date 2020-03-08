let selector = document.getElementById("selector");
let passwordInput = document.getElementById("password");


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


async function checkPass(selectedSite) {
    let password = passwordInput.value;
    let data = {
        password
    };

    let url = "/" + selectedSite + "/checkPassword";
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    const correct = await response.text();

    return(correct === "true");
}

async function transition(cdc) {
    let selectedSite = selector.options[selector.selectedIndex].value;
    if (await checkPass(selectedSite)) {
        passwordInput.value = "";
        window.location.href = cdc + ".html?site=" + selector.options[selector.selectedIndex].value;
    } else {
        window.alert("Incorrect password. Please check you have the most up to date password and try again.");
    }
}