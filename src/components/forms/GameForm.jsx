import '../../style/forms/GameForm.scss';

const GameForm = ({ name, setName, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="game-form">
            <label htmlFor="gameName">Game Name:</label>
            <input
                type="text"
                id="gameName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter game name"
                required
            />
            <button type="submit">Save Game</button>
        </form>
    );
};

export default GameForm;
