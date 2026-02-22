// 1. Définition des actifs avec des données simulées (Prix, Plus Haut 52s, Moyenne 50j, Moyenne 200j)
const rawAssets = [
    // Exemple 1 : S&P 500 au plus haut historique (Mauvaise Valeur, Excellente Tendance)
    { id: "SPY", name: "ETF S&P 500", price: 510, high52: 512, ma50: 480, ma200: 440 },
    
    // Exemple 2 : ETF Chine qui s'est effondré mais commence à remonter (Bonne Valeur, Tendance Moyenne)
    { id: "MCHI", name: "ETF China & HK", price: 42, high52: 55, ma50: 40, ma200: 45 },
    
    // Exemple 3 : Bitcoin en pleine correction (Valeur Moyenne, Tendance Mauvaise à court terme)
    { id: "BTC-USD", name: "Bitcoin", price: 61000, high52: 73000, ma50: 64000, ma200: 55000 },
    
    // Exemple 4 : Or, très solide, petite correction (Le combo parfait pour notre algorithme)
    { id: "GC=F", name: "Gold", price: 2350, high52: 2450, ma50: 2300, ma200: 2100 },
    
    // Exemple 5 : Un actif en chute libre (Excellente Valeur, Tendance Catastrophique -> Couteau qui tombe)
    { id: "BAD", name: "Stock en faillite", price: 10, high52: 100, ma50: 30, ma200: 60 }
];

// 2. Le Moteur Quantitatif (Buffett x Simons)
function calculateScore(asset) {
    let valueScore = 0;
    let momentumScore = 0;

    // --- SCORE BUFFETT (Valeur) sur 50 points ---
    // On calcule la baisse par rapport au sommet (Drawdown). 
    // Si la baisse est de 20% ou plus, on donne 50 points (Très bon marché).
    const drawdownPercent = (asset.high52 - asset.price) / asset.high52;
    valueScore = (drawdownPercent / 0.20) * 50; 
    
    // On plafonne le score entre 0 et 50
    if (valueScore > 50) valueScore = 50;
    if (valueScore < 0) valueScore = 0;

    // --- SCORE SIMONS (Tendance) sur 50 points ---
    // 25 points si le prix est au-dessus de la moyenne à 50 jours (Tendance court terme positive)
    if (asset.price > asset.ma50) {
        momentumScore += 25;
    }
    // 25 points si la moyenne 50 jours est au-dessus de la 200 jours (Tendance long terme positive / Golden Cross)
    if (asset.ma50 > asset.ma200) {
        momentumScore += 25;
    }

    // --- SCORE TOTAL ---
    return valueScore + momentumScore;
}

// 3. Appliquer la formule à tous les actifs
const assets = rawAssets.map(asset => {
    return {
        ...asset,
        score: calculateScore(asset)
    };
});

// 4. Trier les actifs par score (Du plus haut au plus bas)
assets.sort((a, b) => b.score - a.score);

// 5. Mettre à jour l'interface HTML
document.getElementById('name1').innerText = assets[0].name;
document.getElementById('score1').innerText = "Score: " + assets[0].score.toFixed(1);

document.getElementById('name2').innerText = assets[1].name;
document.getElementById('score2').innerText = "Score: " + assets[1].score.toFixed(1);

document.getElementById('name3').innerText = assets[2].name;
document.getElementById('score3').innerText = "Score: " + assets[2].score.toFixed(1);

const assetListContainer = document.getElementById('asset-list');
assetListContainer.innerHTML = ''; // Nettoie la liste avant de la remplir

assets.forEach(asset => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'asset-item';
    itemDiv.innerHTML = `
        <span class="asset-name">${asset.name}</span>
        <span class="asset-score">${asset.score.toFixed(1)} pts</span>
    `;
    assetListContainer.appendChild(itemDiv);
});
 
