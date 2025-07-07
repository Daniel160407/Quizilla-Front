import '../../style/uiComponents/AddCategoryBtn.scss';

const AddCategoryBtn = ({ onClick }) => {
    return (
        <div className="addCategory" onClick={onClick}>
            <p>Add Category</p>
        </div>
    );
}

export default AddCategoryBtn;