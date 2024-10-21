import "./PostComment.css"
import { MAIN_CONFIGS } from "../../../mainConfigs.js"

export default function PostComment({comment}) {
    return (
        <div className='comment'>
            <img src={`${MAIN_CONFIGS.API_URL}/api/files/users/${comment.user.profilePhoto}`} />
            <div>
                <h2>{comment.user.name}</h2>
                <p>{comment.comment}</p>
            </div>
        </div>
    )
}
