const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
app.post("/analyze", async (req, res) => {
  const { imageBase64 } = req.body;
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: "Analiza el estilo y responde SOLO JSON: {\"profile\":\"descripcion\",\"outfits\":[{\"name\":\"n\",\"occasion\":\"o\",\"items\":[\"i1\",\"i2\",\"i3\"],\"brands\":[\"b1\",\"b2\"]}]}" }
      ]}]
    });
    const json = JSON.parse(response.content[0].text.replace(/```json|```/g,"").trim());
    res.json(json);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});
app.listen(process.env.PORT || 3001, () => console.log("Servidor listo"));
```

