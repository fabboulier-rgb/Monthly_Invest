import yfinance as yf
import json
import pandas as pd

# Dictionnaire associant le symbole boursier à votre nom personnalisé
ASSETS_MAPPING = {
    # --- LES ETFS & MACRO ---
    "SPY": "[ETF] - S&P 500",
    "URTH": "[ETF] - World",
    "MCHI": "[ETF] - China & HK",
    "VGK": "[ETF] - Europe",
    "VWO": "[ETF] - Emerging Markets",
    "VYM": "[ETF] - Dividends",
    
    # --- CRYPTO, FOREX & MÉTAUX ---
    "BTC-USD": "[CRYPTO] - Bitcoin",
    "GC=F": "[METAL] - Gold",
    "SI=F": "[METAL] - Silver",
    "EURHKD=X": "[FOREX] - EUR/HKD",
    "JPYHKD=X": "[FOREX] - JPY/HKD",

    # --- ACTIONS US ---
    "AAPL": "[US] - Apple",
    "MSFT": "[US] - Microsoft",
    "AMZN": "[US] - Amazon",
    "JNJ": "[US] - Johnson & Johnson",
    "JPM": "[US] - JPMorgan",

    # --- ACTIONS EUROPE ---
    "MC.PA": "[EU] - LVMH",
    "ASML.AS": "[EU] - ASML",
    "SAP.DE": "[EU] - SAP",
    "TTE.PA": "[EU] - TotalEnergies",
    "NOVO-B.CO": "[EU] - Novo Nordisk",

    # --- ACTIONS HONG KONG ---
    "0700.HK": "[HK] - Tencent",
    "9988.HK": "[HK] - Alibaba",
    "0005.HK": "[HK] - HSBC",
    "1211.HK": "[HK] - BYD",
    "1299.HK": "[HK] - AIA Group"
}

results = []

for ticker, custom_name in ASSETS_MAPPING.items():
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty: continue

        price = hist['Close'].iloc[-1]
        high52 = hist['High'].max()
        ma50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        ma200 = hist['Close'].rolling(window=200).mean().iloc[-1]

        if pd.isna(ma200): ma200 = hist['Close'].mean()
        if pd.isna(ma50): ma50 = hist['Close'].mean()

        results.append({
            "id": ticker,
            "name": f"{custom_name} ({ticker})",  # <-- L'ajout automatique des parenthèses est ici !
            "price": float(price),
            "high52": float(high52),
            "ma50": float(ma50),
            "ma200": float(ma200)
        })
    except Exception as e:
        print(f"Erreur avec {ticker}: {e}")

with open('data.json', 'w') as f:
    json.dump(results, f)
 
