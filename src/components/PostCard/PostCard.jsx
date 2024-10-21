import "./PostCard.css"
import { MAIN_CONFIGS } from "../../../mainConfigs.js"

export default function PostCard({post, user, children, handleLikePost}) {
  return (
    <div className='post'>
        <img src={`${MAIN_CONFIGS.API_URL}/api/files/posts/${post.image}`} alt="" />
        <div className='iterationsButtonsContainer'>
            <div>
            <span 
                onClick={(e) => handleLikePost(e, post["_id"])} 
                className={`material-symbols-rounded likeBtn ${post.likes.includes(user["_id"]) ? 'liked' : null}`}>
                favorite
            </span>
            <span>{post.likes.length}</span>
            </div>
            <div>
            <span className='material-symbols-rounded'>comment</span>
            <span>{post.comments.length}</span>
            </div>
        </div>
        <h2>{post.title}</h2>
        <h3>Publicado por: <span style={{fontWeight: 'bold'}}>{post.userName}</span></h3>
        {children}
    </div>
  )
}
