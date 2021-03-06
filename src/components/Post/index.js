import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import "./styles.css";
import Comment from "../Comment";
import CommentForm from "../CommentForm";
import { func, string, array } from "prop-types";
import * as PostService from "../../api/PostService";
import Points from "../points";

function Post({ user, id, getPostsAgain, article, post, player }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setArticle] = useState(article);
  // const [editedUser, setUser] = useState(user.name);
  const [editedPost, setPost] = useState(post);
  const [editedPlayer, setPlayer] = useState(player);
  const [comments, setComments] = useState([]);

  const handleEdit = async () => {
    // console.log("handleedit");
    setIsEditing(!isEditing);
    //meaning submit is showing
    if (isEditing) {
      let editedBody = {
        article: editedArticle,
        // user: editedUser,
        post: editedPost,
        player: editedPlayer,
      };
      await PostService.update(id, editedBody);
      getPostsAgain();
    }
  };

  const handleDelete = async () => {
    await PostService.remove(id);
    getPostsAgain();
  };

  async function fetchComments(id) {
    let res = await PostService.getAllComments(id);
    if (res.status === 200) {
      setComments(res.data.data);
    }
  }

  useEffect(() => {
    fetchComments(id);
  }, []);

  // const user = props.user
  // console.log(user);

  return (
    <div className="posts">
      {/* <div>
      <p>
      <b>Post,</b>{user.name}
      </p>
      </div> */}
      <div className="post-body">
        <div className="top-posts">
          {!isEditing && <h4>{article}</h4>}
          {isEditing && (
            <input
              onChange={(e) => setArticle(e.target.value)}
              value={editedArticle}
              type="text"
              name="article"
              placeholder="TITLE"
            />
          )}
          <div>
            <button onClick={handleEdit}>
              {isEditing ? "SUBMIT" : "EDIT"}
            </button>
            <button onClick={handleDelete}>DELETE</button>
          </div>
        </div>
        <div className="middle-post">
          {!isEditing && <p>{post}</p>}
          {isEditing && (
            <input
              onChange={(e) => setPost(e.target.value)}
              value={editedPost}
              type="text"
              name="post"
              placeholder="POST"
            />
          )}
        </div>
        <div className="bottom-post">
          {!isEditing && <p>{player}</p>}
          {isEditing && (
            <input
              onChange={(e) => setPlayer(e.target.value)}
              value={editedPlayer}
              type="text"
              name="player"
              placeholder="SIGNATURE"
            />
          )}
        </div>
      </div>
      <div className="points">
        <Points />
      </div>
      <div className="comment-body">
        <div>
          <h4>Comments</h4>
          {comments.map((comment) => {
            return (
              <Comment
                user={comment.user}
                body={comment.body}
                key={comment._id}
                commentId={comment._id}
                id={id}
                getCommentsAgain={(id) => fetchComments(id)}
              />
            );
          })}
        </div>
        <div>
          <CommentForm
            id={id}
            getPostsAgain={() => getPostsAgain()}
            getCommentsAgain={(id) => fetchComments(id)}
          />
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  id: string.isRequired,
  article: string.isRequired,
  post: string.isRequired,
  player: string.isRequired,
  postComments: array,
  getPostsAgain: func,
  auth: PropTypes.object.isRequired,
};

export default Post;
