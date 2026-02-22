// 1. Fonction pour calculer le score (Buffett x Simons)
function calculateScore(asset) {
    let valueScore = 0;
    let momentumScore = 0;

    const drawdownPercent = (asset.high52 - asset.price) / asset.high52;
    valueScore = (drawdownPercent / 0.30) * 50; 
    
    if (valueScore > 50) valueScore = 50;
    if (valueScore < 0) valueScore = 0;

    const diffMA50 = (asset.price - asset.ma50) / asset.ma50;
    if (diffMA50 > 0) momentumScore += 15 + Math.min(diffMA50 * 100, 10);

    const diffMA200 = (asset.ma50 - asset.ma200) / asset.ma200;
    if (diffMA200 > 0) momentumScore += 15 + Math.min(diffMA200 * 100, 10);

    return {
        total: valueScore + momentumScore,
        value: valueScore,
        momentum: momentumScore,
        drawdown: drawdownPercent
    };
}

// 2. NOUVEAU : Le moteur d'analyse "IA" (Système Expert Quantitatif)
function generateAIAnalysis(asset, metrics) {
    let confidence = 50; // Confiance de base
    let insight = "";

    // Calcul de la confiance
    if (asset.ma50 > asset.ma200) confidence += 25; // Tendance long terme OK
    if (asset.price > asset.ma50) confidence += 15; // Tendance court terme OK
    if (metrics.drawdown > 0.10 && metrics.drawdown < 0.40) confidence += 10; // Décote saine
    if (metrics.drawdown >= 0.50) confidence -= 30; // Risque de krach/faillite

    // Plafond et plancher de la confiance
    confidence = Math.min(Math.max(confidence, 10), 99);

    // Génération du texte selon le profil (Sentiment)
    if (metrics.value >= 40 && metrics.momentum < 10) {
        insight = "🔴 Danger (Couteau qui tombe) : L'actif est fortement bradé, mais la tendance reste lourdement baissière. Attendre une stabilisation.";
    } else if (metrics.value >= 30 && metrics.momentum >= 30) {
        insight = "🟢 Opportunité Rare (Combo) : Forte décote combinée à une reprise haussière confirmée. Signal d'achat fort.";
    } else if (metrics.value < 10 && metrics.momentum >= 35) {
        insight = "🟠 Momentum Pur (Surachat) : L'actif est proche de ses records historiques. Tendance excellente, mais marge de sécurité de Buffett quasi nulle.";
    } else if (metrics.value > 15 && metrics.momentum >= 15 && metrics.momentum < 30) {
        insight = "🔵 Pullback (Respiration) : L'actif corrige légèrement mais conserve des bases solides. Bon point d'entrée progressif.";
    } else {
        insight = "⚪ Zone Neutre : Les signaux sont mixtes. Pas de forte conviction mathématique sur ce profil actuellement.";
    }

    return { confidence: Math.round(confidence), insight: insight };
}

// 3. Récupérer et afficher les données
fetch('data.json')
    .then(response => response.json())
    .then(rawAssets => {
        
        // Enrichir les actifs avec les nouveaux calculs
        const assets = rawAssets.map(asset => {
            const metrics = calculateScore(asset);
            const aiData = generateAIAnalysis(asset, metrics);
            return { 
                ...asset, 
                score: metrics.total,
                confidence: aiData.confidence,
                insight: aiData.insight
            };
        });

        // Tri
        assets.sort((a, b) => b.score - a.score);

        // Mise à jour du podium (Top 3)
        if(assets.length > 2) {
            const formatPodiumName = (fullName) => fullName.replace(/\[.*?\] - /, '').replace(/ \(.*?\)/, '');

            document.getElementById('name1').innerText = formatPodiumName(assets[0].name);
            document.getElementById('score1').innerText = "Score: " + assets[0].score.toFixed(1);

            document.getElementById('name2').innerText = formatPodiumName(assets[1].name);
            document.getElementById('score2').innerText = "Score: " + assets[1].score.toFixed(1);

            document.getElementById('name3').innerText = formatPodiumName(assets[2].name);
            document.getElementById('score3').innerText = "Score: " + assets[2].score.toFixed(1);
        }

        // 4. NOUVEAU : Mise à jour de la liste complète avec le rapport IA
        const assetListContainer = document.getElementById('asset-list');
        assetListContainer.innerHTML = ''; 

        assets.forEach(asset => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'asset-item';
            // Nouveau design de carte pour la liste
            itemDiv.innerHTML = `
                <div class="asset-header" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px;">
                    <span class="asset-name" style="font-weight: bold; font-size: 1rem;">${asset.name}</span>
                    <div style="text-align: right;">
                        <span class="asset-score" style="color: #007bff; font-weight: bold; display: block; font-size: 1.1rem;">${asset.score.toFixed(1)} pts</span>
                        <span style="font-size: 0.75rem; color: #666;">Confiance: ${asset.confidence}%</span>
                    </div>
                </div>
                <div class="ai-insight" style="font-size: 0.85rem; color: #444; line-height: 1.4;">
                    <strong>🤖 IA :</strong> <em>${asset.insight}</em>
                </div>
            `;
            assetListContainer.appendChild(itemDiv);
        });
    })
    .catch(error => {
        document.getElementById('asset-list').innerHTML = "<p>Erreur ou données en cours de synchronisation...</p>";
    });
 
