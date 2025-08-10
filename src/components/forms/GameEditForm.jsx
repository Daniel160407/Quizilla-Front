import { useEffect, useState } from 'react';
import '../../style/forms/GameEditForm.scss';

const GameEditForm = ({ game, onClose, onSubmit }) => {
    const [name, setName] = useState(game.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...game, name });
    };

    return (
        <div className="edit-form-overlay">
            <div className="game-edit-form">
                <h2>Edit Game</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Game Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GameEditForm;