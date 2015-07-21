'use strict';
/*global $, tmpl */

var renderData = function(contentWrapper, contentBlock, spinner, result) {
    contentWrapper.find('.refresh-time').text(result.time);
    spinner.hide();
    contentBlock.empty().show();
    $.each(result.taverns, function(i, item) {
        if (item.usersInside.length > 0 || item.usersPlanToPlay.length > 0) {
            var tavernBlockHtml = '';
            var tavernTemplate = tmpl('tavern_tmpl');
            tavernBlockHtml += tavernTemplate(item);

            if (item.usersInside.length > 0) {
                $.each(item.usersInside, function(i, user) {
                    var userTemplate = tmpl('user_tmpl');
                    tavernBlockHtml += userTemplate(user);
                });
            }

            if (item.usersPlanToPlay.length > 0) {
                $.each(item.usersPlanToPlay, function(i, user) {
                    var userTemplate = tmpl('user_tmpl');
                    tavernBlockHtml += userTemplate(user);
                });
            }
            contentBlock.append(tavernBlockHtml);
        }
    });
};

var getData = function() {
    var contentWrapper = $('.tab-pane.active');
    var city = contentWrapper.attr('id');
    var contentBlock = contentWrapper.find('.panel-body .row').hide();
    var spinner = contentWrapper.find('.refresh-container').show();
    $.ajax({
        method: 'POST',
        // url: 'https://kicker-parser.herokuapp.com',
        url: 'http://localhost:5000',
        data: { city: city },
        dataType: 'json'
    })
    .done(function(result) {
        console.log(result);
        renderData(contentWrapper, contentBlock, spinner, result);
    });
};



$(document).ready(function() {
    //initialize
    getData();

    $('.nav.nav-tabs li a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
        getData();
    });

    $('.refresh-button').click(function() {
        getData();
    });

});