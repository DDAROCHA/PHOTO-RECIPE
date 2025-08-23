import Backendless from "backendless";

const APP_ID = "F405D13E-0A77-400C-ACBE-8146E8285936";
const API_KEY = "BC70880E-34E2-4992-AB6C-C87592ED3A5B";

Backendless.initApp(APP_ID, API_KEY);

const FLOWRUNNER_URL =
  "https://hotshotpower-us.backendless.app/api/automation/flow/E5756404-4189-49F3-BDE8-7FEE19F980DA/trigger/1666B887-3CC9-24F8-630C-26B80854583C/activate";

// 🔹 Enviar pregunta + código al flujo
export async function runFlow(question, codigo) {
  const response = await fetch(FLOWRUNNER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, codigo }),
  });

  if (!response.ok) {
    throw new Error("Flowrunner request failed");
  }
}

// 🔹 Buscar respuesta en tabla Respuestas
export async function getRespuestaPorCodigo(codigo) {
  const Respuestas = Backendless.Data.of("Respuestas");
  const query = `Codigo = '${codigo}'`;
  const results = await Respuestas.find({ where: query });
  return results.length > 0 ? results[0] : null;
}
