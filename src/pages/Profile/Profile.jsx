import './Profile.css';
import { useAuthContext } from '../../hook/useAuthContext';
import { useEffect, useRef, useState } from 'react'
import { postsMockados } from '../../../dbMockado';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import useGetData from '../../hook/useGetData';
import { MAIN_CONFIGS } from '../../../mainConfigs';

export default function Profile() {
    const {user, setUser} = useAuthContext();
    const [userInfos, setUserInfos] = useState("");
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [reload, setReload] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const { getData } = useGetData();
    const { id } = useParams();
    const titleInput = useRef();
    const imageInput = useRef();
  
    useEffect(() => {
        async function getPosts(){
            try{
                const data = await getData("posts/my", user);
                setPosts(data);
            } catch (e) {
                setError(e.message)
            }
        }
        getPosts();
    }, [reload])

    useEffect(() => {
        async function getMe(){
            const res = await axios.get(`${MAIN_CONFIGS.API_URL}/api/users/${user["_id"]}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            setUserInfos(res.data);
        }
        getMe();
    }, [])

    async function handlePostSubmit(e){
        e.preventDefault();

        if(!title || !image) {
            setError("Deve haver Imagem e Título!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('userId', user["_id"]);
        formData.append('userName', user.name);
        formData.append('image', image);

        try{
            const res = await axios.post(`${MAIN_CONFIGS.API_URL}/api/posts/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(res.status === 201){
                setTitle("");
                setImage("");
                imageInput.current.value = "";
                alert("Sucesso!");
                setReload(res.data);
            }
        } catch (e){
            setError(e.message);
        } finally{
            setLoading(false);
            setError("");
        }
    }

    async function handleDeletePost(id){
        setLoading(true);

        try{
            const res = await axios.delete(`${MAIN_CONFIGS.API_URL}/api/posts/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if(res.status === 200){
                alert("Post removido!");
                setReload(res.data);
            }
        } catch (e){
            setError(e.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='profileContainer'>
            <div className="imgAndInfoProfileContainer">
                {!userInfos.profilePhoto &&
                    <img className='userPhoto' src={`https://cdn-icons-png.flaticon.com/512/149/149071.png`} alt="" />
                }
                {userInfos.profilePhoto && 
                    <img className='userPhoto' src={`${MAIN_CONFIGS.API_URL}/api/files/users/${userInfos.profilePhoto}`} alt="" />
                }
                <div>
                    <h2>{user.name}</h2>
                    <p>{user.bio ? user.bio : 'Escreva uma bio...'}</p>
                </div>
            </div>
            <div className='postFormContainer'>
                <h2 style={{marginBottom: 20}}>Compartilhe algum momento seu:</h2>
                <form onSubmit={handlePostSubmit}>
                    <div>
                        <label htmlFor="title">Título da postagem:</label>
                        <input 
                            type="text" 
                            id='title'
                            name='title'
                            value={title}
                            ref={titleInput}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Imagem</label>
                        <input 
                            type="file"
                            id='image'
                            name='image'
                            ref={imageInput}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                    {!loading 
                        ? (<button style={{marginTop: 40}}>Postar</button>) 
                        : (<button style={{marginTop: 40}} disabled>Aguarde</button>) 
                    }

                    {error && <p className='profile errorMessage'>{error}</p>}
                </form>
            </div>
            {loading && <p style={{marginTop: 20}}>Carregando...</p>}
            {!loading && 
                <div className='userPostsContainer'>
                    {!posts && <p>Ainda nenhum post, compartilhe algo...</p>}
                    {posts && posts.map((post) => {
                        return (
                            <div key={post["_id"]} className="userPosts">
                                <img src={`${MAIN_CONFIGS.API_URL}/api/files/posts/${post.image}`} alt="" />
                                <div className='profilePostsActionsContainer'>
                                    <Link to={`/posts/${post["_id"]}`}><span className='material-symbols-rounded'>visibility</span></Link>
                                    <Link to={`/posts/edit/${post["_id"]}`}><span className='material-symbols-rounded'>edit</span></Link>
                                    <span onClick={() => handleDeletePost(post["_id"])} className='material-symbols-rounded'>delete</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
