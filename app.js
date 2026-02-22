// 1. Define your assets (Ticker / Name)
const assets = [
    { id: "SPY", name: "ETF S&P 500", score: Math.random() * 100 },
    { id: "URTH", name: "ETF World", score: Math.random() * 100 },
    { id: "MCHI", name: "ETF China & HK", score: Math.random() * 100 },
    { id: "VGK", name: "ETF Europe", score: Math.random() * 100 },
    { id: "VWO", name: "ETF Emerging", score: Math.random() * 100 },
    { id: "VYM", name: "ETF Dividend", score: Math.random() * 100 },
    { id: "BTC-USD", name: "Bitcoin", score: Math.random() * 100 },
    { id: "GC=F", name: "Gold", score: Math.random() * 100 },
    { id: "SI=F", name: "Silver", score: Math.random() * 100 },
    { id: "EURHKD=X", name: "HKD/EUR Rate", score: Math.random() * 100 },
    { id: "JPYHKD=X", name: "HKD/JPY Rate", score: Math.random() * 100 },
    // We will add the specific 15 stocks (5 EU, 5 US, 5 HK) later!
];

// 2. Sort the assets by score (Highest to Lowest)
assets.sort((a, b) => b.score - a.score);

// 3. Update the Top 3 Scoreboard
document.getElementById('name1').innerText = assets[0].name;
document.getElementById('score1').innerText = "Score: " + assets[0].score.toFixed(1);

document.getElementById('name2').innerText = assets[1].name;
document.getElementById('score2').innerText = "Score: " + assets[1].score.toFixed(1);

document.getElementById('name3').innerText = assets[2].name;
document.getElementById('score3').innerText = "Score: " + assets[2].score.toFixed(1);

// 4. Render the full list below the scoreboard
const assetListContainer = document.getElementById('asset-list');

assets.forEach(asset => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'asset-item';
    
    itemDiv.innerHTML = `
        <span class="asset-name">${asset.name}</span>
        <span class="asset-score">${asset.score.toFixed(1)} pts</span>
    `;
    
    assetListContainer.appendChild(itemDiv);
});
