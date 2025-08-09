import '../../style/model/Game.scss';

const Game = ({ game, onClick }) => {
    return (
        <div className="game" onClick={() => onClick(game.id)}>
            <h1>{game.name}</h1>
            <p>{game.dateCreated}</p>
        </div>
    );
}

export default Game;