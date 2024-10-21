import "./Header.css"
import { NavLink, useNavigate } from 'react-router-dom'
import ReactIcon from "../../assets/react.svg"
import { useAuthContext } from "../../hook/useAuthContext"
import useAuthHandle from "../../hook/useAuthHandle";

export default function Header() {
    const { user, setUser } = useAuthContext();
    const { handleSignOut } = useAuthHandle();

    async function handleLogoutClick(){
        await handleSignOut();
        useNavigate("/");
    }

    return (
        <header id="header">
            <div id="headerContainer">
                <div id="logo">
                    <img src={ReactIcon} alt="" />
                    <h1>Reactgram</h1>
                </div>
                <div id="searchInputContainer">
                    <input type="text" placeholder="Pesquisar" />
                    <span className="material-symbols-rounded">search</span>
                </div>
                <nav>
                    {user && 
                        <NavLink to="/">
                            <span className="material-symbols-rounded">home</span>
                        </NavLink>
                    }
                    {user && 
                        <NavLink to={`/perfil/${user["_id"]}`}>
                            <span className="material-symbols-rounded">photo_camera</span>
                        </NavLink>
                    }
                    {user && 
                        <NavLink to={`/perfil/edit/${user["_id"]}`}>
                            <span className="material-symbols-rounded">person</span>
                        </NavLink>
                    }
                    {user && 
                        <a href="" onClick={handleLogoutClick}>Sair</a>
                    }
                    {!user && <NavLink to="/login">Entrar</NavLink> }
                    {!user &&  <NavLink to="/cadastrar">Cadastrar</NavLink> }
                </nav>
            </div>
        </header>
    )
}
