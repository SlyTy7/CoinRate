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
		//format dollar amount to add commas
		dollarDiff = parseInt(dollarDiff).toLocaleString();
		//cut off extra decimal places
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
			$("#rate-header").prepend("<span class='text-success'>+</span>");
			$("#percent-header").prepend("<span class='text-success'>+</span>");
		}else if(monthDiff<0){
			$("#rate-header").prepend("<span class='text-danger'>-</span>");
			$("#percent-header").prepend("<span class='text-danger'>-</span>");
		}

		//find minimum value and sets y-axis on chart accordingly
		let min = Math.floor(Math.min(...rates)) - 100;

		//plugin I found to add vertical line to chart on hover
		Chart.defaults.LineWithLine = Chart.defaults.line;
		Chart.controllers.LineWithLine = Chart.controllers.line.extend({
		   draw: function(ease) {
		      Chart.controllers.line.prototype.draw.call(this, ease);

		      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
		         let activePoint = this.chart.tooltip._active[0],
		             ctx = this.chart.ctx,
		             x = activePoint.tooltipPosition().x,
		             topY = this.chart.scales['y-axis-0'].top,
		             bottomY = this.chart.scales['y-axis-0'].bottom;

		         // draw line
		         ctx.save();
		         ctx.beginPath();
		         ctx.moveTo(x, topY);
		         ctx.lineTo(x, bottomY);
		         ctx.lineWidth = 2;
		         ctx.strokeStyle = '#ffffff';
		         ctx.stroke();
		         ctx.restore();
		      }
		   }
		});


		//the price history chart
		let ctx = $("#graph");
		let myChart = new Chart(ctx, {
		    type: 'LineWithLine',
		    data: {
		        labels: dates,
		        datasets: [{
		            label: 'Rate in USD',
		            fill: true,
		            data: rates,
		            backgroundColor: 'rgba(73, 145, 193, .3)',
		            borderColor: '#3598db',
		            borderWidth: 3,
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		            	display: true,
		            	position: 'left',
		            	gridLines : {
		            		display: 'true',
	            			color: '#555'
	            		},
		                ticks: {
		                	suggestedMin: min,
		                	fontColor: '#ffffff',
		                	callback: function(value, index, values) {
		                        return '$' + value.toLocaleString();
		                    }
		                }
		            }],
		            xAxes: [{
	            		display: true,
	            		gridLines : {
	            			display: true,
	            			color: '#555'
	            		},
	            		ticks: {
	            			fontColor: '#ffffff',
	            			callback: function(value) {
	            				const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.' ,'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
	            				value = value.split("-");
	            				value = months[value[1]-1] + " " + value[2] + ", " + value[0];
	            				return value;
	            			}
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
		        },
		        tooltips: {
		        	intersect: false,
		        	mode: 'index',
		        	displayColors: false,
		        	callbacks: {
					    label: function(tooltipItem, data) {
					    	//convert label to us dollar format
					        return '$' + tooltipItem.yLabel.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
					    },
					},

		        }
		    }
		});
	});
}
getHistory();