///home/sant/seduc_on/backend/src/routes/sed.routes.js
import express from "express";
import { validarUsuarioSED } from "../services/sed/validarUsuario.service.js";

const router = express.Router();

router.get("/sed/validar", async (req, res) => {
    try {
        const result = await validarUsuarioSED();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            erro: true,
            mensagem: "Falha ao validar usuário na SED"
        });
    }
});

export default router;
