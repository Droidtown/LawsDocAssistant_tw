chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		switch (request.key) {
			case "articutLawsRequest":
				var judHistory = [];
				var result = [];
				
				if ($('#iframe-data').length > 0) {
					for(var i=0; i<$('#iframe-data').contents().find('#JudHis .panel-body ul li').length;i++) {
						judHistory.push($('#iframe-data').contents().find('#JudHis .panel-body ul li')[i].innerHTML);
					}
					for (var i=0; i<$('#iframe-data').contents().find('#jud .row').length; i++) {
						result.push($('#iframe-data').contents().find('#jud .row')[i].innerText);
					}
				} else {
					for(var i=0; i<$('#JudHis .panel-body ul li').length;i++) {
						judHistory.push($('#JudHis .panel-body ul li')[i].innerHTML);
					}
					for (var i=0; i<$('#jud .row').length; i++) {
						result.push($('#jud .row')[i].innerText);
					}
				}

				sendResponse({
					result: result,
					judHistory: judHistory
				});
				break;
		}

	}
);