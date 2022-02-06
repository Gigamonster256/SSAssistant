//Fired when the extension is first installed, 
//when the extension is updated to a new version, 
//and when Chrome is updated to a new version.
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        // SSAssistant was just installed
        console.log("SSAssistant was just installed!");

        // Disable the extension by default
        chrome.storage.local.set({ is_auto: false })
    } else if (details.reason == "update") {
        // SSAssistant was updated to a new version or reloaded
        console.log("SSAssistant was just updated or reloaded!");

        // Disable the extension on extension reload
        // TODO remove this after the extension is fully functional
        chrome.storage.local.set({ is_auto: false })
    } else if (details.reason == "chrome_update") {
        // Chrome was updated
        console.log("Chrome was updated");
    } else if (details.reason == "shared_module_update") {
        // There was an update to a shared module
        console.log("there was an update to a shared module");
    }
});

