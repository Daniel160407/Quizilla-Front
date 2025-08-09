import { useEffect, useState } from "react";
import useAxios from '../components/hooks/UseAxios';
import Game from "../components/model/Game";
import '../style/pages/Games.scss';
import AddGameBtn from "../components/uiComponents/AddGameBtn";
import GameForm from "../components/forms/GameForm";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Games = () => {
    const [games, setGames] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            const response = await useAxios.get('/game');
            setGames(response.data);
        };
        fetchGames();
    }, []);

    const handleAddGameBtnClick = () => {
        setShowForm(true);
    };

    const handleGameSubmit = async (gameData) => {
        try {
            const response = await useAxios.post('/game', gameData);
            setGames((prev) => [...prev, response.data]);
            setShowForm(false);
            setName("");
        } catch (error) {
            console.error("Error adding game:", error);
        }
    };

    const handleGameClick = (gameId) => {
        Cookies.set('gameId', gameId, {expires: 1});
        navigate('/dashboard');
    }

    return (
        <div className="games">
            <AddGameBtn onClick={handleAddGameBtnClick} />

            {showForm && (
                <GameForm
                    name={name}
                    setName={setName}
                    onSubmit={handleGameSubmit}
                />
            )}

            {games.map((game, index) => (
                <Game key={index} game={game} onClick={handleGameClick}/>
            ))}
        </div>
    );
};

export default Games;
