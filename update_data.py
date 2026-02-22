import yfinance as yf
import json
import pandas as pd

# Votre liste complète d'actifs
tickers = [
    "SPY", "URTH", "MCHI", "VGK", "VWO", "VYM", 
    "BTC-USD", "GC=F", "SI=F", "EURHKD=X", "JPYHKD=X",
    "AAPL", "MSFT", "AMZN", "JNJ", "JPM",
    "MC.PA", "ASML.AS", "SAP.DE", "TTE.PA", "NOVO-B.CO",
    "0700.HK", "9988.HK", "0005.HK", "1211.HK", "1299.HK"
]

results = []
for ticker in tickers:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty: continue

        price = hist['Close'].iloc[-1]
        high52 = hist['High'].max()
        ma50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        ma200 = hist['Close'].rolling(window=200).mean().iloc[-1]

        # Sécurité si historique trop court
        if pd.isna(ma200): ma200 = hist['Close'].mean()
        if pd.isna(ma50): ma50 = hist['Close'].mean()

        results.append({
            "id": ticker,
            "name": ticker,
            "price": float(price),
            "high52": float(high52),
            "ma50": float(ma50),
            "ma200": float(ma200)
        })
    except Exception as e:
        print(f"Erreur avec {ticker}: {e}")

with open('data.json', 'w') as f:
    json.dump(results, f)
