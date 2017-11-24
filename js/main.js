const dollarOutput = $(".usd");
const euroOutput = $(".eur");
const poundOutput = $(".gbp");

function getStats(){
	$.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", function(data){

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



function getHistory(){
	//reset dates and rates arrays
	let dates = [];
	let rates = [];

	//get the rate history from last 30 days
	$.getJSON('https://api.coindesk.com/v1/bpi/historical/close.json', function(data){
		for (prop in data.bpi) {
			var date = prop;
			var rate = data.bpi[prop];

			//add last 30 days rates to empty arrays
			dates.push(date);
			rates.push(rate);
		}


		//the chart....maybe
		var ctx = $("#graph");
		var myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: dates,
		        datasets: [{
		            label: 'Rate in USD',
		            fill: true,
		            data: rates,
		            backgroundColor: 'rgba(197, 248, 211, .5)',
		            borderColor: '#50b767',
		            borderWidth: 3
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        },
		        elements: {
		            line: {
		                tension: 0, // disables bezier curves
		            }
		        }
		    }
		});
	});
}
getHistory();


