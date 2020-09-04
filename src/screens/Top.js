import React from "react";
import { Link } from "react-router-dom";

const Top = () => {
  return (
    <div className="top-container center-align">
      <h4 className="top-header">
        クイズを解いて
        <br />
        圧倒的成長！
      </h4>
      <div>
        <Link to="/quiz" className="btn-large green">
          クイズをやる
        </Link>
      </div>
    </div>
  );
};

export default Top;
