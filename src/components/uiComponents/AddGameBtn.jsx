import '../../style/uiComponents/AddGameBtn.scss';

const AddGameBtn = ({ onClick }) => {
    return (
        <div className="add-game-btn" onClick={onClick}>
            <p>Add Game</p>
        </div>
    );
}

export default AddGameBtn;