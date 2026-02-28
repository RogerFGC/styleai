import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Error al analizar. Verifica que el servidor esté corriendo.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f0e8", fontFamily: "sans-serif", padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ color: "#d4af73", fontSize: "28px", marginBottom: "6px" }}>StyleAI</h1>
      <p style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>Sube tu foto y la IA analiza tu estilo</p>

      <label style={{ display: "block", border: "1.5px dashed #333", borderRadius: "16px", padding: "30px", textAlign: "center", cursor: "pointer", marginBottom: "16px" }}>
        {image ? <img src={image} alt="tu foto" style={{ width: "100%", borderRadius: "12px" }} /> : <span style={{ color: "#666" }}>📸 Haz clic para subir tu foto</span>}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </label>

      <button onClick={analyze} disabled={!imageBase64 || loading}
        style={{ width: "100%", padding: "14px", background: "#d4af73", color: "#0a0a0a", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "20px", letterSpacing: "1px" }}>
        {loading ? "Analizando..." : "✦ Analizar mi estilo"}
      </button>

      {result && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{ background: "rgba(212,175,115,0.08)", border: "1px solid #333", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ color: "#d4af73", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Tu perfil de estilo</p>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#ccc" }}>{result.profile}</p>
          </div>
          {result.outfits && result.outfits.map((o, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #222", borderRadius: "16px", padding: "16px", marginBottom: "12px" }}>
              <p style={{ color: "#f5f0e8", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{o.name}</p>
              <p style={{ color: "#666", fontSize: "11px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>{o.occasion}</p>
              <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "10px" }}>{o.items.join(" · ")}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {o.brands.map((b, j) => (
                  <span key={j} style={{ fontSize: "10px", color: "#d4af73", border: "1px solid rgba(212,175,115,0.3)", padding: "3px 10px", borderRadius: "8px", letterSpacing: "1px" }}>{b}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}