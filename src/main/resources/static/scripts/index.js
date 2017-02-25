(function() {
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

            data.forEach(function(element, index) {
                pubSub.publish("calculateProfit", [element]);
                pubSub.publish("betLoaded", [element]);
            });

            pubSub.publish("dataLoadComplete", data);
        }

    };

    var betCalculator = {
        totalStaked: 0.0,
        totalReturned: 0.0,
        profit: 0.0,
        betStake: 0.0,
        betReturn: 0.0,
        bets: 0,
        totalNet: 0.0,

        calculateProfit: function(bet) {

            var stake = bet["bet_stake"];
            var betReturn = bet["bet_return"];

            this.bets += 1;
            this.betStake = parseFloat(stake);
            this.betReturn = parseFloat(betReturn);

            this.totalStaked += this.betStake;
            this.totalReturned += this.betReturn;

            this.profit = (-this.betStake + this.betReturn);

            this.totalNet += this.profit;
            return this.profit.toFixed(2);
        }

    };

    var statsPanel = (function() {

        var panel = {
            mainEle: null,
            panelBody: null,

            init: function() {
                this.initElements();
            },

            initElements: function() {
                this.panelBody = document.querySelector('.js-stats');
            },

            createStatDisplayElement: function(name, value) {
                var div = document.createElement("div");
                div.className = "stat";

                var p = document.createElement("div");
                p.className = "w30";
                p.innerText = name;

                var val = document.createElement("div")
                val.className = "w70 boldFont";
                val.innerText = value;

                div.appendChild(p);
                div.appendChild(val);

                return div;
            },

            createPieChart: function() {
                var self = this;
                var series = self.createSeries();

                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        renderTo: 'container',
                        type: 'pie'
                    },
                    title: {
                        enabled: false,
                        text: ""
                    },

                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: series
                });


            },

            createSeries: function() {
                var output = [];
                var result = {};

                result.name = 'Percentage';
                result.colorByPoint = true;
                result.data = [];

                var won = parseInt(betModel.getNumberOfBetsWon());
                var lost = parseInt(betModel.getNumberOfBetsLost());
                var pushed = parseInt(betModel.getNumberOfBetsPushed());
                var total = parseInt(betModel.getNumberOfBets());

                var w = {
                    name: 'Won',
                    y: (won / total),
                    color: '#5cb85c'
                };

                var l = {
                    name: 'Lost',
                    y: (lost / total),
                    color: '#d9534f'
                };

                var p = {
                    name: 'Pushed',
                    y: (pushed / total),
                    color: '#f0ad4e'
                }

                result.data.push(w);
                result.data.push(l);
                result.data.push(p);

                output.push(result);

                return output;
            }
        };

        return panel;
    })();

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

    var dataExtractor = {
        extract: function(data) {
            var output = {};

            var betDate = data['bet_date'];
            var event = data['bet_event'];
            var betResult = data['bet_result'];
            var betStake = data["bet_stake"];
            var betReturn = data["bet_return"];

            var event = event.split("(");
            var betEvent = event[0];
            var market = event[1].replace(")", "");

            output.date = betDate;
            output.event = betEvent;
            output.result = betResult;
            output.stake = betStake;
            output.return = betReturn;
            output.market = market;

            return output;
        }
    }

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
            this.betView.showMainEle();
            this.betView.createPanelView(d);
            this.betView.statsPanel.createPieChart();
        }
    };

    var betModel = {
        bets: [],
        totalAmountStaked: 0.0,
        totalAmountReturned: 0.0,
        betsWon: 0,
        betsLost: 0,
        betsPushed: 0,

        getNumberOfBets: function() {
            return this.bets.length;
        },

        addBet: function(bet) {
            this.bets.push(bet);
        },

        getNumberOfBetsWon: function() {
            return this.betsWon;
        },

        getNumberOfBetsLost: function() {
            return this.betsLost;
        },

        getNumberOfBetsPushed: function() {
            return this.betsPushed;
        },

        getTotalAmountStaked: function() {
            var self = this;
            self.totalAmountStaked = 0.0;

            this.bets.forEach(function(bet) {
                self.totalAmountStaked += parseFloat(bet.stake);
            });

            return this.totalAmountStaked.toFixed(2);
        },

        getTotalAmountReturned: function(bet) {
            var self = this;
            self.totalAmountReturned = 0.0;

            this.bets.forEach(function(bet) {
                self.totalAmountReturned += parseFloat(bet.return);
            });

            return this.totalAmountReturned.toFixed(2);
        },

        getTotalNet: function() {
            return (this.totalAmountReturned - this.totalAmountStaked).toFixed(2);
        }
    }

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

    }

    fileUpload.init();
    betView.init();

    pubSub.subscribe("betLoaded", betController.betLoaded, betController);
    pubSub.subscribe("calculateProfit", betCalculator.calculateProfit, betCalculator);
    pubSub.subscribe("dataLoadComplete", betController.uploadComplete, betController);

})();
