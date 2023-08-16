// Delete Cloudflare DNS Records By SyntaxSurge / Jade
if (window.location.href.includes('https://dash.cloudflare.com/')) {

    // These XPath queries are used to target specific elements in the Cloudflare DNS page.
    // Modify these if Cloudflare's structure changes in the future.
    let tableXPath = "//*[@id='react-app']/div/div/div/div[1]/div/div/main/div/div/div[2]/div[2]/div[2]/div[2]/table";
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
     *
     * Parameters:
     *     editXPath (string): XPath query for the 'Edit' button.
     *     deleteXPath (string): XPath query for the 'Delete' button.
     *     confirmXPath (string): XPath query for the confirmation of deletion.
     *
     * Returns:
     *     None
     */
    function deleteDNSRecords(editXPath, deleteXPath, confirmXPath) {
        let del_interval = setInterval(() => {
            let editSelector = document.evaluate(editXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (editSelector.singleNodeValue) {
                editSelector.singleNodeValue.click();
                let deleteSelector = document.evaluate(deleteXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                deleteSelector.singleNodeValue.click();
                let confirmSelector = document.evaluate(confirmXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                confirmSelector.singleNodeValue.click();
            } else {
                console.log('Stopped because of no more records');
                alert('Stopped because of no more records');
                clearInterval(del_interval);
            }
        }, 1000);
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
    button.addEventListener('click', () => deleteDNSRecords(edit_xp, delete_xp, delete_confirm_xp));
    addButtonIfNotExists(button, tableXPath);
  
}
