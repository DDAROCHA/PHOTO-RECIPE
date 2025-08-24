import Backendless from "backendless";

const APP_ID = "F405D13E-0A77-400C-ACBE-8146E8285936";
const API_KEY = "BC70880E-34E2-4992-AB6C-C87592ED3A5B";

Backendless.initApp(APP_ID, API_KEY);

// 🔹 Subir archivo a Files
export async function uploadImage(file, codigo) {
  const path = "uploads"; // carpeta en Backendless Files
  const result = await Backendless.Files.upload(file, path, true);
  return result.fileURL;
}

// 🔹 Guardar registro en Fotos
export async function saveFotoRecord(codigo, fotoUrl) {
  const Fotos = Backendless.Data.of("Fotos");
  return Fotos.save({
    Codigo: codigo,
    Foto: fotoUrl,
    Estado: "Pendiente",
  });
}

// 🔹 Buscar receta terminada
export async function getRecetaPorCodigo(codigo) {
  const Fotos = Backendless.Data.of("Fotos");
  const query = `Codigo = '${codigo}' AND Estado = 'Terminado'`;
  const results = await Fotos.find({ where: query });
  return results.length > 0 ? results[0] : null;
}
