const INVOKEURL = 'https://archive.today/?run=1&url='; // Put in archive.today
const act = true; // Open in new tab
const tabOption = 0; // Open in new tab
const SEARCHURL = 'https://archive.today/search/?q=' // Search in archive.today

// Get the current tab
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Check if the current url is Medium or Towards Data Science; if yes redirect it to freemedium.cfd; else fall to archive.today
async function freediumRedirect(tab) {
    const url = tab.url || "";
    if (url.includes("medium.com")) {
      const newUrl = "https://freedium.cfd/" + url;
      await chrome.tabs.update(tab.id, { url: newUrl });
      return true;
    }
    return false;
  }



// Archive page URL
async function createArchivePage(uri, act) {
    console.log('create Archive triggered: ' + act + ' uri: ' + uri);
    try{
        const tabOption = 0;
        console.log('tabOption: ' + tabOption);
        const currentTab = await getCurrentTab();

        if (!currentTab) {
            console.error('Cannot find current tab information');
            chrome.tabs.create({ url: INVOKEURL + encodeURIComponent(uri), active: act });
        return;
    }

    // Since the tabOption is hardcoded to 0, create a new tab and set it to active
    chrome.tabs.create({
        url: INVOKEURL + encodeURIComponent(uri),
        index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
        openerTabId: currentTab.id,
        active: act
    });

    // the below switch statement code is for future use, where a user can dictate the tabOption
    // switch (tabOption) {
    //     case 1:
    //         chrome.tabs.create({
    //             url: INVOKEURL + encodeURIComponent(uri),
    //             index: 999, // CLAMPED TO END BY BROWSER
    //             openerTabId: currentTab.id,
    //             active: act
    //         });
    //         break;
    //     case 2:
    //         if (currentTab.id){
    //             chrome.tabs.update(currentTab.id, {
    //                 url: INVOKEURL + encodeURIComponent(uri)
    //             });
    //         }
    //         else{
    //             console.error("Update tab failed: tab ID not found.");
    //             chrome.tabs.create({ url: INVOKEURL + encodeURIComponent(uri),
    //                 active: act,
    //                 index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
    //                 openerTabId: currentTab.id
    //              });
    //         }
    //         break;
    //     default:
    //         chrome.tabs.create({
    //             url: INVOKEURL + encodeURIComponent(uri),
    //             index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
    //             openerTabId: currentTab.id,
    //             active: act
    //         });
    //     };
    }
    catch (error) {
        console.error('Error in createArchivePage', error);
    }
}

// Search for a page in Archive.today to be implemented later
async function searchArchivePage(uri, act) {
    console.log('searchArchivePage action: ' + act + ' uri: ' + uri); // for DEBUG
    try{
        const tabOption = 0;
        // console.log('tabOption: ' + tab.tabOption); // for DEBUG
        console.log('tabOption: ' + tabOption);
        const currentTab = await getCurrentTab();

        if (!currentTab) {
            console.error('Cannot find current tab information');
            chrome.tabs.create({ url: SEARCHURL + encodeURIComponent(uri), active: act });
        return;
    }

    // Since the tabOption is hardcoded to 0, create a new tab and set it to active
    chrome.tabs.create({
        url: SEARCHURL + encodeURIComponent(uri),
        index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
        openerTabId: currentTab.id,
        active: act
    });

    // the below switch statement code is for future use, where a user can dictate the tabOption
    // switch (tabOption) {
    //     case 1:
    //         chrome.tabs.create({
    //             url: SEARCHURL + encodeURIComponent(uri),
    //             index: 999, // CLAMPED TO END BY BROWSER
    //             openerTabId: currentTab.id,
    //             active: act
    //         });
    //         break;
    //     case 2:
    //         if (currentTab.id){
    //             chrome.tabs.update(currentTab.id, {
    //                 url: SEARCHURL + encodeURIComponent(uri)
    //             });
    //         }
    //         else{
    //             console.error("Update tab failed: tab ID not found.");
    //             chrome.tabs.create({ url: SEARCHURL + encodeURIComponent(uri),
    //                 active: act,
    //                 index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
    //                 openerTabId: currentTab.id
    //              });
    //         }
    //         break;
    //     default:
    //         chrome.tabs.create({
    //             url: SEARCHURL + encodeURIComponent(uri),
    //             index: currentTab.index !== undefined ? currentTab.index + 1 : undefined,
    //             openerTabId: currentTab.id,
    //             active: act
    //         });
    //     };
    }
    catch (error) {
        console.error('Error in searchArchivePage', error);
    }
}

// Toolbar button click listener
chrome.action.onClicked.addListener(async (tab) => {
    console.log('Toolbar button clicked', tab ? tab.url : 'undefined'); // DEBUG
    const redirected = await freediumRedirect(tab);
    if (!redirected){
        if (tab && tab.url) {
            createArchivePage(tab.url, true);
        } else {
            console.warn('Button clicked, but current tab or URL is missing.');
        }
    }else{
        console.log('Freedium redirect triggered');
    }
});

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "archive-today",
      title: "Archive",
      contexts: ["link"]
    });
    chrome.contextMenus.create({
      id: "archive-create",
      parentId: "archive-today",
      title: "Create Archive",
      contexts: ["link"]
    });
    chrome.contextMenus.create({
      id: "archive-search",
      parentId: "archive-today",
      title: "Search Archive",
      contexts: ["link"]
    });
  });

// handle context clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    try {
        if (!info.linkUrl) return;
    
        switch (info.menuItemId) {
        case "archive-create":
            createArchivePage(info.linkUrl, true);
            break;
        case "archive-search":
            searchArchivePage(info.linkUrl, true);
            break;
        }
    } catch (error) {
        console.error('Error in context menu click handler', error);
    }
  });