import React, { useState, useEffect, useRef } from "react";
import "../../style/pages/WinnerStands.scss";

const WinnerStands = ({ groups }) => {
  const [winners, setWinners] = useState([]);
  const [animateEntrance, setAnimateEntrance] = useState(false);
  const [visibleWinners, setVisibleWinners] = useState([]);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const handleCanPlay = () => {
        setAudioLoaded(true);
      };

      const audioElement = audioRef.current;
      audioElement.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        if (audioElement) {
          audioElement.removeEventListener("canplaythrough", handleCanPlay);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!groups || groups.length === 0 || !audioLoaded) return;

    const sortedGroups = [...groups]
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);
    setWinners(sortedGroups);

    setTimeout(() => {
      setAnimateEntrance(true);

      if (audioRef.current && !musicPlayed) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
        setMusicPlayed(true);
      }
    }, 500);

    setTimeout(() => setVisibleWinners([2]), 3500);
    setTimeout(() => setVisibleWinners([2, 1]), 7500);
    setTimeout(() => setVisibleWinners([2, 1, 0]), 13500);
  }, [groups, audioLoaded]);

  const getDefaultColor = (index) => {
    const colors = ["#FFD166", "#06D6A0", "#118AB2"];
    return colors[index];
  };

  const getMedalIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    return "🥉";
  };

  const getEntranceAnimation = (index) => {
    if (!animateEntrance) return "";
    return visibleWinners.includes(index) ? "appear" : "hidden";
  };

  const getDisplayPosition = (index) => {
    if (index === 0) return "1st";
    if (index === 1) return "2nd";
    return "3rd";
  };

  return (
    <div className="winner-stands-container">
      <audio ref={audioRef} src="/sounds/podium.mp3" preload="auto" />

      <div className="background-animation"></div>

      <div className="title-container">
        <h1 className="main-title">Quizilla Champions</h1>
        <h2 className="subtitle">Thank you for the game</h2>
      </div>

      <div className="announcement-track">
        {winners.map((winner, index) => (
          <div
            key={index}
            className={`announcement ${getEntranceAnimation(index)}`}
          >
            <div className="announcement-content">
              <span className="announcement-rank">{3 - index}</span>
              <div className="announcement-text">
                <span className="announcement-place">
                  {getMedalIcon(index)} {getDisplayPosition(index)} Place
                </span>
                <span className="announcement-team">{winner.name}</span>
              </div>
              <span className="announcement-points">{winner.points} pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`winner-stands ${animateEntrance ? "animate" : ""}`}>
        {winners.map((winner, index) => (
          <div
            key={index}
            className={`winner-container podium-${
              3 - index
            } ${getEntranceAnimation(index)}`}
          >
            <div
              className="winner-circle"
              style={{ background: winner.color || getDefaultColor(index) }}
            >
              <div className="winner-content">
                {visibleWinners.includes(index) && (
                  <>
                    <div className="team-name">{winner.name}</div>
                    <div className="team-points">{winner.points} pts</div>
                  </>
                )}
              </div>
            </div>
            <div className="place-number">
              {getDisplayPosition(index)}
              <span className="medal-icon">{getMedalIcon(index)}</span>
            </div>
            <div className="podium-base"></div>
          </div>
        ))}
      </div>

      <div className="spotlight"></div>
      <div className="spotlight"></div>
      <div className="spotlight"></div>

      <div className="confetti-container">
        {[...Array(150)].map((_, i) => (
          <div key={i} className="confetti"></div>
        ))}
      </div>
    </div>
  );
};

export default WinnerStands;
