import { useState } from 'react'
import './Cadastrar.css'
import { Link, useNavigate } from "react-router-dom"
import useAuthHandle from '../../hook/useAuthHandle';

export default function Cadastrar() {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // Custom Hook
  const { handleRegister } = useAuthHandle();

  // Navigation
  const navigate = useNavigate();


  async function handleRegisterSubmit(e){
    e.preventDefault();
    setLoading(true);

    const singUpUser = {name, email, password, confirmPassword};

    try {
      await handleRegister(singUpUser);
      alert("Sucesso!");
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegisterSubmit} className='loginAndRegisterForm'>
      <h1>ReactGram</h1>

      <h3>Cadastre-se para ver a foto <br /> dos seus amigos.</h3>

      <div className='formInputsContainer'>
          <div>
            <input type="text" 
              placeholder='Nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='username'
              required
            />
          </div>
          <div>
          <input type="email" 
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
            />
          </div>
          <div>
          <input type="password" 
              placeholder='Senha' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
              required
            />
          </div>
          <div>
          <input type="password" 
              placeholder='Confirmar Senha' 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete='confirm-password'
              required
            />
          </div>
      </div>

      {!loading ? (<button>Cadastre-se</button>) : (<button disabled>Aguarde</button>) }

      {error && <p className='errorMessage'>{error}</p>}

      <hr />

      <p>Já tem conta? <Link to="/login">Clique aqui.</Link></p>

    </form>
  )
}
