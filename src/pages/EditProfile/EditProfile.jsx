import { useAuthContext } from '../../hook/useAuthContext'
import './EditProfile.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MAIN_CONFIGS } from "../../../mainConfigs.js";

export default function EditProfile() {
    const {user, setUser} = useAuthContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userInfos, setUserInfos] = useState("");
    const [bio, setBio] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    const inputProfilePhoto = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        async function getMe(){
            const res = await axios.get(`${MAIN_CONFIGS.API_URL}/api/users/${user["_id"]}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            setName(res.data.name);
            setEmail(res.data.email);
            setBio(res.data.bio);
            setUserInfos(res.data);
        }
        getMe();
    }, [])

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('profilePhoto', profilePhoto);
        formData.append('bio', bio);

        try{
            const res = await axios.put(`${MAIN_CONFIGS.API_URL}/api/users/update/${user["_id"]}`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);

            if(res.status === 200){
                setName("");
                setEmail("");
                setBio("");
                setUserInfos("");
                inputProfilePhoto.current.value = "";

                alert("Sucesso!");
                navigate(`/perfil/${user["_id"]}`);
            }
        } catch (e){
            setError(e.message);
        } finally{
            setLoading(false);
            setError("");
        }
    }

    return (
        <form onSubmit={handleSubmit} className='loginAndRegisterForm editProfile'>
            <h1>Edite seu perfil</h1>

            {!userInfos.profilePhoto &&
                <img src={`https://cdn-icons-png.flaticon.com/512/149/149071.png`} alt="" />
            }
            {userInfos.profilePhoto && 
                <img src={`${MAIN_CONFIGS.API_URL}/api/files/users/${userInfos.profilePhoto}`} alt="" />
            }

            <h3>Adicione uma imagem de perfil e conte mais sobre você...</h3>

            <div className='formInputsContainer'>
                <div>
                    <input 
                        type="text" 
                        placeholder='Nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder='E-mail'
                        value={email}
                        disabled
                        required
                        />
                </div>
                <div>
                    <input
                        type="file" 
                        placeholder='Imagem do Perfil' 
                        ref={inputProfilePhoto}
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        />
                </div>
                <div>
                    <input
                        type="text" 
                        placeholder='Bio' 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                        />
                </div>
            </div>

            {!loading ? (<button>Editar Perfil</button>) : (<button disabled>Aguarde</button>) }    

            {error && <p className='errorMessage'>{error}</p>}
        </form>
    )
}
