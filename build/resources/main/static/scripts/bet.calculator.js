;!function() {

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

    module.exports = betCalculator;
}();