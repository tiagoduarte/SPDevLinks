chrome.action.onClicked.addListener((tab) => {

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['scripts/jquery.min.js','scripts/content.js']
      });

    //chrome.tabs.create({'url':'copy.html'});
    
  });