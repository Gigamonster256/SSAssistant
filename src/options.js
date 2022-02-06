config_items = ['before_minutes','remove_rows','ignore_filter','send_empty_notifications'];
console.log('Getting config items:', config_items)

chrome.storage.local.get(config_items, (configuration) => {
    fillPage(configuration);
    console.log("Loaded configuration:", configuration);
});

document.getElementById("save_config").addEventListener("click", () => {
    configuration = {};
    configuration.before_minutes = document.getElementById("before_minutes").selectedIndex;
    configuration.remove_rows = document.getElementById("remove_rows").checked;
    configuration.ignore_filter = document.getElementById("ignore_filter").checked;
    configuration.send_empty_notifications = document.getElementById("send_empty_notifications").checked;
    chrome.storage.local.set(configuration);
    console.log("Saved configuration:", configuration);
});

async function fillPage(configuration) {
    var select_element = document.getElementById("before_minutes");
    for (var min = 0; min <= 7; min++) {
        select_element.add(new Option(min));
    }
    select_element.selectedIndex = configuration.before_minutes;

    document.getElementById("remove_rows").checked = configuration.remove_rows;
    document.getElementById("ignore_filter").checked = configuration.ignore_filter;
    document.getElementById("send_empty_notifications").checked = configuration.send_empty_notifications;
}

