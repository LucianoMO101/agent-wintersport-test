# 🎿 AI Wintersport Agent

Een slimme AI-gebaseerde webapplicatie waarmee gebruikers hun ideale **wintervakantie-accommodatie** kunnen vinden.  
De gebruiker kan handmatig filters instellen of een natuurlijke vraag stellen aan een **AI Agent (Claude)** die automatisch de juiste filters selecteert.

---

## 🧩 Functionaliteit

### 🔹 1. Filtersysteem
Gebruikers kunnen accommodaties filteren op:
- **Type:** Hotel, Hostel, Appartement  
- **Prijs:** Budget, Middenklasse, Luxe  
- **Regio:** Oostenrijk, Frankrijk, Italië, Zwitserland, Duitsland, Tsjechië  

### 🔹 2. AI Agent
De gebruiker kan een vraag stellen zoals:
> “Waar kan ik goedkoop op wintervakantie in Oostenrijk?”

De AI Agent (via **Claude API**) analyseert de zin en vertaalt deze naar filters  
— bijvoorbeeld:  
```json
{
  "type": [],
  "prijs": ["Budget"],
  "regio": ["Oostenrijk"]
}

Deze filters worden automatisch toegepast op de resultaten.

🔹 3. Database
De accommodaties komen uit een SQL Server-database (via Node.js / Express backend).
De data wordt opgehaald en gefilterd op basis van de geselecteerde criteria.

🧱 Projectstructuur
test-agent/
├── css/
│   └── style.css
├── img/
│   └── (afbeeldingen van accommodaties)
├── js/
│   └── script.js
├── server.js          # Node.js + Express backend (SQL Server)
├── server.py          # FastAPI backend (Claude Agent)
├── index.html         # Frontend interface
├── .env               # Bevat je Claude API key (wordt niet gedeeld!)
├── .gitignore
├── package.json
├── requirements.txt
└── README.md

⚙️ Installatie & Setup
1️⃣ Vereisten
Zorg dat je het volgende hebt geïnstalleerd:
- Node.js (v18 of hoger)
- Python 3.9+
- pip
- SQL Server (lokaal of via container)
- Git

2️⃣ Repository clonen
git clone https://github.com/LucianoMO101/agent-wintersport-test.git
cd agent-wintersport-test

3️⃣ Node.js-omgeving opzetten
npm install

Start daarna de database-server:
node server.js

Dit draait de Express-API op (Kan je testen met Insomnia):
👉 http://localhost:3000/accommodaties

4️⃣ Python-omgeving (AI Agent)
Maak een virtuele omgeving (optioneel maar aanbevolen):
python3 -m venv venv
source venv/bin/activate      # macOS / Linux
venv\Scripts\activate         # Windows

Installeer dependencies:
pip install -r requirements.txt

Start de FastAPI-server:
uvicorn server:app --reload --port 8000

Nu draait:
👉 http://localhost:8000/agent-query

🚀 Project starten
1. Start SQL Server (met de juiste database WintersportDB)
2. Start Node.js backend:
  node server.js
3. Start Python backend:
  uvicorn server:app --reload --port 8000
4. Open index.html in je browser
(of via Live Server in VS Code)



👨‍💻 Auteur
Luciano Mollen
📍 Project: AI Wintersport Agent
🌐 GitHub: LucianoMO101











