var in_iframe = false;

console.log("Starting SSAssistant script for ServiceNow");

function lookForElements(doc, ids, callback) {
    console.log("Looking for elements with ids: ", ids, " in document: ", doc);
    const observer = new MutationObserver((mutations, obs) => {
        ids.forEach((id) => {
            const element = doc.getElementById(id);
            if (element) {
                console.log("Found element with id: ", id);
                obs.disconnect();
                callback(id, element);
                return
            }
        });
    });

    observer.observe(doc, {
        childList: true,
        subtree: true
    })
}

function addCallButton(doc) {
    const phoneElement = doc.getElementById("element.incident.u_alternate_contact_number");
    if (!phoneElement) {
        console.log("No phone element found");
        return;
    }

    let phoneNumber = doc.getElementById("incident.u_alternate_contact_number").value;
    if (!phoneNumber) {
        console.log("No phone number found");
        return;
    }


    // if the number isn't US, don't add the button
    if (phoneNumber.indexOf('+1') < 0) return;

    // add the 9 for HDC phones
    phoneNumber = phoneNumber.replace('+1', '9');
    console.log("Adding button for phone number: ", phoneNumber);

    // make the button and add it to the button box
    const span = document.createElement("span");
    span.innerHTML = `<button id="call.incident.u_alternate_contact_number" type="button" name="call.incident.u_alternate_contact_number" title="" aria-haspopup="true" style="display: ;" class="btn btn-default btn-ref icon icon-mobile" onclick="" tabindex="0" aria-label="Call listed number for field: Alternate contact number" data-original-title="Call listed number">&nbsp;</button>`;
    phoneElement.lastChild.appendChild(span);

    // add the click event to call CM
    span.lastChild.addEventListener("click", () => {
        window.location.href = `tel:${phoneNumber}`;
    });
}


// run scripts on the document based on the current title
function runScripts(doc) {
    console.log("Running scripts on title: ", document.title);

    if (document.title.indexOf("INC") >= 0) {
        // we are on an INC page, try to add the call button
        addCallButton(doc);
    }
    // add future scripts here to run whenever the page title changes
}

// run scripts whenever the page title changes
async function monitorDocument() {
    runScripts(in_iframe ? document.getElementById("gsft_main").contentDocument : document);

    const observer = new MutationObserver((mutations, obs) => {
        runScripts(in_iframe ? document.getElementById("gsft_main").contentDocument : document);
    });

    observer.observe(document.querySelector('title'), {
        subtree: true,
        characterData: true,
        childList: true
    });
}

// locate the main document to watch for changes
lookForElements(document, ["gsft_main", "output_messages"], (id, element) => {
    // if we found gsft_main, then we need to watch the iframe
    if (id == "gsft_main") {
        console.log("Found gsft_main, monitoring for changes");
        in_iframe = true;
    }
    // if not, we need to monitor the main document since we found an output_messages element which is always inside the document we want to monitor
    else {
        console.log("Found output_messages, monitoring main document");
        in_iframe = false;
    }
    monitorDocument();
});