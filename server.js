import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());

// 🔧 SQL Server configuratie
const config = {
  user: "sa",
  password: "MyStrongPwd@2025",
  server: "localhost",
  database: "WintersportDB",
  options: {
    encrypt: false, // voor lokale verbinding
    trustServerCertificate: true
  }
};

// 📦 Endpoint: alle accommodaties ophalen
app.get("/accommodaties", async (req, res) => {
  try {
    // Maak verbinding met SQL Server
    const pool = await sql.connect(config);

    // Haal data op
    const result = await pool.request().query(`
      SELECT Id, Naam, Details
      FROM Accommodaties
    `);

    // Parse JSON in de kolom 'Details'
    const data = result.recordset.map(row => ({
      Id: row.Id,
      Naam: row.Naam,
      ...JSON.parse(row.Details)
    }));

    res.json(data);
  } catch (err) {
    console.error("Fout bij ophalen data:", err);
    res.status(500).send("Databasefout");
  }
});

// 🚀 Server starten
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server draait op http://localhost:${PORT}`));
