var law_article_list = [];
var crime_list = [];
var criminal_responsibility_list = [];
var event_ref_list = [];
var law_article_title = "法條索引";
var crime_title = "罪名";
var criminal_responsibility_title = "刑責";
var event_ref_title = "事件參照";

$(document).ready(function () {
    $('#articutLawArticle').change(function () {
        for (var i = 0; i < $('.articutLawArticle').length; i++) {
            if (this.checked) {
                $($('.articutLawArticle')[i]).html('<span class="badge badge-success">' + $($('.articutLawArticle')[i]).text() + '</span>');
            } else {
                $($('.articutLawArticle')[i]).text($($('.articutLawArticle')[i]).text());
            }
        }
        if (this.checked) {
            $('#articutLawArticleAlert').show();
        } else {
            $('#articutLawArticleAlert').hide();
        }
    });

    $('#articutCrime').change(function () {
        for (var i = 0; i < crime_list.length; i++) {
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp(crime_list[i], "g"), '<span class="badge badge-danger">' + crime_list[i] + '</span>'));
                } else {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp('<span class="badge badge-danger">' + crime_list[i] + '</span>', "g"), crime_list[i]));
                }
            }
        }
        if (this.checked) {
            $('#articutCrimeAlert').show();
        } else {
            $('#articutCrimeAlert').hide();
        }
    });

    $('#articutCriminalResponsibility').change(function () {
        for (var i = 0; i < criminal_responsibility_list.length; i++) {
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp(criminal_responsibility_list[i], "g"), '<span class="badge badge-warning">' + criminal_responsibility_list[i] + '</span>'));
                } else {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp('<span class="badge badge-warning">' + criminal_responsibility_list[i] + '</span>', "g"), criminal_responsibility_list[i]));
                }
            }
        }
        if (this.checked) {
            $('#articutCriminalResponsibilityAlert').show();
        } else {
            $('#articutCriminalResponsibilityAlert').hide();
        }
    });

    $('#articutEventRef').change(function () {
        for (var i = 0; i < event_ref_list.length; i++) {
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp(event_ref_list[i], "g"), '<span class="badge badge-primary">' + event_ref_list[i] + '</span>'));
                } else {
                    $($('body .card-body')[j]).html($($('body .card-body')[j]).html().replace(new RegExp('<span class="badge badge-primary">' + event_ref_list[i] + '</span>', "g"), event_ref_list[i]));
                }
            }
        }
        if (this.checked) {
            $('#articutEventRefAlert').show();
        } else {
            $('#articutEventRefAlert').hide();
        }
    });
});

function init(result, lawsResult, judHistory, judInfo) {
    law_article_list = lawsResult.law_article_list;
    crime_list = lawsResult.crime_list;
    criminal_responsibility_list = lawsResult.criminal_responsibility_list;
    event_ref_list = lawsResult.event_ref_list;

    // init content
    content = '<div class="card mb-4"><div class="card-header"><span class="articutTitle">資訊</span></div><div class="card-body">';
    for (var i = 0; i < judInfo.length; i++) {
        content += '<p>' + judInfo[i] + '</p>';
    }
    content += '</div></div>';

    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i].length; j++) {
            var pos = result[i][j].pos;
            var text = result[i][j].text;
            if (pos == "KNOWLEDGE_lawTW") {
                var classname = "";
                if (law_article_list.includes(text)) {
                    classname = "articutLawArticle";
                }
                if (event_ref_list.includes(text)) {
                    classname = "articutEventRef";
                }
                if (classname == "") {
                    content += text;
                } else {
                    content += "<span class='" + classname + "'>" + text + "</span>";
                }
            } else {
                if (["主文", "理由", "犯罪"].includes(text)) {
                    if (text == "犯罪") {
                        if (result[i].length == 2) {
                            if (result[i][j + 1].text == "事實") {
                                if ((i + 1) < result.length) {
                                    if (result[i + 1][0].text == "。") {
                                        content += '</div></div><div class="card mb-4"><div class="card-header"><span class="articutTitle">' + text + result[i][j + 1].text + '</span></div><div class="card-body">';
                                        i += 1;
                                        continue;
                                    }
                                }
                            }
                        }
                    } else {
                        if (result[i].length == 1 && result[i + 1][0].text == "。") {
                            if (text == "理由") {
                                content += '</div></div>';
                            }
                            content += '<div class="card mb-4"><div class="card-header"><span class="articutTitle">' + text + '</span></div><div class="card-body">';
                            i += 1;
                            continue;
                        }
                    }
                }
                content += text;
                if (["。", "："].includes(text)) {
                    content += "<br/>";
                }
            }
        }
    }
    content += '</div></div>';
    $('#articutLawsResult').html(content);

    // init info block
    $($('#articutHistoryAlert ul')[0]).empty()
    for (var i = 0; i < judHistory.length; i++) {
        $('#articutHistoryAlert ul').append('<li>' + judHistory[i].replace('<a href="data.aspx', '<a href="https://law.judicial.gov.tw/FJUD/data.aspx').replace('<img title="標示黑色" src="../Images/icon_a.png">', '') + '</li>');
    }
    setAlert("articutLawArticleAlert", law_article_title, "law_article", law_article_list);
    setAlert("articutCrimeAlert", crime_title, "crime", crime_list);
    setAlert("articutCriminalResponsibilityAlert", criminal_responsibility_title, "criminal_responsibility", criminal_responsibility_list);
    setAlert("articutEventRefAlert", event_ref_title, "event_ref", event_ref_list);

    // init checkbox status
    $('#articutLawArticle').prop("checked", false);
    $('#articutCrime').prop("checked", false);
    $('#articutCriminalResponsibility').prop("checked", false);
    $('#articutEventRef').prop("checked", false);
}

function setAlert(alertName, alertTitle, classname, dataList) {
    $('#' + alertName + ' p').text(alertTitle);
    $($('#' + alertName + ' ul')[0]).empty()
    if (dataList.length == 0) {
        $('#' + alertName + ' ul').append('<li>沒有相關資料</li>');
    } else {
        for (var i = 0; i < dataList.length; i++) {
            $('#' + alertName + ' ul').append('<li><a href="#" class="' + classname + ' ' + classname + '_' + i + '">' + dataList[i] + '</a></li>');
        }
        registerLink(classname);
    }
}

function registerLink(name) {
    $('.' + name).click(function(e) {
        event.preventDefault();
        event.stopPropagation();
        var index = parseInt(this.classList[1].replace(name + "_", ""));
        animateBadge(name, index);
    });
}

function animateBadge(name, index) {
    var classname = "";
    switch (name) {
        case "law_article":
            classname = "success";
            break;
        case "crime":
            classname = "danger";
            break;
        case "criminal_responsibility":
            classname = "warning";
            break;
        case "event_ref":
            classname = "primary";
            break;
    }

    if (classname != "") {
        if ($('.badge.badge-' + classname).length > index) {
            var node = $('.badge.badge-' + classname)[index];
            $('html, body').scrollTop($(node).offset().top);
            node.classList.add("animated", "heartBeat");
            setTimeout(function() {
                node.classList.remove("animated", "heartBeat");
            }, 1000);
        }
    }
}