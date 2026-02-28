const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new Anthropic({ apiKey: "process.env.ANTHROPIC_API_KEY" });

app.post("/analyze", async (req, res) => {
  const { imageBase64 } = req.body;
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
          { type: "text", text: `Analiza el estilo de esta persona y responde SOLO con este JSON sin texto extra:
{"profile":"descripción del estilo en 2 oraciones","outfits":[{"name":"nombre outfit","occasion":"ocasión","items":["prenda1","prenda2","prenda3"],"brands":["marca1","marca2"]},{"name":"nombre outfit 2","occasion":"ocasión","items":["prenda1","prenda2","prenda3"],"brands":["marca1","marca2"]},{"name":"nombre outfit 3","occasion":"ocasión","items":["prenda1","prenda2","prenda3"],"brands":["marca1","marca2"]}]}` }
        ]
      }]
    });
    const text = response.content[0].text;
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al analizar" });
  }
});

app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));