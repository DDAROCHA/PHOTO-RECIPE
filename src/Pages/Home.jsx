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

    setSelectedImage(URL.createObjectURL(file)); // vista previa
    setAnswer("");
    setLoading(true);

    const codigo = Date.now().toString();

    try {
      // 🔹 Subir la imagen a Backendless Files
      const fotoUrl = await uploadImage(file, codigo);

      // 🔹 Crear registro en tabla Fotos
      await saveFotoRecord(codigo, fotoUrl);

      // 🔹 Polling hasta encontrar respuesta
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
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
      </label>

      {/* Vista previa de la imagen */}
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
