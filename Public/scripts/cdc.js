let selector = document.getElementById("selector");
let passwordInput = document.getElementById("password");
let realPass;

async function loadSites() {

    loadPass();

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


function checkPass() {
    let password = passwordInput.value;
    return password === realPass;
}

function transition(cdc) {
    if (checkPass()) {
        passwordInput.value = "";
        window.location.href = cdc + ".html?site=" + selector.options[selector.selectedIndex].value;
    } else {
        window.alert("Incorrect password. Please check you have the most up to date password and try again.");
    }
}

function loadPass() {
    // TODO: change this to grab the real password from site creation
    realPass = "CheckThis";
}