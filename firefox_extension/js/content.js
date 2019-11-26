browser.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		switch (request.key) {
			case "articutLawsRequest":
				var jud = null;
				var judHistory = [];
				var result = [];
				if ($('#jud').length > 0) {
					jud = $('#jud')[0];
					for(var i=0; i<$('#JudHis .panel-body ul li').length;i++) {
						judHistory.push($('#JudHis .panel-body ul li')[i].innerHTML);
					}
				}
				if ($('#iframe-data').contents().find('body div #jud').length > 0) {
					jud = $('#iframe-data').contents().find('body div #jud')[0];
					for(var i=0; i<$('#iframe-data').contents().find('body div #JudHis .panel-body ul li').length;i++) {
						judHistory.push($('#iframe-data').contents().find('body div #JudHis .panel-body ul li')[i].innerHTML);
					}
				}
				if (jud != null) {
					for (var i = 0; i < jud.children.length; i++) {
						result.push(jud.children[i].innerText);
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