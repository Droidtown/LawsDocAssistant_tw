browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.key) {
            case "articutLawsResponse":
                var judInfo = request.judInfo;
                var judHistory = request.judHistory;
                var articutResult = request.articutResult;
                var articutLawsResult = request.articutLawsResult;
                browser.tabs.create({
                    url: browser.extension.getURL('../html/articutLaws.html')
                }, function (tab) {
                    var newTabID = tab.id;
                    browser.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
                        if (changeInfo.status == "complete" && tabID == newTabID) {
                            var tabs = browser.extension.getViews({
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