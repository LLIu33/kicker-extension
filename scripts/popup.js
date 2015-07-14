'use strict';
/*global $ */
$(document).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://kicker-parser.herokuapp.com/', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // Hide "Please wait" string
            var infoBlock = $('.info').hide();
            var target = $('.content-wrapper');
            var tavernTemplate = $('.templates .tavern-block');
            var userTemplate = $('.templates .user-block');

            var result = JSON.parse(xhr.responseText);
            console.log(result);
            $.each(result.taverns, function(i, item) {
                if (item.usersInside.length > 0 || item.usersPlanToPlay.length > 0) {
                    var tavernEl = tavernTemplate.clone();
                    tavernEl.appendTo(target);
                    tavernEl.find('.tavern-logo img').attr('src', 'http://mytogo.ru' + item.logo);
                    tavernEl.find('.tavern-title h4 strong').text(item.name);

                    if (item.usersInside.length > 0) {
                        $.each(item.usersInside, function() {
                            var userEl = userTemplate.clone();
                            userEl.appendTo(tavernEl);
                            var el = this;
                            userEl.find('.user-avatar img').attr('src', 'http://mytogo.ru' + el.avatar);
                            userEl.find('.user-name span').text(el.name);
                            userEl.find('.user-date span').text('NOW');
                        });
                    }
                    
                    if (item.usersPlanToPlay.length > 0) {
                        $.each(item.usersPlanToPlay, function() {
                            var userPlanEl = userTemplate.clone();
                            userPlanEl.appendTo(tavernEl);
                            var el = this;
                            var dateOfPlan = new Date(el.dateOfPlan);
                            userPlanEl.find('.user-avatar img').attr('src', 'http://mytogo.ru' + el.avatar);
                            userPlanEl.find('.user-name span').text(el.name);
                            userPlanEl.find('.user-date span').text(dateOfPlan.format('dd-m-yy' + ' / ' + el.time));
                        });
                    }
                }
            });
        }
    };
    xhr.send();
});