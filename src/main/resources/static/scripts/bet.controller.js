;!function() {

	var betView = require('./bet.view.js');
	var betModel = require('./bet.model.js');
	var dataExtractor = require('./data.extractor.js');
    var betCalculator = require('./bet.calculator.js');

	var betController = {
        betView: betView,
        betModel: betModel,
        dataExtractor: dataExtractor,
        betCalculator: betCalculator,

        betLoaded: function(bet) {
            var result = dataExtractor.extract(bet);
            var net = this.betCalculator.calculateProfit(bet);
            result.net = net;

            this.betView.addBetToDisplay(result);
            betModel.addBet(result);
        },

        uploadComplete: function(d) {
            this.betView.mask.hide();
            this.betView.spinner.hide();
            this.betView.showMainEle();
            this.betView.createPanelView(d);
            this.betView.statsPanel.createPieChart();
        }
    };

    module.exports = betController;
}();