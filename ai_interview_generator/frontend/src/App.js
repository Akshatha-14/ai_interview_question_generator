import { useState } from "react";
import "./App.css";

function App() {
  const [skill, setSkill] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!skill.trim()) {
      alert("Please enter a skill");
      return;
    }

    if (numQuestions < 1) {
      alert("Number of questions must be at least 1");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill: skill,
            num_questions: (numQuestions),
          }),
        }
      );

      const data = await response.json();

      if (data.questions) {
        setQuestions(data.questions);
      } else {
        alert("No questions received from backend");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>AI Interview Question Generator</h1>

        <input
          type="text"
          placeholder="Enter Skill (Python, Java, SQL)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="50"
          placeholder="Number of Questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
        />

        <button onClick={generateQuestions}>
          Generate Questions
        </button>

        {loading && (
          <p style={{ marginTop: "20px" }}>
            Generating questions...
          </p>
        )}

        {!loading && questions.length > 0 && (
          <div className="questions">
            <h2>
              Generated Questions ({questions.length})
            </h2>

            {questions.map((question, index) => (
              <div
                className="question-card"
                key={index}
              >
                {question}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;