import "../../style/lists/GroupsAnsweredList.scss";

const GroupsAnsweredList = ({ groupsAnswered }) => {
  return (
    <div className="groups-answered">
      {groupsAnswered.map((group, index) => (
        <div key={index} className="group-answered">
          <p>
            {index + 1}. {group}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GroupsAnsweredList;
