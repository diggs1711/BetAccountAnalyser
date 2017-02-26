;!function() {

	var statsPanel = require('./panel.stats.js');
	
	var betView = {
        betResult: null,
        betEvent: null,
        statsPanel: statsPanel,
        mainEle: null,

        init: function() {
            this.initElements();
            this.statsPanel.init();
        },

        initElements: function() {
            this.betDate = document.querySelector('.bet-date');
            this.betEvent = document.querySelector('.bet-event');
            this.mainEle = document.querySelector('.content');
        },

        createNewRow: function() {
            var tbody = document.querySelector('.bet-body');
            var newRow = tbody.insertRow(tbody.rows.length);
            newRow.className = "bet";

            return newRow;
        },

        showMainEle: function() {
            this.mainEle.classList.remove("hidden");
        },

        hideMainEle: function() {
            this.mainEle.classList.add("hidden");
        },

        addBetToDisplay: function(bet) {
            var row = this.createNewRow();

            var dateCell = row.insertCell(0);
            var eventCell = row.insertCell(1);
            var marketCell = row.insertCell(2);
            var stakeCell = row.insertCell(3);
            var returnCell = row.insertCell(4);
            var netCell = row.insertCell(5)
            var resultCell = row.insertCell(6);

            var dateText = document.createTextNode(bet.date);
            dateCell.className = "bet-date";

            var eventText = document.createTextNode(bet.event);
            eventCell.className = "bet-event";

            var marketText = document.createTextNode(bet.market);
            marketCell.className = "bet-type";

            var resultText = document.createTextNode(bet.result);
            if (bet.result === "Won") {

                var success = document.createElement("span")
                success.className = "label label-success";
                resultCell.className = "bet-result";
                success.appendChild(resultText);
                resultCell.appendChild(success);

                betModel.betsWon += 1;

            } else if (bet.result === "Lost") {

                var loss = document.createElement("span")
                loss.className = "label label-danger";
                resultCell.className = "bet-result";
                loss.appendChild(resultText);
                resultCell.appendChild(loss);

                betModel.betsLost += 1;

            } else {

                var push = document.createElement("span")
                push.className = "label label-warning";
                resultCell.className = "bet-result";
                push.appendChild(resultText);
                resultCell.appendChild(push);

                betModel.betsPushed += 1;
            }

            var stakeAmount = document.createTextNode(bet.stake)
            stakeCell.className = "bet-stake";

            var returnAmount = document.createTextNode(bet.return);
            returnCell.className = "bet-return";

            var netAmount = document.createTextNode(bet.net);

            if (this.isNetPostiveOrNegative(bet.net)) {            
                netCell.className = "bet-net positive";
                var p = document.createElement("span");
                p.className = "glyphicon glyphicon-arrow-up";

                netCell.appendChild(p);
            } else {
                netCell.className = "bet-net negative";

                var n = document.createElement("span");
                n.className = "glyphicon glyphicon-arrow-down";
                
                netCell.appendChild(n);
            }
            
            dateCell.appendChild(dateText);
            eventCell.appendChild(eventText);
            marketCell.appendChild(marketText);
            stakeCell.appendChild(stakeAmount);
            netCell.appendChild(netAmount);
            returnCell.appendChild(returnAmount);

        },

        isNetPostiveOrNegative: function(net){
            var n = parseFloat(net);
            return n > 0.0 ? true : false;
        },

        createPanelView: function(d) {
            var numBets = this.statsPanel.createStatDisplayElement("Bets", betModel.getNumberOfBets());
            this.statsPanel.panelBody.appendChild(numBets);

            var totalStaked = this.statsPanel.createStatDisplayElement("Staked(€)", betModel.getTotalAmountStaked());
            this.statsPanel.panelBody.appendChild(totalStaked);

            var totalReturned = this.statsPanel.createStatDisplayElement("Returned(€)", betModel.getTotalAmountReturned());
            this.statsPanel.panelBody.appendChild(totalReturned);

            var totalNet = this.statsPanel.createStatDisplayElement("Net(€)", betModel.getTotalNet());
            this.statsPanel.panelBody.appendChild(totalNet);

            var pieChart = document.createElement("div");
            pieChart.id = "container";
            pieChart.className = "row container";
            this.statsPanel.panelBody.appendChild(pieChart);
        },

        createBetElement: function(r, e) {
            var betDiv = document.createElement('tr');
            var resultDiv = document.createElement('td');
            var eventDiv = document.createElement('td');

            resultDiv.innerText = r;
            eventDiv.innerText = e;

            betDiv.appendChild(resultDiv);
            betDiv.appendChild(eventDiv);

            return betDiv;
        }
    };

    module.exports = betView;
}();