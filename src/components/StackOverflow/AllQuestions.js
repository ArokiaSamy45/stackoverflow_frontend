import { Avatar } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import "./css/AllQuestions.css";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import { stringAvatar } from "../../utils/Avatar";
import axios from "axios";
import { useHistory } from 'react-router-dom';


function AllQuestions({ data, userId }) {
  const [votes, setVotes] = useState(data.votes || 0);
  const [views, setViews] = useState(data.views || 0);
  const isMounted = useRef(true);
  const history = useHistory();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setVotes(data.votes || 0);
    }
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  let tags = [];

  try {
    tags = JSON.parse(data?.tags[0]) || [];
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // Handle the error or set tags to a default value
    tags = [];
  }

  async function handleViewIncrement(questionId) {
  try {
    const response = await axios.post(`/api/questions/${data?._id}/increment-views`);
    console.log("View Count Response:", response);

    if (response.status === 200 && isMounted.current) {
      setViews((prevViews) => prevViews + 1);
      
      // Redirect to another page after the POST request is successful
      history.push(`/question?q=${questionId}`);
    }
  } catch (error) {
    console.error("Error updating view count:", error);
  }
}


  return (
    <div className="all-questions">
      <div className="all-questions-container">
        <div className="all-questions-left">
          <div className="all-options">
            <div className="all-option">
              <p>{votes}</p>
              <span>votes</span>
            </div>
            <div className="all-option">
              <p>{data?.answerDetails?.length}</p>
              <span>answers</span>
            </div>
            <div className="all-option">
              <small>{views} views</small>
            </div>
          </div>
        </div>
        <div className="question-answer">
        <Link
  to={`/question?q=${data?._id}`}
  onClick={() => {
    
    handleViewIncrement(data?._id);
  }}
>
  {data.title}
</Link>
          <div
            style={{
              maxWidth: '90%',
            }}
          >
            <div>{ReactHtmlParser(truncate(data.body, 200))}</div>
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            {tags.map((_tag) => (
              <p
                key={_tag}
                style={{
                  margin: '10px 5px',
                  padding: '5px 10px',
                  backgroundColor: '#007cd446',
                  borderRadius: '3px',
                }}
              >
                {_tag}
              </p>
            ))}
          </div>
          <div className="author">
            <small>{data.create_at}</small>
            <div className="auth-details">
              <Avatar {...stringAvatar(data?.user?.displayName)} />
              <p>
                {data?.user?.displayName
                  ? data?.user?.displayName
                  : 'Natalie lee'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllQuestions;
