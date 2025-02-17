function copyAddress() {
	const address = document.getElementById('contractAddress')
		.innerText;
	navigator.clipboard.writeText(address)
		.then(() => {
			// Change the button content to the success icon
			document.getElementById('copyButtonText')
				.innerHTML = `
					<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				`;

			// Optionally, you can reset the button back to original after a delay
			setTimeout(() => {
				document.getElementById('copyButtonText')
					.innerHTML = `
						<svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						  <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5M11 9H20C21.1046 9 22 9.89543 22 11V20C22 21.1046 21.1046 22 20 22H11C9.89543 22 9 21.1046 9 20V11C9 9.89543 9.89543 9 11 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					`;
			}, 3000); // Reset after 3 seconds
		})
		.catch(err => {
			console.error('Failed to copy: ', err);
		});
}

function fetchTokenData() {
	const pair = ''; // Dexscreener Pair
	const apiUrl = 'https://api.dexscreener.com/latest/dex/pairs/solana/' + pair;
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const price = data.pairs[0].priceUsd;
			const marketCap = data.pairs[0].marketCap;
			const priceChange = data.pairs[0].priceChange.h24;

			// Format numbers with commas for the integer part only
			const formattedPrice = formatNumber(price);
			const formattedMarketCap = formatNumber(marketCap);
			const formattedPriceChange = priceChange >= 0 ? '+' + priceChange + '%' : priceChange + '%';

			// Smooth update effect only if the value has changed
			const currentPrice = document.getElementById('price')
				.innerText.replace('$', '');
			const currentMarketCap = document.getElementById('marketCap')
				.innerText.replace('$', '');

			if (currentPrice !== formattedPrice) {
				updateElementWithTransition('price', '$' + formattedPrice);
			}
			if (currentMarketCap !== formattedMarketCap) {
				updateElementWithTransition('marketCap', '$' + formattedMarketCap);
			}

			// Update priceChange only if the value has changed
			const currentPriceChange = document.getElementById('priceChange')
				.innerText;
			if (currentPriceChange !== formattedPriceChange) {
				updateElementWithTransition('priceChange', formattedPriceChange);
			}
		})
		.catch(err => console.error('Error fetching token data:', err));
}

// Function to format numbers with commas for the integer part only
function formatNumber(num) {
	const [integerPart, decimalPart] = num.toString()
		.split('.');
	return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimalPart ? '.' + decimalPart : '');
}

// Function to update element with smooth transition
function updateElementWithTransition(elementId, newValue) {
	const element = document.getElementById(elementId);
	element.style.transition = 'opacity 0.5s ease';
	element.style.opacity = 0; // Fade out
	setTimeout(() => {
		element.innerText = newValue; // Update value
		element.style.opacity = 1; // Fade in
	}, 500); // Wait for fade out to complete
}

setInterval(fetchTokenData, 3000);

fetchTokenData();

// Token Distribution Chart
const distributionCtx = document.getElementById('distributionChart')
	.getContext('2d');
new Chart(distributionCtx, {
	type: 'doughnut',
	data: {
		labels: ['Liquidity', 'Development', 'Team', 'Advisors', 'Marketing'],
		datasets: [{
			data: [400000000, 250000000, 150000000, 100000000, 100000000],
			backgroundColor: [
				'#4f46e5',
				'#3b82f6',
				'#10b981',
				'#f59e0b',
				'#ef4444'
			],
			borderWidth: 0
		}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					color: '#6b7280',
					font: {
						size: 14
					}
				}
			}
		}
	}
});

// Unlock Schedule Chart
const unlockCtx = document.getElementById('unlockChart')
	.getContext('2d');
new Chart(unlockCtx, {
	type: 'line',
	data: {
		labels: ['Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'],
		datasets: [{
				label: 'Development',
				data: [8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
				borderColor: '#3b82f6',
				backgroundColor: '#4f46e510',
				fill: false,
				tension: 0.4
			},
			{
				label: 'Team',
				data: [4.17, 8.34, 12.51, 16.68, 20.85, 25.02, 29.19, 33.36, 37.53, 41.7, 45.87, 50.04, 54.21, 58.38, 62.55, 66.72, 70.89, 75.06, 79.23, 83.4, 87.57, 91.74, 95.91, 100],
				borderColor: '#10b981',
				backgroundColor: '#f59e0b10',
				fill: false,
				tension: 0.4
			},
			{
				label: 'Advisors',
				data: [5.56, 11.12, 16.68, 22.24, 27.8, 33.36, 38.92, 44.48, 50.04, 55.6, 61.16, 66.72, 72.28, 77.84, 83.4, 88.96, 94.52, 100, 100, 100, 100, 100, 100, 100, 100],
				borderColor: '#f59e0b',
				backgroundColor: '#10b98110',
				fill: false,
				tension: 0.4
			},
			{
				label: 'Marketing',
				data: [8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
				borderColor: '#ef4444',
				backgroundColor: '#3b82f610',
				fill: false,
				tension: 0.4
			}
		]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function(value) {
						return value + '%';
					}
				}
			}
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: function(context) {
						return context.dataset.label + ' Unlocked: ' + context.raw + '%';
					}
				}
			},
			legend: {
				position: 'bottom',
				labels: {
					color: '#6b7280',
					font: {
						size: 14
					}
				}
			}
		}
	}
});

document.querySelectorAll('a[href^="#"]')
	.forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();

			document.querySelector(this.getAttribute('href'))
				.scrollIntoView({
					behavior: 'smooth'
				});
		});
	});

// Show or hide the scroll-to-top button
window.onscroll = function() {
	const button = document.getElementById('scrollToTop');
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		button.style.display = "block";
	} else {
		button.style.display = "none";
	}
};

// Smooth scroll to top
document.getElementById('scrollToTop')
	.addEventListener('click', function() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});