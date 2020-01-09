let selector = document.getElementById("selector");
let passwordInput = document.getElementById("password");
let realPass;

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

function startLoading() {
    realPass = "CheckThis";
}