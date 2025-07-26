import { use, useEffect, useState } from "react";
import useAxios from "../components/hooks/UseAxios";
import Category from "../components/model/Category";
import Navbar from "../components/navigation/Navbar";
import AddCategoryBtn from "../components/uiComponents/AddCategoryBtn";
import CategoryForm from "../components/forms/CategoryForm";
import "../style/pages/Categories.scss";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await useAxios.get("/category");
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    const response = await useAxios.post("/category", data);
    setCategories(response.data);
  };

  const handleEdit = async (data) => {
    const response = await useAxios.put("/category", data);
    setCategories(response.data);
  };

  const handleDelete = async (id) => {
    const response = await useAxios.delete(`/category?id=${id}`);
    setCategories(response.data);
  };

  return (
    <>
      <Navbar />
      <div className="categories">
        {categories.map((category, index) => (
          <Category
            key={index}
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
