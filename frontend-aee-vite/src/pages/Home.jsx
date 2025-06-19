import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Bem-vindo ao Sistema</h1>
        <p>Para acessar os recursos do sistema, utilize sua conta institucional. Clique abaixo para fazer login.</p>
        <button onClick={() => navigate('/login')}>
          Ir para o Login <span className="material-symbols-rounded">login</span>
        </button>
      </div>
    </div>
  )

}
