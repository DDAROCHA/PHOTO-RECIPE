import React, { useState } from "react";
import { Spinner } from "../Components/Spinner/Spinner";
import { uploadImage, saveFotoRecord, getRecetaPorCodigo } from "../services/backend";
import "./Home.css";

export function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vista previa local
    setSelectedImage(URL.createObjectURL(file));
    setAnswer("");
    setLoading(true);

    const codigo = Date.now().toString(); // 🔹 Código único

    try {
      // 1. Subir la imagen a Backendless Files
      const fotoUrl = await uploadImage(file);

      // 2. Crear registro en tabla Fotos
      await saveFotoRecord(codigo, fotoUrl);

      // 3. Polling hasta encontrar Estado = "Terminado"
      const checkInterval = setInterval(async () => {
        const registro = await getRecetaPorCodigo(codigo);
        if (registro) {
          clearInterval(checkInterval);
          setAnswer(registro.Receta || "No recipe found.");
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      console.error("Error processing image:", err.message);
      setAnswer("There was an error processing the image.");
      setLoading(false);
    }
  };

  return (
    <div className="page1-container">
      <h4>Upload a food photo to get the recipe</h4>

      {/* Botón para seleccionar imagen */}
      <label className="select-image-btn">
        Select Image
        <input
          type="file"
          accept="image/*"
          capture="environment" // permite cámara en móviles
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
      </label>

      {/* Vista previa */}
      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="Selected food" />
        </div>
      )}

      {/* Recuadro de respuesta */}
      <div className="page1-block">
        {loading ? (
          <Spinner text="Fetching recipe..." />
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
