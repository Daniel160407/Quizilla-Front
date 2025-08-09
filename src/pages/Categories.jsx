import { use, useEffect, useState } from "react";
import useAxios from "../components/hooks/UseAxios";
import Category from "../components/model/Category";
import Navbar from "../components/navigation/Navbar";
import AddCategoryBtn from "../components/uiComponents/AddCategoryBtn";
import CategoryForm from "../components/forms/CategoryForm";
import "../style/pages/Categories.scss";
import Cookies from "js-cookie";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const gameId = Cookies.get('gameId');

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await useAxios.get(`/category?gameid=${gameId}`);
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    const response = await useAxios.post(`/category`, data);
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
