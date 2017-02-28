;!function() {
	'use strict';

	var spinner = (function() {

        var Loading = {
            mainEle: null,
            spinnerEle: null,
            init: function() {
                this.initElements();
            },

            initElements: function() {
                this.spinnerEle = document.querySelector(".js-spinner");
            },

            show: function() {
                this.spinnerEle.classList.remove("hidden");
            },

            hide: function() {
                this.spinnerEle.classList.add("hidden");
            }
        };

        return Loading;
    })();

    module.exports = spinner;
}();