const Category = ({ category }) => {
    return (
        <div className="category">
            <p>{category.id}</p>
            <p>{category.name}</p>
        </div>
    );
}

export default Category;