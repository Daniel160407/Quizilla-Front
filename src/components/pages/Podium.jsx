import React, { useState, useEffect, useRef } from "react";
import "../../style/pages/Podium.scss";

const Podium = ({ groups }) => {
  const [winners, setWinners] = useState([]);
  const [animateEntrance, setAnimateEntrance] = useState(false);
  const [visibleWinners, setVisibleWinners] = useState([]);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [musicPlayed, setMusicPlayed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // spotlight overlay
  const [confettiBoom, setConfettiBoom] = useState(false); // new state for boom effect
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
    setTimeout(() => setShowOverlay(true), 10000);
    setTimeout(() => {
      setVisibleWinners([2, 1, 0]); // Reveal first place here
    }, 13500);
    setTimeout(() => setShowOverlay(false), 14000);

    setTimeout(() => {
      setShowOverlay(false); // Hide spotlight
    }, 17000);
  }, [groups, audioLoaded]);

  // Trigger confetti boom once exactly when first place revealed
  useEffect(() => {
    if (visibleWinners.includes(0)) {
      setConfettiBoom(true);
      const timer = setTimeout(() => setConfettiBoom(false), 3000); // boom lasts 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visibleWinners]);

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
    if (index === 0) return "1";
    if (index === 1) return "2";
    return "3";
  };

  const displayOrder = winners.length === 3 ? [2, 0, 1] : [...winners.keys()];

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
          <div key={index} className={`announcement`}>
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
        {displayOrder.map((displayIndex) => {
          const winner = winners[displayIndex];
          return (
            <div
              key={displayIndex}
              className={`winner-container podium-${
                displayIndex + 1
              } ${getEntranceAnimation(displayIndex)}`}
            >
              <img
                src={`/images/characters/${winner.imageUrl}.png`}
                alt={winner?.name || "Winner"}
                className="winner-circle"
              />
              <div className="place-number">
                {getDisplayPosition(displayIndex)}
              </div>
              <div className="winner-content">
                {visibleWinners.includes(displayIndex) && (
                  <>
                    <div className="team-name">{winner?.name}</div>
                    <div className="team-points">{winner?.points}</div>
                  </>
                )}
              </div>
              <div className="podium-base"></div>
            </div>
          );
        })}
      </div>

      {/* Spotlight black overlay with transparent hole */}
      {showOverlay && <div className="black-overlay show"></div>}

      <div className="spotlight"></div>
      <div className="spotlight"></div>
      <div className="spotlight"></div>

      {/* Always show confetti container, add "boom" class during boom */}
      <div className={`confetti-container ${confettiBoom ? "boom" : ""}`}>
        {[...Array(150)].map((_, i) => (
          <div key={i} className="confetti"></div>
        ))}
      </div>
    </div>
  );
};

export default Podium;
