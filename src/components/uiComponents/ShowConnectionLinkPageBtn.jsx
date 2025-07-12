import "../../style/uiComponents/ShowConnectionLinkPageBtn.scss";

const ShowConnectionLinkPageBtn = ({ onClick }) => {
  return (
    <div className="open-button-box">
      <div className="open-button" onClick={onClick}>
        <p>Show/Hide Instructions</p>
      </div>
    </div>
  );
};

export default ShowConnectionLinkPageBtn;
