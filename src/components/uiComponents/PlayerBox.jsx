import '../../style/uiComponents/PlayerBox.scss';

const PlayerBox = ({ player }) => {
    return (
        <div className="player">
            <p>{player}</p>
        </div>
    );
}

export default PlayerBox;