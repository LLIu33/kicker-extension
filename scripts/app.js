'use strict';
/*global $, tmpl, extensionConfig */

(function(exports) {
    var that = {};

    that.cityStorage = 'rostov';

    that.config = {
        container: '.panel-refresh .row',
        loader: '.refresh-container',
        btnRefresh: '.refresh-button',
        citySwitchBtn: '.city-block .btn',
        timeBlock: '.refresh-time'
    };

    // extensionConfig
    that.Model = {
        getPlayers: function (city, callback) {
            $.ajax({
                url: extensionConfig.url,
                method: extensionConfig.method,
                data: {city: city},
                success: function (data) {
                    // Node-style CPS: callback(err, data)
                    callback(null, data);
                }
            });
        }
    };

    // config
    that.View = {
        cache: {},
        events: {},
        initialize: function () {
            this.buildCache();
            this.buildCustomEvents();
            this.bindEvents();
        },
        buildCache: function () {
            this.cache.$container = $(that.config.container);
            this.cache.$loader = $(that.config.loader);
            this.cache.$btnRefresh = $(that.config.btnRefresh);
            this.cache.$citySwitchBtn = $(that.config.citySwitchBtn);
            this.cache.$timeBlock = $(that.config.timeBlock);
        },
        buildCustomEvents: function () {
            this.events = {
                refreshEvent: $({
                    type:'refreshEvent'
                }),
                switchEvent: $({
                    type: 'switchEvent'
                })
            };
        },
        bindEvents: function () {
            var self = this;

            this.cache.$btnRefresh.on('click', function () {
                self.events.refreshEvent.trigger('done');
            });

            this.cache.$citySwitchBtn.on('click', function () {
                var city = $(this).find('input').val();
                self.events.switchEvent.trigger('done', city);
            });
        },
        render: function (players) {
            this.cache.$timeBlock.text(players.time);
            this.cache.$container.empty(); 
            this.cache.$container.append(tmpl('tavern_tmpl', players));
        },
        showLoader: function () {
            this.cache.$loader.show();
            this.cache.$container.hide();
            this.cache.$btnRefresh.addClass('fa-spin');
        },
        hideLoader: function () {
            this.cache.$loader.hide();
            this.cache.$container.show();
            this.cache.$btnRefresh.removeClass('fa-spin');
        }
    };

    that.helpers = {
        preprocess: function (players) {
            players.taverns = $.map(players.taverns, function (tavern) {
                tavern.users = $.merge(tavern.usersInside, tavern.usersPlanToPlay);
                return tavern;
            });
            return players;
        }
    };

    var refreshTaverns = function (city) {
        that.View.showLoader();
        that.Model.getPlayers(city, function (err, players) {
            players = that.helpers.preprocess(players);
            that.View.render(players);
            that.View.hideLoader();
        });
    };

    that.run = function () {
        that.View.initialize();

        that.View.events.refreshEvent.
            on('done', function () {
                refreshTaverns(that.cityStorage);
            });

        that.View.events.switchEvent.
            on('done', function (e, city) {
                // set to storage = city
                that.cityStorage = city;
                refreshTaverns(city);
            });

        refreshTaverns(that.cityStorage);
    };

    window.App = that;
})(window);