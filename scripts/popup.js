'use strict';
/*global $, tmpl */

var getNowStr = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    return dd+'/'+mm+'/'+yyyy;
};

var getData = function(city) {
    $.get('https://kicker-parser.herokuapp.com#' + city, function(data) {
        console.log(data);
        console.log(getNowStr());
})
    .done(function(result) {
        // Hide "Please wait" string
        var infoBlock = $('.info').hide();
        var contentWrapper = $('.tab-pane.active').empty();
        contentWrapper.html(tmpl('panel_tmpl', {}));
        var contentBlock = contentWrapper.find('.panel-body .row');
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
                contentBlock.html(tavernBlockHtml);
            }
        });
    });
};

$(document).ready(function() {
    $('.refresh-button').refreshMe({
        started: function(ele) { ele.html('Please wait...'); },
        completed: function(ele) { ele.html('Data is was updated : ' + getNowStr()); },
    });

    $('.nav.nav-tabs li a').click(function (e) {
        var el = $(this);
        var city = el.data('city');
        e.preventDefault();
        el.tab('show');
        getData(city);
    });

    getData();
});