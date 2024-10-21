import { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from "react-router-dom"
import useAuthHandle from '../../hook/useAuthHandle';

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Custom Hook
  const { handleLogin } = useAuthHandle();

  // Navigation
  const navigate = useNavigate();

  async function handleLoginForm(e){
      e.preventDefault();
      setLoading(true);

      const user = {email, password};

      try {
        await handleLogin(user);
        alert("Sucesso!");
        navigate("/");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
  }

  return (
    <form onSubmit={handleLoginForm} className='loginAndRegisterForm'>
      <h1>ReactGram</h1>

      <h3>Faça Login para ver a foto <br /> dos seus amigos.</h3>

      <div className='formInputsContainer'>
          <div>
          <input type="text" 
              placeholder='E-mail'
              value={email}
              autoComplete='email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
          <input type="password" 
              placeholder='Senha'
              value={password}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
      </div>

      
      {!loading ? (<button>Entrar</button>) : (<button disabled>Aguarde</button>) }

      {error && <p className='errorMessage'>{error}</p>}

      <hr />

      <p>Ainda não tem conta? <Link to="/cadastrar">Clique aqui.</Link></p>

    </form>
  )
}

