import React, { useState } from "react";
import { runFlow, getRespuestaPorCodigo } from "../services/backend";
import { Spinner } from "../Components/Spinner/Spinner";
import { Input } from "../Components/Input/Input";
import "./Home.css";

export function Home() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (question) => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    const codigo = Date.now().toString(); // 🔹 código único
    setLoading(true);
    setAnswer("");

    try {
      await runFlow(question, codigo);

      // 🔹 Polling cada 2s hasta encontrar respuesta
      const checkInterval = setInterval(async () => {
        const registro = await getRespuestaPorCodigo(codigo);
        if (registro) {
          clearInterval(checkInterval);
          setAnswer(registro.Respuesta || "No response found.");
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      console.error("Error running flow:", err.message);
      setAnswer("There was an error getting the response");
      setLoading(false);
    }
  };

  return (
    <div className="page1-container">
      {/* Frutas animadas de fondo */}
      <div className="fruit">🍎</div>
      <div className="fruit">🍌</div>
      <div className="fruit">🍇</div>
      <div className="fruit">🍊</div>
      <div className="fruit">🍓</div>
      <div className="fruit">🍍</div>
      <div className="fruit">🥝</div>
      <div className="fruit">🍑</div>
      <div className="fruit">🍉</div>
      <div className="fruit">🍒</div>
      <div className="fruit">🍋</div>
      <div className="fruit">🍐</div>
      <div className="fruit">🍈</div>
      <div className="fruit">🥭</div>
      <div className="fruit">🍏</div>

      <h4>Ask me anything about fruits</h4>

      {/* Input para la pregunta */}
      <Input onSubmit={handleAsk} />

      {/* Recuadro de respuesta */}
      <div className="page1-block">
        {loading ? (
          <Spinner text="Thinking..." />
        ) : (
          <div
            className="page1-line"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}
      </div>
    </div>
  );
}
