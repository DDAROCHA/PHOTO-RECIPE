import Backendless from "backendless";

//const APP_ID = "F405D13E-0A77-400C-ACBE-8146E8285936";
//const API_KEY = "BC70880E-34E2-4992-AB6C-C87592ED3A5B";

const APP_ID = "05468142-5DA0-43B0-9594-337F3F823345";
const API_KEY = "9FA7FFDE-408D-4AE5-B9BB-3D12352A0420";

Backendless.initApp(APP_ID, API_KEY);

// 🔹 Subir archivo a Backendless Files
export async function uploadImage(file) {
  const path = "uploads"; // carpeta en Files
  const result = await Backendless.Files.upload(file, path, true);
  return result.fileURL; // devuelve el URL público
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
