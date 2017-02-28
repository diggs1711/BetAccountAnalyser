;!function() {

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
    };

    module.exports = betModel;
}();