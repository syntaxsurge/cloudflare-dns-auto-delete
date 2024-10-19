// Delete Cloudflare DNS Records By SyntaxSurge / Jade
if (window.location.href.includes('https://dash.cloudflare.com/')) {

    // These XPath queries are used to target specific elements in the Cloudflare DNS page.
    // Modify these if Cloudflare's structure changes in the future.
    let tableXPath = "(//*[@id='react-app']/div//main//table)[1]";
    let edit_xp = "//tr//td//button//span[contains(text(),'Edit')]";
    let delete_xp = "//tr//td//form//div//button[contains(text(),'Delete')]";
    let delete_confirm_xp = "//div//div//div//button//span[contains(text(),'Delete')]";

    /**
     * Create and style the "Delete All DNS Records" button.
     *
     * Returns:
     *     HTMLElement: A button styled for deletion actions.
     */
    function createDeleteButton() {
        let button = document.createElement("button");
        button.innerHTML = "Delete All DNS Records";
        button.style.background = "linear-gradient(90deg, #343a40, #495057)"; // Gradient Background
        button.style.color = "#ffffff";
        button.style.border = "none";
        button.style.borderRadius = "8px";
        button.style.padding = "10px 20px";
        button.style.marginBottom = "15px";
        button.style.cursor = "pointer";
        button.style.fontSize = "16px";
        button.style.fontFamily = "'Arial', sans-serif";
        button.style.fontWeight = "600";
        button.style.letterSpacing = "0.7px";
        button.style.transition = "all 0.3s ease"; // Smoother transition for all properties
        button.style.boxShadow = "0px 10px 20px rgba(0,0,0,0.1)";

        // Event listeners for button hover, click, etc.
        button.onmouseover = () => {
            button.style.background = "linear-gradient(90deg, #495057, #343a40)";
            button.style.boxShadow = "0px 8px 16px rgba(0,0,0,0.15)";
        };
        button.onmouseout = () => {
            button.style.background = "linear-gradient(90deg, #343a40, #495057)";
            button.style.boxShadow = "0px 10px 20px rgba(0,0,0,0.1)";
        };
        button.onmousedown = () => button.style.transform = "translateY(2px)";
        button.onmouseup = () => button.style.transform = "translateY(0)";

        return button;
    }

    /**
     * Sequentially delete DNS records.
     * This function identifies and clicks the 'Edit', 'Delete', and 'Delete Confirm' buttons in a loop until all records are deleted.
     * Some records, such as Metaplex or IPFS settings, cannot be deleted through this interface 
     * because the 'Delete' button is not present. These records can only be edited or deleted by navigating to the 
     * Web3 dashboard in Cloudflare's settings. When such records are encountered, they are skipped, and the script 
     * continues with the next record.
     *
     * Parameters:
     *     editXPath (string): XPath query for the 'Edit' button.
     *     deleteXPath (string): XPath query for the 'Delete' button.
     *     confirmXPath (string): XPath query for the confirmation of deletion.
     *
     * Returns:
     *     None
     */
    function deleteDnsRecords(editXPath, deleteXPath, confirmXPath) {
        // Collect all 'Edit' buttons into a snapshot
        let editButtonsSnapshot = document.evaluate(editXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let totalRecords = editButtonsSnapshot.snapshotLength;
        let currentIndex = 0;

        function processNextRecord() {
            if (currentIndex >= totalRecords) {
                console.log('All records processed.');
                alert('All records processed.');
                return;
            }

            let editButton = editButtonsSnapshot.snapshotItem(currentIndex);
            currentIndex++;

            if (editButton) {
                editButton.click();

                setTimeout(() => {
                    let deleteButton = document.evaluate(deleteXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (deleteButton) {
                        deleteButton.click();

                        setTimeout(() => {
                            let confirmButton = document.evaluate(confirmXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            if (confirmButton) {
                                confirmButton.click();

                                // Wait for the deletion to complete before moving to the next record
                                setTimeout(processNextRecord, 1000);
                            } else {
                                console.log("Confirm Delete button not found, skipping to next record.");
                                processNextRecord();
                            }
                        }, 500);
                    } else {
                        console.log("Delete button not found, skipping to next record.");
                        processNextRecord();
                    }
                }, 500);
            } else {
                console.log("Edit button not found, skipping to next record.");
                processNextRecord();
            }
        }

        processNextRecord();
    }

    /**
     * Add the delete button above the DNS table.
     * The function will keep checking for the table's existence every 500ms and add the button once it finds the table.
     *
     * Parameters:
     *     btn (HTMLElement): The button element to add.
     *     tableXPathQuery (string): XPath query for locating the DNS table.
     *
     * Returns:
     *     None
     */
    function addButtonIfNotExists(btn, tableXPathQuery) {
        let intervalId = setInterval(() => {
            let table = document.evaluate(tableXPathQuery, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (table) {
                if (table.previousSibling !== btn) {
                    table.parentElement.insertBefore(btn, table);
                    console.log("Button added successfully!");
                }
                clearInterval(intervalId);
            } else {
                console.log("Table not found yet...");
            }
        }, 500);
    }

    let button = createDeleteButton();
    button.addEventListener('click', () => deleteDnsRecords(edit_xp, delete_xp, delete_confirm_xp));
    addButtonIfNotExists(button, tableXPath);

}
