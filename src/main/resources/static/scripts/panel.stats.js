;!function() {

	var betModel = require('./bet.model.js');

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

    module.exports = statsPanel;

}();