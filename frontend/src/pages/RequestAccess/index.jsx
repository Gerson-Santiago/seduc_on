// frontend/src/pages/RequestAccess/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INSTITUTION_DOMAIN = import.meta.env.VITE_INSTITUTION_DOMAIN;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default function RequestAccess() {
    const [form, setForm] = useState({
        nome_completo: '',
        registro_funcional: '',
        contador_registro_funcional: '',
        cargo: '',
        setor: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validações básicas no cliente
        if (!form.nome_completo || !form.registro_funcional || !form.email) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        if (!form.email.endsWith(`@${INSTITUTION_DOMAIN}`)) {
            setError(`E-mail deve ser institucional @${INSTITUTION_DOMAIN}`);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/access-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const body = await res.json();
                setError(body.message || 'Erro ao enviar solicitação.');
                return;
            }

            setSuccess('Solicitação enviada com sucesso! Aguarde a aprovação.');
            // Limpar formulário ou redirecionar após um tempo?
            // setForm({}); 
        } catch (err) {
            console.error(err);
            setError('Servidor fora do ar. Tente novamente mais tarde.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f2f5',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '90%'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Solicitar Acesso</h1>

                {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '1rem', borderRadius: '8px' }}>{error}</div>}
                {success && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '8px' }}>{success}</div>}

                {!success && (
                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>Nome Completo *</label>
                            <input
                                type="text"
                                name="nome_completo"
                                value={form.nome_completo}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>Registro Funcional *</label>
                                    <input
                                        type="number"
                                        name="registro_funcional"
                                        value={form.registro_funcional}
                                        onChange={handleChange}
                                        placeholder="Ex: 6061"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>Contrato</label>
                                    <input
                                        type="number"
                                        name="contador_registro_funcional"
                                        value={form.contador_registro_funcional}
                                        onChange={handleChange}
                                        placeholder="Ex: 1"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CPF input removed */}
                        {/* Data de Nascimento input removed */}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>Cargo</label>
                                <input
                                    type="text"
                                    name="cargo"
                                    value={form.cargo}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>Setor</label> {/* Changed from Diretoria to Setor */}
                                <input
                                    type="text"
                                    name="setor" // Changed name to setor
                                    value={form.setor} // Changed value to form.setor
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#555' }}>E-mail Institucional *</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={`seu.nome@${INSTITUTION_DOMAIN}`}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                marginTop: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            Enviar solicitação de acesso
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                        Voltar para Login
                    </button>
                </div>
            </div>
        </div>
    );
}