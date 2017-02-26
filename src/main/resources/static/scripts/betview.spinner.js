;!function() {
	'use strict';

	var spinner = (function() {

        var Loading = {
            mainEle: null,
            loadingEle: null,
            init: function() {
                this.initElements();
            },

            initElements: function() {
                this.loadingEle = this.createSpinnerElement();
            },

            createSpinnerElement: function() {
                var s = document.createElement("div");
                s.className = "datepicker__spinner"
                return s;
            },

            show: function() {
                this.loadingEle.classList.remove("hidden");
            },

            hide: function() {
                this.loadingEle.classList.add("hidden");
            }
        };

        return Loading;
    })();
    
}();