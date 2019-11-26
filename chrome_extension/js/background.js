// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([{
            // That fires when a page's URL contains a 'g' ...
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlMatches: 'https://law.judicial.gov.tw/FJUD/.+'
                    },
                })
            ],
            // And shows the extension's page action.
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.key) {
            case "articutLawsResponse":
                var judInfo = request.judInfo;
                var judHistory = request.judHistory;
                var articutResult = request.articutResult;
                var articutLawsResult = request.articutLawsResult;
                chrome.tabs.create({
                    url: chrome.extension.getURL('../html/articutLaws.html')
                }, function (tab) {
                    var newTabID = tab.id;
                    chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
                        if (changeInfo.status == "complete" && tabID == newTabID) {
                            var tabs = chrome.extension.getViews({
                                type: "tab",
                                tabId: newTabID
                            });
                            tabs[0].init(articutResult, articutLawsResult, judHistory, judInfo);
                        }
                    });
                });
                break;
        }
    }
);