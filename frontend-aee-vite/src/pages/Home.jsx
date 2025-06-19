import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema</h1>
      <p>Essa é a página pública do sistema. Acesse o login para continuar.</p>
      <button onClick={() => navigate('/login')}>Ir para o Login</button>
    </div>
  );
}
