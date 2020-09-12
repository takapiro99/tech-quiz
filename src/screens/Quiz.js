import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Choice from "../components/Choice";

const url = "https://quizapi.io/api/v1/questions";

// config for axios
const config = {
  params: {
    limit: 1,
  },
  headers: {
    "X-Api-Key": process.env.REACT_APP_QUIZAPI_KEY,
  },
};

const Quiz = () => {
  const [quizzes, setquizzes] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isCorrect, setCorrect] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetchQuiz();
    return;
  }, []);

  const fetchQuiz = () => {
    setAnswered(false);
    setLoading(true);
    setSelectedAnswers([]);
    axios
      .get(url, config)
      .then((res) => {
        console.log("元データ", res.data[0]);
        if (res.data) {
          setquizzes(res.data[0]);
        }
      })
      .catch((e) => {
        alert("エラーだよ。コンソールを見てね");
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkAnswer = () => {
    console.log("===========");
    console.log("correctAnswers", correctAnswers);
    console.log("===========");
    console.log("加工後", quizList);
    // 処理しやすい形に変換
    const realAnswer = quizList
      .map((item, index) => ({
        index: index,
        isCorrect: item.isCorrect,
      }))
      .filter((item) => item.isCorrect)
      .map((item) => item.index)
      .sort();
    setCorrect(
      JSON.stringify(realAnswer) === JSON.stringify(selectedAnswers.sort())
    );
    setAnswered(true);
  };

  const updateAnswer = (id, append) => {
    if (append) {
      setSelectedAnswers([...selectedAnswers, id]);
    } else {
      setSelectedAnswers([...selectedAnswers].filter((item) => item !== id));
    }
  };

  // JSONは真偽値も表せるはずなのにstringで渡してきやがるからparseする
  const correctAnswers =
    quizzes &&
    Object.values(quizzes.correct_answers).map((item) => JSON.parse(item));

  // 処理しやすい形にしておく
  const quizList =
    quizzes &&
    Object.values(quizzes.answers)
      .filter((choice) => !!choice)
      .map((question, index) => ({
        choice: question,
        isCorrect: correctAnswers[index],
      }));

  if (isLoading) {
    return (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "5em" }}>
      <div style={{ margin: "3em 0" }}>
        <p className="grey-text">
          <span>{quizzes?.category || "no category"}</span>
          <span> - {quizzes?.tags.map((i) => i.name + " ") || "no tags"}</span>
          <span> - {quizzes?.difficulty}</span>
        </p>
        <h5 className="container question">{quizzes?.question}</h5>
      </div>
      <div className="row">
        {quizList?.map((choice, index) => {
          return (
            <Choice
              key={index}
              choice={choice.choice}
              isCorrect={choice.isCorrect}
              answered={answered}
              updateAnswer={updateAnswer}
              id={index}
            />
          );
        })}
      </div>
      {answered && (
        <div className="correctness">
          <h3 className="center-align">{isCorrect ? "正解！😁" : "不正解"}</h3>
          <p className="center-align tips">{quizzes?.tip}</p>
        </div>
      )}
      <div className="center-align">
        <button
          className="btn-large green"
          onClick={() => {
            answered ? fetchQuiz() : checkAnswer();
          }}
        >
          {answered ? "次へ" : "答え合わせ"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
