var coins = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
var roundTo = [100, 200, 500, 1000, 2000, 5000];

function play()
{
    var whichCase = randomInt(2);
    var priceToPay = 
         whichCase == 0 ? randomInt(100) * 100 + randomInt(100)
                        : randomInt(10) * 100 + randomInt(100);
    // put a lower bound on the maximum bill they can use to pay
    var lowerPowerOf10Exclusive = Math.pow(10, Math.max(Math.floor(Math.log10(priceToPay)) - 1), 0);
    var round = _.chain(roundTo).filter(function(a) { return a >= lowerPowerOf10Exclusive }).shuffle().first().value();
    var paid = (Math.ceil(priceToPay / round)) * round;
    var selectedCoins = [];
    var remainingToPay = paid;
    var take = function(coinValue) 
    {
        console.log(coinValue);
        if (remainingToPay / coinValue < 1)
        {
            return;
        }
        var count = randomInt(Math.floor(remainingToPay / coinValue)) + 1;
        selectedCoins.push([coinValue/100, count]);
        remainingToPay -= coinValue * count;
    };
    
    // selectedCoins.push([round / 100, paid / round])
    take(round);
    while (remainingToPay)
    {
        take(_.chain(coins).filter(function(c) { return c >= round }).shuffle().first().value());
        console.log(remainingToPay);
    }
  return (priceToPay / 100) + " " + (round / 100) + " " + (paid / 100) + " " + selectedCoins;
}

function randomInt(max)
{
    return Math.floor(Math.random() * (max || 1000));
}

function update()
{
    $("#container").append("<p>" + play() + "</p>");
}

setInterval(update, 1000);
update();