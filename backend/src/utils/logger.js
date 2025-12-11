import winston from 'winston';

const { combine, timestamp, json, printf } = winston.format;

// Lista de chaves sensíveis para ofuscar
const SENSITIVE_KEYS = ['password', 'senha', 'token', 'authorization', 'access_token', 'refresh_token'];

// Lista de chaves parcialmente ofuscadas (ex: email)
const PARTIAL_MASK_KEYS = ['email'];

/**
 * Formatador customizado para ofuscar dados sensíveis
 */
export const sensitiveDataRedactor = winston.format((info) => {
    const maskSensitive = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;

        // Se for array, percorre itens
        if (Array.isArray(obj)) {
            return obj.map(maskSensitive);
        }

        const newObj = { ...obj };

        for (const key in newObj) {
            const lowerKey = key.toLowerCase();

            if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
                newObj[key] = '***REDACTED***';
            } else if (PARTIAL_MASK_KEYS.includes(lowerKey) && typeof newObj[key] === 'string') {
                // Mascara emails: gerson@email.com -> g*****@email.com
                const parts = newObj[key].split('@');
                if (parts.length === 2) {
                    newObj[key] = `${parts[0].substring(0, 1)}*****@${parts[1]}`;
                }
            } else if (typeof newObj[key] === 'object') {
                newObj[key] = maskSensitive(newObj[key]);
            }
        }
        return newObj;
    };

    return maskSensitive(info);
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp(),
        sensitiveDataRedactor(),
        json()
    ),
    transports: [
        new winston.transports.Console()
    ],
});

export default logger;
