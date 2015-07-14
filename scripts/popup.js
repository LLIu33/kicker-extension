'use strict';
/*global $ */
$.fn.refreshMe = function(opts){
      var $this = this,
          defaults = {
            ms:1500,
            parentSelector:'.panel',
            started:function(){},
            completed:function(){}
          },
          settings = $.extend(defaults, opts);
  
      var par = this.parents(settings.parentSelector);
      var panelToRefresh = par.find('.refresh-container');
      var dataToRefresh = par.find('.info h4');
      
      var ms = settings.ms;
      var started = settings.started;
      var completed = settings.completed;
      
      $this.click(function(){
        $this.addClass('fa-spin');
        panelToRefresh.show();
        if (dataToRefresh) {
          started(dataToRefresh);
        }
        setTimeout(function(){
          if (dataToRefresh) {
              completed(dataToRefresh);
          }
          panelToRefresh.fadeOut(800);
          $this.removeClass('fa-spin');
        },ms);
        return false;
      });
};

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

$(document).ready(function() {
    $('.refresh-button').refreshMe({
        started: function(ele) { ele.html('Please wait...'); },
        completed: function(ele) { ele.html('Data is was updated : ' + getNowStr()); },
    });

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://kicker-parser.herokuapp.com/', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // Hide "Please wait" string
            var infoBlock = $('.info').hide();
            var target = $('.panel-body .row');
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