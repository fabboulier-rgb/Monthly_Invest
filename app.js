// 1. Fonction pour calculer le score (Buffett x Simons) - Version Granulaire
function calculateScore(asset) {
    let valueScore = 0;
    let momentumScore = 0;

    // --- SCORE BUFFETT (Valeur) ---
    // Baisse de 30% exigée pour avoir les 50 points complets (lissage proportionnel)
    const drawdownPercent = (asset.high52 - asset.price) / asset.high52;
    valueScore = (drawdownPercent / 0.30) * 50; 
    
    if (valueScore > 50) valueScore = 50;
    if (valueScore < 0) valueScore = 0;

    // --- SCORE SIMONS (Tendance) ---
    // Tendance 1 : Prix vs Moyenne 50 jours
    const diffMA50 = (asset.price - asset.ma50) / asset.ma50;
    if (diffMA50 > 0) {
        // 15 points de base + Bonus de force (max 10 pts)
        momentumScore += 15 + Math.min(diffMA50 * 100, 10);
    }

    // Tendance 2 : Moyenne 50 vs Moyenne 200 jours (Croisement en or)
    const diffMA200 = (asset.ma50 - asset.ma200) / asset.ma200;
    if (diffMA200 > 0) {
        // 15 points de base + Bonus de force (max 10 pts)
        momentumScore += 15 + Math.min(diffMA200 * 100, 10);
    }

    return valueScore + momentumScore;
}

// 2. Récupérer les données auto-générées par le robot Python
fetch('data.json')
    .then(response => response.json())
    .then(rawAssets => {
        // Appliquer la formule
        const assets = rawAssets.map(asset => {
            return { ...asset, score: calculateScore(asset) };
        });

        // Trier du meilleur au pire score
        assets.sort((a, b) => b.score - a.score);

        // 3. Mettre à jour les médailles du podium
        if(assets.length > 2) {
            // Astuce UI : Raccourcit "[HK] - Tencent (0700.HK)" en "Tencent" pour le podium
            const formatPodiumName = (fullName) => {
                return fullName.replace(/\[.*?\] - /, '').replace(/ \(.*?\)/, '');
            };

            document.getElementById('name1').innerText = formatPodiumName(assets[0].name);
            document.getElementById('score1').innerText = "Score: " + assets[0].score.toFixed(1);

            document.getElementById('name2').innerText = formatPodiumName(assets[1].name);
            document.getElementById('score2').innerText = "Score: " + assets[1].score.toFixed(1);

            document.getElementById('name3').innerText = formatPodiumName(assets[2].name);
            document.getElementById('score3').innerText = "Score: " + assets[2].score.toFixed(1);
        }

        // 4. Mettre à jour la liste complète en bas (avec les noms longs)
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
        document.getElementById('asset-list').innerHTML = "<p>Données en cours de synchronisation. Revenez dans 2 minutes !</p>";
    });
