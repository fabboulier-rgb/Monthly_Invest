// Fonction pour calculer le score (Buffett x Simons) - Version Granulaire
function calculateScore(asset) {
    let valueScore = 0;
    let momentumScore = 0;

    // --- SCORE BUFFETT (Valeur) ---
    // Il faut une baisse de 30% pour avoir les 50 points complets.
    const drawdownPercent = (asset.high52 - asset.price) / asset.high52;
    valueScore = (drawdownPercent / 0.30) * 50; 
    
    if (valueScore > 50) valueScore = 50;
    if (valueScore < 0) valueScore = 0;

    // --- SCORE SIMONS (Tendance) ---
    // Tendance 1 : Prix vs Moyenne 50 jours
    const diffMA50 = (asset.price - asset.ma50) / asset.ma50;
    if (diffMA50 > 0) {
        // 15 points validés + Bonus de force (1 point par pourcentage d'écart, max 10 pts)
        momentumScore += 15 + Math.min(diffMA50 * 100, 10);
    }

    // Tendance 2 : Moyenne 50 vs Moyenne 200 jours (Croisement en or)
    const diffMA200 = (asset.ma50 - asset.ma200) / asset.ma200;
    if (diffMA200 > 0) {
        // 15 points validés + Bonus de force
        momentumScore += 15 + Math.min(diffMA200 * 100, 10);
    }

    return valueScore + momentumScore;
}
 
