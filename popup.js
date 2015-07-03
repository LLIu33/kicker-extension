'use strict';
/*global $ */
$(document).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://kicker-parser.herokuapp.com/', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // WARNING! Might be evaluating an evil script!
            //var resp = eval("(" + xhr.responseText + ")");
            // $('status').text(xhr.responseText);
            var target = $('#status pre').text('');
            var result = JSON.parse(xhr.responseText);
            console.log(result);
            $.each(result.taverns, function(i, item) {
                if (item.usersInside.length > 0 || item.usersPlanToPlay.length > 0) {
                    var tavernEl = $('<div></div>');
                    tavernEl.appendTo(target);
                    var tavernInfo = $('' + 
                        '<div style="padding: 0 10px;">' +
                            '<img src="http://mytogo.ru' + item.logo + '" width=40 height=40 /> ' + 
                            '<span><b>' + item.name + '</b></span>' + 
                        '</div>'
                        );
                    tavernEl.append(tavernInfo);

                    if (item.usersInside.length > 0) {
                        var userBlockEl = $('<div></div>');
                        userBlockEl.append('<h3>').text('Сейчас в заведении:');
                        var userStr = $('<div></div>');
                        $.each(item.usersInside, function() {
                            var el = this;
                            userStr.append(''+
                                '<img src="http://mytogo.ru' + el.avatar + '" width=40 height=40 /> ' + 
                                '<div style="float:right;">' +
                                    '<span>' + el.name + '</span>'+
                                '</div>'
                            );
                        });
                        userBlockEl.append(userStr);
                        tavernEl.append(userBlockEl);
                    }
                    
                    if (item.usersPlanToPlay.length > 0) {
                        var userPlanBlockEl = $('<div></div>');
                        userPlanBlockEl.append('<h3>').text('Планируют быть:');
                        var userPlanStr = $('<div></div>');
                        $.each(item.usersPlanToPlay, function() {
                            var el = this;
                            userPlanStr.append(''+
                                '<img src="http://mytogo.ru/' + el.avatar + '" width=40 height=40 /> ' + 
                                '<div style="float:right;">' +
                                    '<span><b>' + el.dateOfPlan + '</b></span><br />' +
                                    '<span>' + el.name + '</span>' +
                                '</div>'
                            );
                        });
                        userPlanBlockEl.append(userPlanStr);
                        tavernEl.append(userPlanBlockEl);
                    }
                }
            });
        console.log($('#status'));
        }
    };
    xhr.send();
});