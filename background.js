const INVOKEURL = 'https://archive.today/?run=1&url='; // Invoke archive.today, equivalent to URLA
const act = true; // Open in new tab
const tabOption = 0; // Open in new tab

// const SEARCHURL = 'https://archive.today/search/?q=' // Search archive.today, equivalent to URLS

// Get the current tab
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Archive page URL
async function createArchivePage(uri, act) {
    console.log('createArchivePage action: ' + act + ' uri: ' + uri); // for DEBUG
    try{
        // const tab = await chrome.storage.sync.get({ tabOption: 0 });
        const tabOption = 0;
        // console.log('tabOption: ' + tab.tabOption); // for DEBUG
        console.log('tabOption: ' + tabOption);
        const currentTab = await getCurrentTab();

        if (!currentTab) {
            console.error('Cannot find current tab information');
            chrome.tabs.create({ url: INVOKEURL + encodeURIComponent(uri), active: act });
        return;
    }

    switch (tabOption) {
        case 1:
            chrome.tabs.create({
                url: INVOKEURL + encodeURIComponent(uri),
                index: 999, // CLAMPED TO END BY BROWSER
                openerTabId: currentTab.id,
                active: act
            });
            break;
        case 2:
            if (currentTab.id){
                chrome.tabs.update(currentTab.id, {
                    url: INVOKEURL + encodeURIComponent(uri)
                });
            }
            else{
                console.error("Update tab failed: tab ID not found.");
                chrome.tabs.create({ url: INVOKEURL + encodeURIComponent(uri),
                    active: act,
                    index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
                    openerTabId: currentTab.id
                 });
            }
            break;
        default:
            chrome.tabs.create({
                url: INVOKEURL + encodeURIComponent(uri),
                index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
                openerTabId: currentTab.id,
                active: act
            });
        };
    }
    catch (error) {
        console.error('Error in createArchivePage', error);
    }
}

// Search for a page in Archive.today to be implemented later

// Toolbar button click listener
chrome.action.onClicked.addListener(async (tab) => {
    console.log('Toolbar button clicked', tab ? tab.url : 'undefined'); // DEBUG
    if (tab && tab.url) {
        createArchivePage(tab.url, true);
    } else {
        console.warn('Button clicked, but current tab or URL is missing.');
    }
});