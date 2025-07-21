import { useState, useEffect } from "react";
import "../../style/lists/CharactersList.scss";

const CharactersList = ({ characterName, setCharacterName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const characters = [
    { id: 1, name: "bear", image: "/images/characters/bear.png" },
    { id: 2, name: "bird", image: "/images/characters/bird.png" },
    { id: 3, name: "cat", image: "/images/characters/cat.png" },
    { id: 4, name: "dragon", image: "/images/characters/dragon.png" },
    { id: 5, name: "eagle", image: "/images/characters/eagle.png" },
    { id: 6, name: "earth", image: "/images/characters/earth.png" },
    { id: 7, name: "fox", image: "/images/characters/fox.png" },
    { id: 8, name: "mangust", image: "/images/characters/mangust.png" },
    { id: 9, name: "monkey", image: "/images/characters/monkey.png" },
    { id: 10, name: "penguin", image: "/images/characters/penguin.png" },
    { id: 11, name: "polarbear", image: "/images/characters/polarbear.png" },
    { id: 12, name: "tiger", image: "/images/characters/tiger.png" },
    { id: 13, name: "brain", image: "/images/characters/brain.png" },
    { id: 14, name: "frog", image: "/images/characters/frog.png" },
    { id: 15, name: "horse", image: "/images/characters/horse.png" },
    { id: 16, name: "mouse", image: "/images/characters/mouse.png" },
    { id: 17, name: "unicorn", image: "/images/characters/unicorn.png" },
    { id: 18, name: "panda", image: "/images/characters/panda.png" },
    { id: 19, name: "bunny", image: "/images/characters/bunny.png" },
    { id: 20, name: "cammel", image: "/images/characters/cammel.png" },
    { id: 21, name: "deer", image: "/images/characters/deer.png" },
    { id: 22, name: "dog", image: "/images/characters/dog.png" },
    { id: 23, name: "wolf", image: "/images/characters/wolf.png" },
    { id: 24, name: "skelleton", image: "/images/characters/skelleton.png" },
  ];

  const getColumns = () => {
    if (windowWidth >= 1200) return 6;
    if (windowWidth >= 992) return 5;
    if (windowWidth >= 768) return 4;
    if (windowWidth >= 576) return 3;
    return 2;
  };

  const handleCharacterClick = (id, name) => {
    setSelectedId(id);
    setCharacterName(name);
  };

  return (
    <div className={`character-list ${isLoaded ? "loaded" : ""}`}>
      <h1>Choose Your Avatar</h1>
      <div
        className="character-grid"
        style={{
          "--columns": getColumns(),
          "--item-size": windowWidth < 576 ? "90px" : "140px",
        }}
      >
        {characters.map((character) => (
          <div
            key={character.id}
            className={`character-item ${
              characterName === character.name ? "selected" : ""
            }`}
            onClick={() => handleCharacterClick(character.id, character.name)}
            style={{ "--delay": `${character.id * 0.05}s` }}
          >
            <div className="character-image-container">
              <img
                src={character.image}
                alt={character.name}
                className="character-image"
                loading="lazy"
              />
              <div className="character-selector"></div>
            </div>
            <div className="character-name">{character.name}</div>
            <div className="character-selector-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersList;
