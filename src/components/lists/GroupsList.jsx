import "../../style/lists/GroupsList.scss";

const GroupsList = ({ groups }) => {
  return (
    <div className="groups-list">
      {groups.map((group) => (
        <div 
          key={group.id}
          className={`group-card`}
        >
          <div className="group-image-container">
            <img 
              src={`/images/characters/${group.imageUrl}.png`} 
              alt={group.name}
              className="group-image"
            />
          </div>
          <div className="group-info">
            <h3 className="group-name">{group.name}</h3>
            <div className="group-points">
              <span className="points-value">{group.points || 0}</span>
              <span className="points-label">points</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;