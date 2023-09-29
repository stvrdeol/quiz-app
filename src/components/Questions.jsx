import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchQuestions } from "../features/quizSlice";
import Spinner from "./Spinner";
import Confetti from "react-confetti";

function Questions() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state?.quiz?.data?.questions);
  const loading = useSelector((state) => state.quiz.loading);
  const [randomQuestionsArr, setRandomQuestionsArr] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    });
  }, []);

  function randomQuestions2() {
    if (!questions) return [];
    const shuffledQuestions = [...questions]; // Copy the questions array.
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive).
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the elements at indices i and j.
      [shuffledQuestions[i], shuffledQuestions[j]] = [
        shuffledQuestions[j],
        shuffledQuestions[i],
      ];
    }
    // Return the first 'numberOfQuestions' shuffled questions.
    return shuffledQuestions.slice(0, 10);
  }

  function nextQuestion(correctAnswer) {
    setShowAnimation(true);
    // setShowAnimation to false after .5 secs
    setTimeout(() => {
      setShowAnimation(false);
    }, 500);
    if (answer == correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < randomQuestionsArr.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setScoreAnimation(true);
      // setShowAnimation to false after .5 secs
      setTimeout(() => {
        setScoreAnimation(false);
      }, 500);
      setShowScore(true);
    }
    setAnswer("");
    setAnswered(false);
  }

  // play again
  function playAgain() {
    const newRandomQuestionsArr = randomQuestions2();
    setRandomQuestionsArr(newRandomQuestionsArr);

    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setAnswered(false);
    setAnswer("");
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 500);
  }

  // function match answer
  function setUserAnswer(e) {
    setAnswered(true);
    setAnswer(e.target.value);
  }

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Wait until questions are loaded to set randomQuestionsArr
  useEffect(() => {
    if (!loading && questions) {
      const randomQuestions = randomQuestions2();
      setRandomQuestionsArr(randomQuestions);
    }
  }, [loading, questions]);

  return (
    <div className="min-w-full grid place-items-center overflow-hidden">
      {loading ? (
        <Spinner />
      ) : randomQuestionsArr.length > 0 && !showScore ? (
        <>
          <h1 className="mb-5 slide-in text-2xl font-sans font-bold text-center">
            Get Quizzical: Play and Learn!
          </h1>
          <div
            className={`bg-[#393E46] rounded-xl p-6 w-full mx-auto max-w-xl enter`}>
            <section className="flex justify-between font-bold text-lg">
              <p>
                Question : <span> {currentQuestion + 1}/10</span>
              </p>
              <p>
                Score : <span>{score}</span>{" "}
              </p>
            </section>
            <section className={`${showAnimation ? `slide-in` : null}`}>
              <h2 className="my-5 text-xl">
                {randomQuestionsArr[currentQuestion].question}
              </h2>
              {randomQuestionsArr[currentQuestion]?.options.map(
                (option, index) => {
                  return (
                    <button
                      value={option}
                      onClick={(e) => setUserAnswer(e)}
                      key={index}
                      className={`my-4  transition-all hover:bg-[#00ADB5] block w-full text-left p-2 rounded-lg ${
                        option == answer ? ` bg-[#00ADB5]` : `bg-[#222831]`
                      }`}>
                      <span>{index + 1}. </span>
                      {option}
                    </button>
                  );
                }
              )}
            </section>
            <section className="flex justify-between items-center">
              <button
                className="bg-[#EEEEEE] text-[#222831] px-4 rounded-md py-2"
                onClick={playAgain}>
                Play again
              </button>
              <button
                className={`bg-[#00ADB5] px-4 text-white rounded-md py-2 ${
                  !answered ? `cursor-not-allowed opacity-70` : null
                }`}
                onClick={() =>
                  nextQuestion(randomQuestionsArr[currentQuestion]?.answer)
                }
                disabled={!answered}>
                Next
              </button>
            </section>
          </div>
        </>
      ) : (
        showScore && (
          <div
            className={`bg-[#393E46] rounded-xl p-6 w-full mx-auto max-w-xl font-bold text-center ${
              scoreAnimation ? `angry-animate` : ``
            }`}>
            {score >= 8 ? (
              <>
                <p className="text-xl">
                  That&apos;s Excellent you have good knowledge
                </p>
                <Confetti width={windowWidth} height={windowHeight} />
              </>
            ) : score >= 6 ? (
              <>
                <Confetti width={windowWidth} height={windowHeight} />
                <p className="text-xl">
                  That&apos;s not bad but you can Improve
                </p>
              </>
            ) : (
              <p className="text-xl">Play more to learn more</p>
            )}

            <p className="mt-5">
              You scored{" "}
              <span className="text-[#00ADB5] text-xl">{score} </span>
              out of 10
            </p>
            <button
              className="bg-[#EEEEEE] text-[#222831] px-4 rounded-md py-2 mt-5"
              onClick={playAgain}>
              Play again
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Questions;
