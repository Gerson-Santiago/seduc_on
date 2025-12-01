// /home/sant/seduc_on/backend/src/routes/sed.routes.js
import express from "express";
import { sedService } from "../services/sed/sed.service.js";

const router = express.Router();

// Rota para obter um token válido (usa o cache/refresh automático)
// GET /api/sed/token
router.get("/token", async (req, res) => {
    try {
        const token = await sedService.getToken();
        res.json({
            success: true,
            token: token,
            message: "Token obtido com sucesso (gerenciado automaticamente)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensagem: "Falha ao obter token SED",
            erro: error.message
        });
    }
});

// Rota para forçar validação direta (debug)
// GET /api/sed/validar-debug
router.get("/validar-debug", async (req, res) => {
    try {
        const result = await sedService.validarUsuario();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            erro: true,
            mensagem: "Falha ao validar usuário na SED (Debug)",
            detalhes: error.message
        });
    }
});

// Rota para limpar cache (debug/admin)
// POST /api/sed/limpar-token
router.post("/limpar-token", (req, res) => {
    sedService.clearToken();
    res.json({ success: true, message: "Cache de token limpo." });
});

export default router;
