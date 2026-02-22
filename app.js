// Fonction pour calculer le score (Buffett x Simons)
function calculateScore(asset) {
    let valueScore = 0;
    let momentumScore = 0;

    const drawdownPercent = (asset.high52 - asset.price) / asset.high52;
    valueScore = (drawdownPercent / 0.20) * 50; 
    
    if (valueScore > 50) valueScore = 50;
    if (valueScore < 0) valueScore = 0;

    if (asset.price > asset.ma50) momentumScore += 25;
    if (asset.ma50 > asset.ma200) momentumScore += 25;

    return valueScore + momentumScore;
}

// Récupérer les données auto-générées par le robot Python
fetch('data.json')
    .then(response => response.json())
    .then(rawAssets => {
        // Appliquer la formule
        const assets = rawAssets.map(asset => {
            return { ...asset, score: calculateScore(asset) };
        });

        // Trier du meilleur au pire score
        assets.sort((a, b) => b.score - a.score);

        // Mettre à jour les médailles
        if(assets.length > 2) {
            document.getElementById('name1').innerText = assets[0].name;
            document.getElementById('score1').innerText = "Score: " + assets[0].score.toFixed(1);

            document.getElementById('name2').innerText = assets[1].name;
            document.getElementById('score2').innerText = "Score: " + assets[1].score.toFixed(1);

            document.getElementById('name3').innerText = assets[2].name;
            document.getElementById('score3').innerText = "Score: " + assets[2].score.toFixed(1);
        }

        // Mettre à jour la liste complète
        const assetListContainer = document.getElementById('asset-list');
        assetListContainer.innerHTML = ''; 

        assets.forEach(asset => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'asset-item';
            itemDiv.innerHTML = `
                <span class="asset-name">${asset.name}</span>
                <span class="asset-score">${asset.score.toFixed(1)} pts</span>
            `;
            assetListContainer.appendChild(itemDiv);
        });
    })
    .catch(error => {
        document.getElementById('asset-list').innerHTML = "<p>Données en cours de création par le robot. Revenez dans 2 minutes !</p>";
    });
 
