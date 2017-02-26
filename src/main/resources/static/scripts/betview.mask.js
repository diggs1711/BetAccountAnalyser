;!function() {

	var mask = (function() {

        var Mask = {
            mainEle: null,
            maskEle: null,
            init: function() {
                this.initElements();
                this.initListeners();
            },

            initElements: function() {
                this.maskEle = document.querySelector(".js-mask");
            },

            initListeners: function() {
                var me = this;

                this.maskEle.addEventListener('click', me.clearMask);
            },

            clearMask: function(e) {
                pubSub.publish("onMaskClick", e);
            },

            show: function() {
                this.maskEle.classList.remove("hidden");
            },

            hide: function() {
                this.maskEle.classList.add("hidden");
            }
        };

        return Mask;
    })();

    module.exports = mask;
}();