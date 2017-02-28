;!function() {
	'use strict';

	var pubSub = require('./pubSub.js');

	var fileUpload = {
        input: null,
        fileSelect: null,
        mainEle: null,

        init: function() {
            this.initElements();
            this.initListeners();
        },

        initElements: function() {
            this.input = document.querySelector(".file");
            this.fileSelect = document.querySelector("#fileSelect");
            this.mainEle = document.querySelector('.file-upload');
        },

        initListeners: function() {
            var self = this;

            this.input.addEventListener('change', self.getData.bind(this));
            this.fileSelect.addEventListener('click', self.onUploadBtnClick.bind(self));
        },

        getData: function(e) {
            var fileReader = new FileReader();
            fileReader.onload = this.onReaderLoad.bind(this);
            fileReader.readAsText(e.target.files[0]);
        },

        onUploadBtnClick: function(e) {

            if (this.input) {
                this.input.click();
            }
            pubSub.publish("loadingData", e);
            e.preventDefault();
            this.hideUploadBtn();
            pubSub.publish("uploadComplete", e);
        },

        hideUploadBtn: function() {
            this.mainEle.classList.add("hidden");
        },

        onReaderLoad: function(e) {
            var obj = JSON.parse(e.target.result);
            this.extractData(obj.bets);
        },

        extractData: function(data) {
            var self = this;

						console.log(data);
            data.forEach(function(element, index) {
                pubSub.publish("calculateProfit", [element]);
                pubSub.publish("betLoaded", [element]);
            });

            pubSub.publish("dataLoadComplete", data);
        }

    };

    module.exports = fileUpload;
}();
