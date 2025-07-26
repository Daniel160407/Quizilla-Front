import "../style/pages/Instructions.scss";

const Instructions = ({ imageSrc }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="instructions">
      <h1>Quizilla Instructions</h1>
      <p className="url-highlight">1. Go to the URL: {API_BASE_URL}</p>
      <p>2. Enter group name and choose an avatar.</p>
      <p>3. Wait until all groups are connected and the game starts.</p>

      {imageSrc && (
        <div className="instruction-image-wrapper">
          <img src={imageSrc} alt="Instruction visual" className="instruction-image" />
        </div>
      )}
    </div>
  );
};

export default Instructions;
