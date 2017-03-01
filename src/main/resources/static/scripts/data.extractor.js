;!function() {
    'use strict';

    var dataExtractor = {
        extract: function(data) {
            var output = {};

            var betDate = data['bet_date'];
            var event = data['bet_event'];
            var betResult = data['bet_result'];
            var betStake = data["bet_stake"];
            var betReturn = data["bet_return"];

            console.log(event);

            if(event) {
              var event = event.split("(");
              var betEvent = event[0];
              var market = event[1].replace(")", "");
            }


            output.date = betDate;
            output.event = betEvent;
            output.result = betResult;
            output.stake = betStake;
            output.return = betReturn;
            output.market = market;

            return output;
        }
    };

    module.exports = dataExtractor;
}();
