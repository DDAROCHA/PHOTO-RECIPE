import React, { useState, useRef } from "react"; 
import { Spinner } from "../Components/Spinner";
import {
  uploadImage,
  saveFotoRecord,
  getRecetaPorCodigo,
} from "../services/backend";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react"; 
import { ImageUploadButton } from "../Components/ImageUploadButton";
import "./Home.css";

export function Home() {
  // State to store the selected image preview
  const [selectedImage, setSelectedImage] = useState(null);
  // State to store the recipe response (HTML text)
  const [answer, setAnswer] = useState("");
  // State to track loading (spinner visibility)
  const [loading, setLoading] = useState(false);

  // Ref for the response container (used for auto-scrolling)
  const blockRef = useRef(null);

  // Handle image selection from the file input
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview of the image
    setSelectedImage(URL.createObjectURL(file));

    // Reset previous answer and enable loading state
    setAnswer("");
    setLoading(true);

    // Smoothly scroll to the response container after selecting the image
    setTimeout(() => {
      blockRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    // Generate a unique code (timestamp-based)
    const codigo = Date.now().toString();

    try {
      // Upload the file to Backendless (returns public URL)
      const fotoUrl = await uploadImage(file);

      // Save record in "Fotos" table: (Photo URL, Code, Status="Pending")
      await saveFotoRecord(codigo, fotoUrl);

      // Poll Backendless every 2s until we find a record with:
      // same "Codigo" and "Estado" = "Terminado"
      const checkInterval = setInterval(async () => {
        const registro = await getRecetaPorCodigo(codigo);
        if (registro) {
          clearInterval(checkInterval);
          // Insert the recipe (HTML format) into the answer state
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
      {/* Help icon linking to the instructions page */}
      <div className="help-icon">
        <Link to="/Page2">
          <HelpCircle size={28} />
        </Link>
      </div>

      {/* Title */}
      <h4 className="page-title">Upload a food photo to get the recipe</h4>

      {/* Custom button component for selecting an image */}
      <ImageUploadButton onChange={handleImageSelect} />

      {/* Show selected image preview */}
      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="Selected food" />
        </div>
      )}

      {/* Response container (spinner or recipe HTML) */}
      <div ref={blockRef} className="page1-block">
        {loading ? (
          <Spinner text="Fetching recipe... This may take a while with complex images or recipes!" />
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
