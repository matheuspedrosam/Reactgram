import { useEffect, useReducer, useState } from 'react';
import './Home.css';
import { postsMockados } from '../../../dbMockado';
import { useAuthContext } from '../../hook/useAuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/PostCard/PostCard';
import { MAIN_CONFIGS } from "../../../mainConfigs.js";

function postsReducer(state, action){
  const {type, posts, idUpdatedPost, newPost} = action;

  switch(type){
    case "ADD":
      return posts;
  
    case "UPDATE":
      return state.map((oldPost) => oldPost["_id"] === idUpdatedPost ? newPost : oldPost)

    default:
      return state
  } 
}

export default function Home() {
  const [posts, dispatchPosts] = useReducer(postsReducer, []);
  const {user, setUser} = useAuthContext();
  const api = `${MAIN_CONFIGS.API_URL}/api/posts`

  useEffect(() => {
    async function getData(){
      const res = await axios.get(api, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      dispatchPosts({type: "ADD", posts: res.data});
      return res;
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
        dispatchPosts({
          type: "UPDATE", 
          idUpdatedPost: res.data["_id"],
          newPost: res.data
        })
        e.target.classList.add("liked");
      }
    } else if(!e.target.classList.contains("liked")) {
      const res = await axios.put(`${api}/like/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if(res.status === 200){
        dispatchPosts({
          type: "UPDATE", 
          idUpdatedPost: res.data["_id"],
          newPost: res.data
        })
        e.target.classList.remove("liked");
      }
    }
  }

  return (
    <>
      {posts && posts.map((post) => (
        <PostCard key={post["_id"]} post={post} user={user} handleLikePost={handleLikePost}>
          <Link to={`/posts/${post["_id"]}`}>
              <button>Ver mais</button>
          </Link>
        </PostCard>
      ))}
    </>
  )
}
