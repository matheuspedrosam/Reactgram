import './Post.css';
import { useEffect, useState, useReducer } from 'react';
import { useAuthContext } from '../../hook/useAuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/PostCard/PostCard';
import PostComment from '../../components/PostComment/PostComment';
import { MAIN_CONFIGS } from '../../../mainConfigs.js';

export default function Post() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const {user, setUser} = useAuthContext();
  const { id } = useParams();
  const api = `${MAIN_CONFIGS.API_URL}/api/posts`

  useEffect(() => {
    async function getData(){
      const res = await axios.get(`${api}/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      console.log(res.data);
      setPost(res.data);
    }
    getData();
  }, [])

  async function handleLikePost(e, id){
    if(e.target.classList.contains("liked")){
      const res = await axios.put(`${api}/deslike/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if(res.status === 200){
        setPost(res.data)
        e.target.classList.add("liked");
      }
    } else if(!e.target.classList.contains("liked")) {
      const res = await axios.put(`${api}/like/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if(res.status === 200){
        setPost(res.data)
        e.target.classList.remove("liked");
      }
    }
  }

  async function handleCommentForm(e){
    e.preventDefault();

    const sendComment = {comment: comment};

    const res = await axios.put(`${api}/comment/${post["_id"]}`, sendComment, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    if(res.status === 200){
      setPost(res.data);
      alert("Sucesso!");
      setComment("");
    }
  }

  return (
    <>
      {post && 
        <PostCard post={post} user={user} handleLikePost={handleLikePost}>
          <form onSubmit={handleCommentForm} className='postCommentForm'>
            <h2 style={{fontSize: 20, marginBottom: 20}}>Comentários: ({post.comments.length})</h2>
            <input 
              type="text" 
              name="comment" 
              id="comment" 
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
              placeholder='Comente sobre...'/>
            <button>Comentar</button>
          </form>
          {post.comments && post.comments.length == 0 && <p>Ainda nenhum comentário...</p>}
          {post.comments && post.comments.length > 0 &&
            post.comments.map((comment) => <PostComment key={comment["_id"]} comment={comment}/>)
          }
        </PostCard>
      }
    </>
  )
}
