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
            var text = crime_list[i].replace(/。/g, "。<br>").replace(/：/g, "：<br>");
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp(text), "g"), '<span class="badge badge-danger">' + text + '</span>'));
                } else {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp('<span class="badge badge-danger">' + text + '</span>'), "g"), text));
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
            var text = criminal_responsibility_list[i].replace(/。/g, "。<br>").replace(/：/g, "：<br>");
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp(text), "g"), '<span class="badge badge-warning">' + text + '</span>'));
                } else {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp('<span class="badge badge-warning">' + text + '</span>'), "g"), text));
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
            var text = event_ref_list[i].replace(/。/g, "。<br>").replace(/：/g, "：<br>");
            for (var j = 0; j < $('body .card-body').length; j++) {
                if (this.checked) {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp(text), "g"), '<span class="badge badge-primary">' + text + '</span>'));
                } else {
                    $('body .card-body').eq(j).html($('body .card-body').eq(j).html().replace(new RegExp(escapeRegExp('<span class="badge badge-primary">' + text + '</span>'), "g"), text));
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
                    content += "<br>";
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
            $('#' + alertName + ' ul').append('<li><a href="#" class="' + classname + '">' + dataList[i] + '</a></li>');
        }
        registerLink(classname);
    }
}

function registerLink(name) {
    $('.' + name).click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        animateBadge(name, $(this).text());
    });
}

function animateBadge(name, text) {
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

    var indexList = [];
    for (var i=0; i<$('.badge.badge-' + classname).length; i++) {
        if ($('.badge.badge-' + classname).eq(i).text() == text) {
            indexList.push(i);
        }
    }
    var index = 0;
    if (indexList.length > 0) {
        index = indexList[Math.floor(Math.random() * indexList.length)];
    }

    if (classname != "") {
        if ($('.badge.badge-' + classname).length > index) {
            var node = $('.badge.badge-' + classname)[index];
            $('html, body').scrollTop($(node).offset().top);
            $(node).css("display", "inline-block");
            node.classList.add("animated", "heartBeat");
            setTimeout(function() {
                node.classList.remove("animated", "heartBeat");
                $(node).css("display", "inline");
            }, 1000);
        }
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }