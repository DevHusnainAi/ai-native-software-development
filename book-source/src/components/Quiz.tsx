import React, { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctOption: 0 | 1 | 2 | 3;
  explanation?: string;
}

export interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
  passingScore?: number;
}

const Quiz: React.FC<QuizProps> = ({
  title = "Quiz",
  questions,
  passingScore = 70,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestion);
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setAnsweredQuestions(new Set());
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctOption) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const score = calculateScore();
  const allAnswered = selectedAnswers.every((answer) => answer !== null);

  if (showResults) {
    const passed = score.percentage >= passingScore;

    return (
      <div className="mx-auto my-8 max-w-3xl px-4">
        <div className="rounded-2xl border border-polar-night-gray/20 bg-white/95 p-8 shadow-xl dark:border-neutral-700 dark:bg-neutral-900/95">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-8">
            <h2 className="m-0 bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 bg-clip-text text-3xl font-bold text-transparent dark:from-polar-night-light dark:to-polar-night-gray">
              Quiz Results
            </h2>
            <div
              className={`flex h-32 w-32 flex-col items-center justify-center rounded-full text-white shadow-xl ${
                passed
                  ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30"
                  : "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30"
              }`}
            >
              <div className="text-3xl font-bold leading-none">
                {score.percentage}%
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                Score
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
            <div className="flex flex-col items-center rounded-xl border border-polar-night-gray/20 bg-polar-night-deep/5 p-4 dark:border-neutral-700 dark:bg-neutral-800/80">
              <span className="text-3xl font-bold leading-none text-polar-night-deep dark:text-polar-night-light">
                {score.correct}
              </span>
              <span className="mt-2 text-sm font-medium text-polar-night-gray dark:text-neutral-400">
                Correct
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-polar-night-gray/20 bg-polar-night-deep/5 p-4 dark:border-neutral-700 dark:bg-neutral-800/80">
              <span className="text-3xl font-bold leading-none text-polar-night-deep dark:text-polar-night-light">
                {score.total - score.correct}
              </span>
              <span className="mt-2 text-sm font-medium text-polar-night-gray dark:text-neutral-400">
                Incorrect
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-polar-night-gray/20 bg-polar-night-deep/5 p-4 dark:border-neutral-700 dark:bg-neutral-800/80">
              <span className="text-3xl font-bold leading-none text-polar-night-deep dark:text-polar-night-light">
                {score.total}
              </span>
              <span className="mt-2 text-sm font-medium text-polar-night-gray dark:text-neutral-400">
                Total
              </span>
            </div>
          </div>

          <div
            className={`mb-8 flex items-center justify-center gap-3 rounded-xl border-2 p-6 text-center text-lg ${
              passed
                ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-600 dark:text-green-400"
                : "border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 text-red-600 dark:text-red-400"
            }`}
          >
            <span className="text-2xl">{passed ? "🎉" : "📚"}</span>
            <strong>
              {passed ? "Congratulations!" : "Keep Learning!"}{" "}
              {passed
                ? "You passed the quiz!"
                : "Review the material and try again."}
            </strong>
          </div>

          <div className="mb-8">
            <h3 className="mb-6 text-2xl font-bold text-polar-night-charcoal dark:text-neutral-100">
              Question Review
            </h3>
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctOption;

              return (
                <div
                  key={index}
                  className="mb-4 rounded-xl border border-polar-night-gray/20 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900/50"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-polar-night-gray dark:text-neutral-400">
                      Question {index + 1}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                  <p className="mb-4 font-semibold leading-relaxed text-polar-night-charcoal dark:text-neutral-200">
                    {q.question}
                  </p>
                  <div className="flex flex-col gap-3 pl-2">
                    <div className="text-sm leading-relaxed">
                      <strong>Your answer:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          isCorrect
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userAnswer !== null
                          ? q.options[userAnswer]
                          : "Not answered"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="text-sm leading-relaxed">
                        <strong>Correct answer:</strong>{" "}
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {q.options[q.correctOption]}
                        </span>
                      </div>
                    )}
                    {q.explanation && (
                      <div className="mt-3 rounded border-l-4 border-polar-night-deep bg-polar-night-deep/5 p-4 text-sm leading-relaxed dark:border-neutral-700 dark:bg-neutral-800/80">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="w-full rounded-xl bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-polar-night-deep/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-polar-night-deep/40"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto my-8 max-w-3xl px-4">
      <div className="rounded-2xl border border-polar-night-gray/20 bg-white/95 p-8 shadow-xl transition dark:border-neutral-700 dark:bg-neutral-900/95">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="m-0 bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 bg-clip-text text-3xl font-bold text-transparent dark:from-polar-night-light dark:to-polar-night-gray">
            {title}
          </h2>
          <div className="rounded-full bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-polar-night-deep/20">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-polar-night-deep/10 dark:bg-neutral-700/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-polar-night-deep to-polar-night-deep/80 shadow-lg shadow-polar-night-deep/30 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-8">
          <h3 className="mb-6 text-xl font-semibold leading-relaxed text-polar-night-charcoal dark:text-neutral-200">
            {question.question}
          </h3>

          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`relative flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                  selectedAnswer === index
                    ? "border-polar-night-deep bg-gradient-to-br from-polar-night-deep/10 to-polar-night-deep/5 translate-x-1 dark:border-neutral-400 dark:from-neutral-800/50 dark:to-neutral-800/30"
                    : "border-polar-night-deep/20 bg-white hover:border-polar-night-deep hover:bg-polar-night-deep/5 hover:translate-x-1 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 text-sm font-bold text-white shadow-md">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 leading-relaxed text-polar-night-charcoal dark:text-neutral-200">
                  {option}
                </span>
                {selectedAnswer === index && (
                  <span className="text-2xl font-bold text-polar-night-deep animate-checkmarkPop dark:text-polar-night-light">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-medium text-polar-night-gray dark:text-neutral-400">
            Answered: {answeredQuestions.size} / {questions.length}
          </div>

          <div className="ml-auto flex gap-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-6 py-3 font-semibold text-polar-night-charcoal transition hover:bg-neutral-200 hover:-translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              ← Back
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                title={!allAnswered ? "Please answer all questions" : ""}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80 px-6 py-3 font-semibold text-white shadow-lg shadow-polar-night-deep/30 transition hover:translate-x-0.5 hover:shadow-xl hover:shadow-polar-night-deep/40"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2 border-t border-polar-night-gray/20 pt-6 dark:border-neutral-700">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 w-2.5 rounded-full border-none transition hover:scale-130 ${
                index === currentQuestion
                  ? "scale-140 bg-polar-night-deep shadow-md shadow-polar-night-deep/20 ring-2 ring-polar-night-deep/20 dark:ring-neutral-400/20"
                  : answeredQuestions.has(index)
                  ? "bg-gradient-to-br from-polar-night-deep to-polar-night-deep/80"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
              onClick={() => setCurrentQuestion(index)}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
