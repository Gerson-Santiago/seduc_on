import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configurar dotenv para ler do arquivo .env na raiz do backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function testarIntegracaoSED() {
    console.log("=== Iniciando Teste de Integração SED ===");

    // Verifica variáveis de ambiente
    if ((!process.env.LOGIN_SED && !process.env.LOGIN_AUTH_SED) || !process.env.SED_AUTH || !process.env.URL_VALIDASED) {
        console.error("ERRO: Variáveis de ambiente (LOGIN_SED ou LOGIN_AUTH_SED, SED_AUTH, URL_VALIDASED) não configuradas.");
        console.error("Verifique se o arquivo .env está na raiz do backend e contém essas chaves.");
        return;
    }

    // Importação dinâmica para garantir que as variáveis de ambiente já estejam carregadas
    const { sedService } = await import("../src/services/sed/sed.service.js");

    try {
        console.log("\n1. Testando obtenção de token (getToken)...");
        const token1 = await sedService.getToken();
        console.log("✅ Token 1 obtido:", token1 ? (token1.substring(0, 20) + "...") : "NULO");

        console.log("\n2. Testando cache (chamando getToken novamente)...");
        const start = Date.now();
        const token2 = await sedService.getToken();
        const duration = Date.now() - start;

        if (token1 === token2 && duration < 100) {
            console.log(`✅ Cache funcionando! Token retornado em ${duration}ms.`);
        } else {
            console.warn(`⚠️ Atenção: Token diferente ou demorou muito (${duration}ms). Cache pode não estar funcionando.`);
        }

        console.log("\n3. Testando validação direta (validarUsuario)...");
        const validacao = await sedService.validarUsuario();
        console.log("✅ Resposta da validação direta:", JSON.stringify(validacao, null, 2));

    } catch (error) {
        console.error("\n❌ Erro durante o teste:", error.message);
        if (error.cause) console.error("Causa:", error.cause);
    }

    console.log("\n=== Fim do Teste ===");
}

testarIntegracaoSED();
