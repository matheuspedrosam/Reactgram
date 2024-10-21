import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Cadastrar from './pages/Cadastrar/Cadastrar'
import Login from './pages/Login/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hook/useAuthContext'
import Profile from './pages/Profile/Profile'
import EditProfile from './pages/EditProfile/EditProfile'
import Footer from './components/Footer/Footer'
import Post from './pages/Post/Post'

function App() {
  const {user, setUser} = useAuthContext();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if(user){
      setUser(JSON.parse(user));
    }
  }, [])

  return (
    <BrowserRouter>
      <Header />

      <div id='pagesContainer'>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />}></Route>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />}></Route>
          <Route path="/cadastrar" element={!user ? <Cadastrar /> : <Navigate to="/" />}></Route>
          <Route path="/perfil/:id" element={user ? <Profile /> : <Navigate to="/" />}></Route>
          <Route path="/perfil/edit/:id" element={user ? <EditProfile /> : <Navigate to="/" />}></Route>
          <Route path="/posts/:id" element={user ? <Post /> : <Navigate to="/" />}></Route>
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}

export default App
