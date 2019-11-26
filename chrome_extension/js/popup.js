var SERVER = "https://api.droidtown.co/"
var username = "";
var api_key = "";

$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $(document).on('click', '#articutAuth', function (e) {
        username = $('#articutUsername').val();
        api_key = $('#articutApiKey').val();

        if (username == "" || api_key == "") {
            return;
        }

        $.post({
            url: SERVER + "Articut/Balance/",
            data: {
                "username": username,
                "api_key": api_key
            },
            success: function (resp) {
                if (resp.status) {
                    chrome.storage.local.set({
                        username: username,
                        api_key: api_key
                    }, null);
                    $('#articutLoginMsg').text("");
                    $('#articutMemberUsername').text("Hi, " + username);
                    $('#articutAuth').hide();
                    $('#articutMember').show();
                    if (resp.balance > 0) {
                        setBalance(true, resp.balance);
                    } else {
                        getPublicBalance();
                    }
                } else {
                    $('#articutLoginMsg').text(resp.msg);
                }
            }
        });
    });

    $(document).on('click', '#articutLogout', function (e) {
        username = "";
        api_key = "";
        chrome.storage.local.remove(['username', 'api_key'], null);
        $('#articutMember').hide();
        $('#articutUsername').val("");
        $('#articutApiKey').val("");
        $('#articutAuth').show();
    });

    $(document).on('click', '#articutLaws', function (e) {
        $('#articutLaws').attr("disabled", true);
        $('#articutLaws').html('<i class="fa fa-spinner fa-pulse"></i> 解析中 ...');
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                key: "articutLawsRequest"
            }, function (response) {
                var result = response.result;
                var judHistory = response.judHistory;
                if (result.length == 4) {
                    var articutResult;
                    var judInfo = [];
                    for (var i = 0; i < result.length; i++) {
                        if (i == 3) {
                            judInfo.push(result[i].substring(0, result[i].search(/主\s*文/g)).replace(/\n/g, "<br/>"));
                        } else {
                            judInfo.push(result[i].replace("\n", ""));
                        }
                    }                    
                    var judText = result[3].replace(/\s/g, "")
                    judText = judText.substring(judText.indexOf("主文"), judText.indexOf("書記官")).replace("主文", "主文。").replace("理由", "理由。").replace("犯罪事實", "犯罪事實。");
                    if (judText != "") {
                        $.post({
                            url: SERVER + "Articut/Source/",
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            data: JSON.stringify({
                                "username": username,
                                "api_key": api_key,
                                "input_str": judText,
                                "version": 'latest',
                                "level": 'lv2',
                                "source": 'ChExt',
                                "note": 'Articut 法學資料檢索助理'
                            }),
                            success: function (resp) {
                                if (resp.status) {
                                    articutResult = resp;
                                    $.post({
                                        url: SERVER + "Articut/Toolkit/Laws/",
                                        dataType: "json",
                                        contentType: 'application/json; charset=UTF-8',
                                        data: JSON.stringify({
                                            "username": username,
                                            "api_key": api_key,
                                            "func": ["get_all"],
                                            "result_pos": articutResult.result_pos
                                        }),
                                        success: function (resp) {
                                            if (resp.status) {
                                                var articutLawsResult = resp.results;
                                                chrome.runtime.sendMessage({
                                                    key: "articutLawsResponse",
                                                    judInfo: judInfo,
                                                    judHistory: judHistory,
                                                    articutResult: articutResult.result_obj,
                                                    articutLawsResult: articutLawsResult
                                                }, null);
                                            } else {
                                                $('#articutLaws').attr("disabled", false);
                                                $('#articutLaws').html('<i class="fa fa-hand-o-right"></i> 解析本頁法律文件');
                                                $('#articutMsg').text(resp.msg);
                                            }
                                        }
                                    });
                                } else {
                                    $('#articutLaws').attr("disabled", false);
                                    $('#articutLaws').html('<i class="fa fa-hand-o-right"></i> 解析本頁法律文件');
                                    $('#articutMsg').text(resp.msg);
                                }
                            }
                        });
                    } else {
                        $('#articutLaws').attr("disabled", false);
                        $('#articutLaws').html('<i class="fa fa-hand-o-right"></i> 解析本頁法律文件');
                        $('#articutMsg').text("出了點小狀況，重新整理後再試一次！");
                    }
                } else {
                    $('#articutLaws').attr("disabled", false);
                    $('#articutLaws').html('<i class="fa fa-hand-o-right"></i> 解析本頁法律文件');
                    $('#articutMsg').text("出了點小狀況，重新整理後再試一次！");
                }
            });
        });
    });

    chrome.storage.local.get(['username', 'api_key'], function (obj) {
        if (typeof (obj.username) != "undefined") {
            username = obj.username;
            api_key = obj.api_key;
            $('#articutMemberUsername').text("Hi, " + username);
            $('#articutAuth').hide();
            $('#articutMember').show();
        } else {
            $('#articutMember').hide();
            $('#articutAuth').show();
        }
        getBalance();
    });
});

function getBalance() {
    $.post({
        url: SERVER + "Articut/Balance/",
        data: {
            "username": username,
            "api_key": api_key
        },
        success: function (resp) {
            if (resp.status) {
                if (resp.balance > 0) {
                    setBalance(true, resp.balance);
                    return;
                }
            }
            getPublicBalance();
        }
    });
}

function getPublicBalance() {
    $.post({
        url: SERVER + "Articut/Balance/",
        data: {
            "username": "",
            "api_key": ""
        },
        success: function (resp) {
            if (resp.status) {
                setBalance(false, resp.balance);
                return;
            }
            setBalance(false, 0);
        }
    });
}

function setBalance(status, balance) {
    if (status) {
        $('#articutBalance').html("<span class='text-primary'>您的額度</span>剩餘 " + balance + " 字。");
        $('#articutPurchase').hide();
        $('#articutLaws').show();
    } else {
        $('#articutBalance').html("<span class='text-danger'>公用測試額度</span>剩餘 " + balance + " 字。");
        if (balance == 0) {
            $('#articutLaws').hide();
            $('#articutPurchase').show();
        } else {
            $('#articutPurchase').hide();
            $('#articutLaws').show();
        }
    }
}