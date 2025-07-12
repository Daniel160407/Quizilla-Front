import "../../style/pages/Instructions.scss";

const Instructions = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="instructions">
      <h1>Quizilla Insturctions</h1>
      <p>1. Go to the URL: {API_BASE_URL}</p>
      <p>2. Enter group name and choose an avatar.</p>
      <p>3. Wait until all groups are connected and the game starts.</p>
    </div>
  );
};

export default Instructions;
