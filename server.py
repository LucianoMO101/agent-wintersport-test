from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
import os
from dotenv import load_dotenv
import json

# 🔹 .env inladen
load_dotenv()

app = FastAPI()

# 🔹 CORS (zodat je frontend op localhost toegang heeft)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # evt. specifieker maken later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 🔹 Claude API initialiseren
anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


@app.post("/agent-query")
async def agent_query(req: Request):
    """Ontvangt de gebruikersvraag, stuurt deze naar Claude en retourneert filters in JSON."""
    data = await req.json()
    user_question = data.get("question", "")

    prompt = f"""
Je bent een slimme assistent die vragen over wintervakanties omzet in zoekfilters.
Geef ALLEEN een JSON terug in deze vorm:
{{
  "type": ["Hotel", "Hostel", "Appartement"],
  "prijs": ["Budget", "Middenklasse", "Luxe"],
  "regio": ["Oostenrijk", "Frankrijk", "Italië", "Zwitserland", "Duitsland", "Tsjechië"]
}}

Voorbeeld:
Vraag: "Waar kan ik goedkoop op wintervakantie in Oostenrijk?"
Antwoord:
{{
  "type": [],
  "prijs": ["Budget"],
  "regio": ["Oostenrijk"]
}}

Vraag: "{user_question}"
Antwoord:
    """

    try:
        # 🔹 Claude aanroepen
        response = anthropic.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=200,
            temperature=0,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # 🔹 Resultaat uitlezen
        content = response.content[0].text.strip()

        # Veilig proberen te parsen
        try:
            filters = json.loads(content)
        except json.JSONDecodeError:
            filters = {"type": [], "prijs": [], "regio": []}

        return {"filters": filters}

    except Exception as e:
        print("❌ Fout bij Claude:", e)
        return {"filters": {"type": [], "prijs": [], "regio": []}}

@app.get("/accommodaties")
def get_accommodaties(type: str = None, prijs: str = None, regio: str = None):
    """Geeft accommodaties terug (eventueel gefilterd)."""
    accommodaties = [
        {
            "Naam": "Hotel Alpenblick",
            "type": "Hotel",
            "prijs": "Middenklasse",
            "regio": "Oostenrijk",
            "beschrijving": "Gezellig hotel met uitzicht op de Alpen.",
            "faciliteiten": ["wifi", "ontbijt"]
        },
        {
            "Naam": "Hostel Prague Snow",
            "type": "Hostel",
            "prijs": "Budget",
            "regio": "Tsjechië",
            "beschrijving": "Betaalbaar hostel dicht bij de pistes.",
            "faciliteiten": ["wifi"]
        },
        {
            "Naam": "Appartement Matterhorn Luxe",
            "type": "Appartement",
            "prijs": "Luxe",
            "regio": "Zwitserland",
            "beschrijving": "Ruim appartement met uitzicht op de Matterhorn.",
            "faciliteiten": ["wifi", "wellness", "sauna"]
        },
    ]

    # 🔹 Filteren op basis van parameters (als ze aanwezig zijn)
    if type:
        accommodaties = [a for a in accommodaties if a["type"].lower() == type.lower()]
    if prijs:
        accommodaties = [a for a in accommodaties if a["prijs"].lower() == prijs.lower()]
    if regio:
        accommodaties = [a for a in accommodaties if a["regio"].lower() == regio.lower()]

    return accommodaties
