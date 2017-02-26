;!function() {

    var dataExtractor = require('./data.extractor.js');
    var fileUpload = require('./file.upload.js');
    var pubSub = require('./pubSub.js');
    var betCalculator = require('./bet.calculator.js');
    var statsPanel = require('./panel.stats.js');
    var betModel = require('./bet.model.js');
    var betController = require('./bet.controller.js');
    var betView = require('./bet.view.js');

    fileUpload.init();
    betView.init();

    pubSub.subscribe("betLoaded", betController.betLoaded, betController);
    pubSub.subscribe("calculateProfit", betCalculator.calculateProfit, betCalculator);
    pubSub.subscribe("dataLoadComplete", betController.uploadComplete, betController);
    pubSub.subscribe("loadingData", betView.loadingData, betView);

}();
