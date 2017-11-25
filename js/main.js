
function getStats(){
	$.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", function(data){

		const currentDollars = $("#current-rate");
		const currentCents = $("#current-cents");

		//save current price of bitcoin
		let dollarPrice = data.bpi.USD.rate;
		let justDollars = dollarPrice.slice(0,-5);
		let justCents = "." + dollarPrice.split(".")[1].slice(0,2);

		currentDollars.html(justDollars);
		currentCents.html(justCents);

	})
};

getStats();

//update price every 30 seconds
setTimeout(getStats, 30000)



function getHistory(){


	//get the rate history from last 30 days
	$.getJSON('https://api.coindesk.com/v1/bpi/historical/close.json', function(data){
		//reset dates and rates arrays
		let dates = [];
		let rates = [];

		//loop through past rates object
		for (prop in data.bpi) {
			let date = prop;
			let rate = data.bpi[prop];

			//add last 30 days rates to empty arrays
			dates.push(date);
			rates.push(rate);
		}

		let monthDiff = (rates[rates.length-1] - rates[0]).toString();
		let dollarDiff = monthDiff.split(".")[0];
		let centsDiff = "." + monthDiff.split(".")[1].slice(0,2);

		//add change amount to html
		$("#rate-change").html(dollarDiff);
		$("#changed-cents").html(centsDiff);

		//find minimum value and sets y-axis on chart accordingly
		let min = Math.floor(Math.min(...rates)) - 100;

		//the chart....maybe
		let ctx = $("#graph");
		let myChart = new Chart(ctx, {
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
		                	suggestedMin: min
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