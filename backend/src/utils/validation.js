export function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    const calc = (t) => {
        let sum = 0;
        for (let i = 0; i < t - 1; i++) sum += Number(cpf[i]) * (t - i);
        const check = (sum * 10) % 11 % 10;
        return check;
    };
    return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
}

export function parseDateDDMMYYYY(str) {
    const [d, m, y] = String(str).split('/');
    if (!d || !m || !y) return null;
    const iso = new Date(`${y}-${m}-${d}T00:00:00Z`);
    if (isNaN(iso.getTime())) return null;
    return iso;
}
