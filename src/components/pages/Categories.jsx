import { useEffect, useState } from "react";
import useAxios from "../hooks/UseAxios";
import Category from "../model/Category";
import Navbar from "../navigation/Navbar";
import AddCategoryBtn from "../uiComponents/AddCategoryBtn";
import CategoryForm from "../forms/CategoryForm";
import "../../style/pages/Categories.scss";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await useAxios("/category", "get");
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    const response = await useAxios("/category", "post", data);
    setCategories(response.data);
  };

  const handleEdit = async (data) => {
    const response = await useAxios("/category", "put", data);
    setCategories(response.data);
  };

  const handleDelete = async (id) => {
    const response = await useAxios(`/category?id=${id}`, "delete");
    setCategories(response.data);
  };

  return (
    <>
      <Navbar />
      <div className="categories">
        {categories.map((category) => (
          <Category
            category={category}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <AddCategoryBtn onClick={() => setShowForm(true)} />
        {showForm === true && <CategoryForm onSubmit={handleSubmit} />}
      </div>
    </>
  );
};

export default Categories;
