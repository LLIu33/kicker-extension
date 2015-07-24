'use strict';
/*global $, tmpl, extensionConfig */

(function(exports) {
    var that = {};

    that.config = {
        container: '.panel-refresh .row',
        loader: '.refresh-container',
        btnRefresh: '.refresh-button',
        citySwitchBtn: '.city-block .btn',
        timeBlock: '.refresh-time',
        city: 'rostov',
    };

    that.Data = {
        getPlayers: function (city) {
            return $.post(extensionConfig.url, {city: city});
        },
        preprocess: function(players) {
            players.taverns = $.map(players.taverns, function(tavern) {
                tavern.users = $.merge(tavern.usersInside, tavern.usersPlanToPlay);
                return tavern;
            });
            return players;
        }
    };

    that.cache = {};

    that.Html = {
        initialize: function () {
            that.cache.$container = $(that.config.container);
            that.cache.$loader = $(that.config.loader);
            that.cache.$btnRefresh = $(that.config.btnRefresh);
            that.cache.$citySwitchBtn = $(that.config.citySwitchBtn);
            that.cache.$timeBlock = $(that.config.timeBlock);
            that.cache.city = that.config.city;
            that.Html.renew();
        },
        bindEvents: function () {
            that.cache.$btnRefresh.on('click', function () {
                    that.Html.renew();
                });
            that.cache.$citySwitchBtn.on('click', function () {
                    that.cache.city = $(this).find('input').val();
                    that.Html.renew();
                });
        },
        renew: function() {
            that.Html.showLoader();
            that.Data.getPlayers(that.cache.city).done(function (players) {
                players = that.Data.preprocess(players);
                that.Html.render(players);
                that.Html.hideLoader();
            });
        },
        render: function (players) {
            that.cache.$timeBlock.text(players.time);
            that.cache.$container.empty(); 
            that.cache.$container.append(tmpl('tavern_tmpl', players));
        },
        showLoader: function () {
            that.cache.$loader.show();
            that.cache.$container.hide();
            that.cache.$btnRefresh.addClass('fa-spin');
        },
        hideLoader: function () {
            that.cache.$loader.hide();
            that.cache.$container.show();
            that.cache.$btnRefresh.removeClass('fa-spin');
        }
    };

    that.run = function () {
        that.Html.initialize();
        that.Html.bindEvents();
    };

    window.App = that;
})(window);


// (function(require) {
//     var $ = require('jQuery');
//     var config = require('./config');

//     var self = {};

//     var getPlayers = function (city) {
//         return $.post(config.url, {city: city});
//     };


//     self.getPlayers = getPlayers;
//     return self;
// })();

// describe('App.Data', function () {
//     it('should call $.post with correct parameters', function () {
//         var mock = sinon.mock($);
//         mock.expects('post').once().withArgs('/baseurl', {city: 'city'});

//         App.Data.getPlayers('city');

//         mock.veryfy();
//     });
// })