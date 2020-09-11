import React, { useState } from "react";

const Choice = (props) => {
  const { choice, isCorrect, answered, updateAnswer, id } = props;
  const [checked, setChecked] = useState(false);

  const changeAnswer = () => {
    if (!answered) {
      updateAnswer(id, !checked);
      setChecked(!checked);
    }
  };

  const realAnswer = (
    <span className={isCorrect ? "correct-answer" : "wrong-answer"} />
  );

  return (
    <div className="col s12 m6">
      <div
        className={`card grey lighten-2 ${!answered && "pointer"}`}
        onClick={() => changeAnswer()}
      >
        <div className="card-action">
          <div className="row no-margin">
            <span className="col s11 choice-content">{choice}</span>
            <span className="col s1 checkbox-container">
              <label>
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                  checked={checked}
                  readOnly={true}
                  disabled={answered}
                />
                <span className="no-padding" />
              </label>
            </span>
          </div>
          {answered && realAnswer}
        </div>
      </div>
    </div>
  );
};

export default Choice;
