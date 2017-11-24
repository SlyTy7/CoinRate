const dollarOutput = $(".usd");
const euroOutput = $(".eur");
const poundOutput = $(".gbp");

function getStats(){
	$.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", function(data){
		console.log(data);

		//save current prices of bitcoin in us dollars, british pounds, and euros
		let dollarPrice = data.bpi.USD.rate;
		let euroPrice = data.bpi.EUR.rate;
		let poundPrice = data.bpi.GBP.rate;

		//trim off excess decimal points
		dollarPrice = dollarPrice.slice(0,-2);
		euroPrice = euroPrice.slice(0,-2);
		poundPrice = poundPrice.slice(0,-2);

		//output converted rate of BitCoin
		dollarOutput.text("\u0024" + dollarPrice);
		euroOutput.text("\u20AC" + euroPrice);
		poundOutput.text("\u00A3" + poundPrice);		
	})
};

getStats();

//update price every 30 seconds
setTimeout(getStats, 30000)
