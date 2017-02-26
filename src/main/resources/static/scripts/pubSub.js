;!function() {

    var pubSub = {
        cache: {
            "betLoaded": [],
            "calculateProfit": [],
            "dataLoadComplete": [],
            "uploadComplete": []
        },

        subscribe: function(e, fn, scope) {
            var sub = this.cache[e];
            if (!sub) return;

            sub.push({
                fn: fn,
                scope: scope
            });
        },

        publish: function(e, data) {
            var event = this.cache[e];
            if (!event) return;

            event.forEach(function(el, index) {
                el.fn.apply(el.scope, data || []);
            });
        }

    };

    module.exports = pubSub;

}();