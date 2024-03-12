import React from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import "./css/Main.css";
import AllQuestions from "./AllQuestions";
import { Link } from "react-router-dom";

function Main({ questions, userId }) {
  return (
    <div className="main">
      <div className="main-container">
        <div className="main-top">
          <h2>All Questions</h2>
          <Link to="/add-question">
            <button>Ask Question</button>
          </Link>
        </div>
        <div className="main-desc">
          <p>{questions.length} questions</p>
          <div className="main-filter">
            <div className="main-tabs">
              <div className="main-tab">
                <Link to="/">Newest</Link>
              </div>
              <div className="main-tab">
                <Link to="/">Active</Link>
              </div>
              <div className="main-tab">
                <Link to="/">More</Link>
              </div>
            </div>
            <div className="main-filter-item">
              <FilterListIcon />
              <p>Filter</p>
            </div>
          </div>
        </div>
        <div className="questions">
          {questions?.map((_q) => (
            <div key={_q._id} className="question">
              <AllQuestions data={_q} userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
