function lookForElement(doc, id, callback) {
    console.log("Looking for element with id: ", id, " in document: ", doc, "and URL: ", doc.URL);
    const observer = new MutationObserver((mutations, obs) => {
        const element = doc.getElementById(id);
        if (element) {
            obs.disconnect();
            callback(element);
            return;
        }
    });

    observer.observe(doc, {
        childList: true,
        subtree: true
    })
}

lookForElement(document, "gsft_main", async (gsft_main) => {
    // wait if the iframe title has not changed
    while (gsft_main.title == "Main Content") {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (gsft_main.title.indexOf("INC") < 0) {
        console.log("Found page: ", gsft_main.title);
        return;
    }
    gsft_main = document.getElementById("gsft_main");
    lookForElement(gsft_main.contentDocument || gsft_main.contentWindow.document, "element.incident.u_alternate_contact_number", (phoneElement) => {
        addCallBotton(phoneElement.lastChild, (gsft_main.contentDocument || gsft_main.contentWindow.document).getElementById("incident.u_alternate_contact_number").value);
    });
});

function addCallBotton(element, phoneNumber) {
    // if the number isn't US, don't add the button
    if (phoneNumber.indexOf('+1') < 0) return;

    // add the 9 for HDC phones
    phoneNumber = phoneNumber.replace('+1', '+19');
    console.log("Adding button for phone number: ", phoneNumber);

    // make the button and add it to the button box
    const span = document.createElement("span");
    span.innerHTML = `<button id="call.incident.u_alternate_contact_number" type="button" name="call.incident.u_alternate_contact_number" title="" aria-haspopup="true" style="display: ;" class="btn btn-default btn-ref icon icon-mobile" onclick="" tabindex="0" aria-label="Call listed number for field: Alternate contact number" data-original-title="Call listed number">&nbsp;</button>`;
    element.appendChild(span);

    // add the click event to call CM
    span.lastChild.addEventListener("click", () => {
        window.open(`tel:${phoneNumber}`);
    });
}