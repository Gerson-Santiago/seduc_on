import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = "http://localhost:3000/api/sed";
const API_KEY = process.env.TEST_API_KEY;

async function testarSegurancaRotas() {
    console.log("=== Teste de Segurança das Rotas SED ===");
    console.log(`Alvo: ${BASE_URL}/token`);

    if (!API_KEY) {
        console.error("❌ ERRO: TEST_API_KEY não definida no .env");
        return;
    }

    // 1. Teste Sem Autenticação
    console.log("\n1. Tentando acesso SEM credenciais...");
    try {
        const res = await fetch(`${BASE_URL}/token`);
        if (res.status === 401) {
            console.log("✅ Bloqueado corretamente (401 Unauthorized)");
        } else {
            console.error(`❌ FALHA: Esperado 401, recebeu ${res.status}`);
        }
    } catch (err) {
        console.error("Erro de conexão (O servidor está rodando?):", err.message);
    }

    // 2. Teste com API Key Inválida
    console.log("\n2. Tentando acesso com API Key INVÁLIDA...");
    try {
        const res = await fetch(`${BASE_URL}/token`, {
            headers: { "x-api-key": "chave-errada-123" }
        });
        if (res.status === 401) {
            console.log("✅ Bloqueado corretamente (401 Unauthorized)");
        } else {
            console.error(`❌ FALHA: Esperado 401, recebeu ${res.status}`);
        }
    } catch (err) {
        console.error("Erro:", err.message);
    }

    // 3. Teste com API Key Válida
    console.log("\n3. Tentando acesso com API Key VÁLIDA...");
    try {
        const res = await fetch(`${BASE_URL}/token`, {
            headers: { "x-api-key": API_KEY }
        });

        if (res.status === 200) {
            const data = await res.json();
            console.log("✅ Acesso PERMITIDO (200 OK)");
            console.log("Token recebido:", data.token ? data.token.substring(0, 20) + "..." : "Nenhum");
        } else {
            console.error(`❌ FALHA: Esperado 200, recebeu ${res.status}`);
            const text = await res.text();
            console.log("Resposta:", text);
        }
    } catch (err) {
        console.error("Erro:", err.message);
    }

    console.log("\n=== Fim do Teste de Segurança ===");
}

testarSegurancaRotas();
