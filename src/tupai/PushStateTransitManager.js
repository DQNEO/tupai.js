/**
 * @class   tupai.PushStateTransitManager
 * @author <a href='bocelli.hu@gmail.com'>bocelli.hu</a>
 * @docauthor <a href='bocelli.hu@gmail.com'>bocelli.hu</a>
 * @since tupai.js 0.3
 *
 * html5 history api are support by this class.
 * this class is default tansitManager.
 * if you don't want to use html5 history api for you application
 * you can set the window options like bellow.
 *
 *     new cp.Window({
 *         routes: {
 *             '/root'    : cp.RootViewController,
 *             '/root/timeline': cp.TimeLineViewController
 *         },
 *         disablePushState: true
 *     });
 *
 */
Package('tupai')
.use('tupai.util.HttpUtil')
.use('tupai.TransitManager')
.define('PushStateTransitManager', function (cp) { return cp.TransitManager.extend({
    _delegate: undefined,
    initialize : function (windowObject, rules, config) {

        cp.TransitManager.prototype.initialize.apply(this, arguments);

        this._separator = (config && config.separator) || "#!";
        var THIS = this;
        this._popEventHanlder=undefined;

        this._addPopStateEventListener = function() {
            window.addEventListener("popstate", function(jsevent) {
                //console.log(jsevent);
                var state = jsevent.state;
                if(!state || !state.url) {
                    // no state
                    var url = window.location.href;
                    var entry = THIS._parseFromLocation();
                    if(this._current) {
                        var result = cp.TransitManager.prototype.transitWithHistory.apply(THIS, [entry.url, entry.options]);
                        if(result) {
                            THIS._replaceState();
                        }
                    }

                    return;
                }

                var url = state.url;
                var hanlder = THIS._popEventHanlder;
                if(hanlder) {
                    delete THIS._popEventHanlder;
                    hanlder();
                    return;
                }

                THIS._history = state.history || [];
                THIS._transit(
                    url,
                    state.options,
                    state.transitOptions);
            });

            THIS._addPopStateEventListener = function(){};
        };
    },
    back: function (targetUrl, options, transitOptions) {

        this._lastSize = this.size();
        var ret = cp.TransitManager.prototype.back.apply(this, arguments);
        return ret;
    },
    backTo: function (targetUrl, options, transitOptions) {

        this._lastSize = this.size();
        var ret = cp.TransitManager.prototype.backTo.apply(this, arguments);
        return ret;
    },
    _back: function (prev, transitOptions) {

        //console.log('_back ' + JSON.stringify(prev) + ', ' + JSON.stringify(transitOptions));
        if(!prev) return 0;

        var THIS = this;
        var superFunc = function() {
            var ret = cp.TransitManager.prototype._back.apply(
                THIS,
                [ prev, transitOptions ]
            );
            THIS._replaceState();
            return ret;
        };

        var off = this.size()-this._lastSize;
        //console.log('off= ' + off + ', lastSize=' + this._lastSize + ', size=' + this.size());
        var isNew = transitOptions && transitOptions.newTransit;
        if(isNew) {
            if(off === 0) {
                return superFunc();
            }
        } else {
            window.history.go(off);
            return 1;
        }

        this._popEventHanlder = function() {
            superFunc();
        };
        window.history.go(off);

        return isNew?2:1;
    },
    _replaceState: function() {
        window.history.replaceState({
            url: this._current.url,
            options: this._current.options,
            transitOptions: this._current.transitOptions,
            history: this._history
        }, "", this._createUrl(this._current.url, this._current.options));
    },
    transitWithHistory: function (url, options, transitOptions) {
        var result = cp.TransitManager.prototype.transitWithHistory.apply(this, arguments);
        if(result) {
            window.history.pushState({
                url:url,
                options:options,
                transitOptions: transitOptions,
                history: this._history
            }, "", this._createUrl(url, options));
        }
        return result;
    },
    _createUrl: function(url, options) {

        var qs = cp.HttpUtil.createQueryString(options);
        if(qs.length > 0) {
            if(url.indexOf('?') < 0) url += '?';
            url += qs;
        }
        return this._separator + url;
    },
    _parseFromLocation: function() {

        var escapeRegExp = function (string) {
            return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        };
        var regexp = new RegExp("^(.*)"+escapeRegExp(this._separator)+"(.*)");
        var matches = (window.location.href+'').match(regexp);
        if(matches) {
            return cp.HttpUtil.parseOptionsFromUrl(matches[2]);
        }
    },
    transit: function (url, options, transitOptions) {
        if(transitOptions && transitOptions.entry) {
            // entry point
            var entry = this._parseFromLocation();

            if(entry) {
                url = entry.url;
                options = entry.options;
            }

            var state = window.history.state;
            if(state) {
                // use history saved in state.
                this._history = state.history;
            }
        }
        var result = cp.TransitManager.prototype.transit.apply(this, [url, options, transitOptions]);
        if(result) {
            this._replaceState();
        }
        if(transitOptions && transitOptions.entry) {
            this._addPopStateEventListener();
        }
        return result;
    }
});});
