let selector = document.getElementById("selector");
let usernameElement = document.getElementById("username");
let site;
let listName;

async function loadLists() {
    site = window.location.href.split('site=')[1];
    let url = "/" + site + '/getOpenListNames';
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(url, options);
    const lists = JSON.parse(await response.text());

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
        listName = selector.options[selector.selectedIndex].value;

        data = {
            username,
            listName,
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