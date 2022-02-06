let is_auto;
let extension_enable = document.getElementById("extension_enable");
let run_once = document.getElementById("run_once");

// set the background color based on the state of the extension
function updateBackground(state) {
    document.body.style.backgroundColor = state ? "green" : "red";
};

// when we open the popup, we want to check the state of the extension and save it locally
chrome.storage.local.get(['is_auto'], (results) => {
    is_auto = results.is_auto;
    updateBackground(is_auto);
    extension_enable.innerHTML = is_auto ? "Disable" : "Enable";
    run_once.style.display = is_auto ? 'none' : 'inline-block';
});

// when we click the extension enable button, we want to toggle the state of the extension
extension_enable.addEventListener("click", () => {
    
    // toggle the state of the extension and save it to chrome storage
    is_auto = !is_auto;
    chrome.storage.local.set({ is_auto: is_auto })
    // change the background color and the text of the button
    updateBackground(is_auto);
    extension_enable.innerHTML = is_auto ? "Disable" : "Enable";
    
    // enable/disable run once button
    run_once.style.display = is_auto ? 'none' : 'inline-block';
    run_once_active = false;

    //TODO run the extension if we're on the SS page
});

let run_once_active = false;

// when we click the run once button, we want to run the extension once
run_once.addEventListener("click", () => {
    // if we already ran the extension once since we opened the popup, we don't want to run it again
    if (run_once_active) return;
    
    // set the background green
    updateBackground(true);
    run_once_active = true;

    //TODO run the extension once
});