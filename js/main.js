function getCurrent(){
	$.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", function(data){
		const currentDollars = $("#current-rate");
		const currentCents = $("#current-cents");

		//save current price of bitcoin
		let dollarPrice = data.bpi.USD.rate;
		let justDollars = dollarPrice.slice(0,-5);
		let justCents = "." + dollarPrice.split(".")[1].slice(0,2);

		//put current price in header stats
		currentDollars.html(justDollars);
		currentCents.html(justCents);

	})
};
getCurrent();
//update current price every 30 seconds
setInterval(getCurrent, 30000);


function getHistory(){
	//get the rate history from last 30 days using the coindesk api
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

		//MONTHLY RATE CHANGE
		//find the monthly dollar change amount
		let monthDiff = (rates[rates.length-1] - rates[0]);
		let dollarDiff = monthDiff.toString().split(".")[0];
		let centsDiff = "." + monthDiff.toString().split(".")[1].slice(0,2);
		//add change amount to html
		$("#rate-change").html(dollarDiff);
		$("#changed-cents").html(centsDiff);

		//MONTHLY PERCENTAGE CHANGE
		//find the monthly percentage change amount
		let percentDiff = (monthDiff / rates[0]) * 100;
		//round the percentange to hundreths
		let formattedDiff = Math.round(percentDiff * 100) / 100;
		//add percent change to html
		$("#percent-change").html(formattedDiff);

		//add positive or negative sign to rate and percent change
		if(monthDiff>0){
			$("#rate-header").prepend("<span style='color:green'>+</span>");
			$("#percent-header").prepend("<span style='color:green'>+</span>");
		}else if(monthDiff<0){
			$("#rate-header").prepend("<span style='color:red'>-</span>");
			$("#percent-header").prepend("<span style='color:red'>-</span>");
		}

		//find minimum value and sets y-axis on chart accordingly
		let min = Math.floor(Math.min(...rates)) - 100;

		//the price history chart
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
		        },
		        legend: {
		        	display: false
		        }
		    }
		});
	});
}
getHistory();