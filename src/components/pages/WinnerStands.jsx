import { useEffect, useState } from "react";
import "../../style/pages/WinnerStands.scss";

const WinnerStands = ({ groups }) => {
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const [animateEntrance, setAnimateEntrance] = useState(false);

  useEffect(() => {
    if (!groups || groups.length === 0) return;

    const sortedGroups = [...groups]
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);

    setWinners(sortedGroups);

    setTimeout(() => setAnimateEntrance(true), 500);
    setTimeout(() => setShowWinners(true), 1500);
  }, [groups]);

  return (
    <div className={`winner-stands ${animateEntrance ? "animate" : ""}`}>
      {winners.length === 3 && (
        <>
          <div className="podium second">
            <div className="medal silver">🥈</div>
            <h2>{winners[1].name}</h2>
            <p>{winners[1].points} pts</p>
          </div>
          <div className="podium first">
            <div className="medal gold">🥇</div>
            <h2>{winners[0].name}</h2>
            <p>{winners[0].points} pts</p>
          </div>
          <div className="podium third">
            <div className="medal bronze">🥉</div>
            <h2>{winners[2].name}</h2>
            <p>{winners[2].points} pts</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WinnerStands;
