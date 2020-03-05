let selector = document.getElementById("selector");
let site;
let selectedList;


async function loadLists() {
    site = window.location.href.split('site=')[1];
    let url = "/" + site + '/getAllListNames';
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
