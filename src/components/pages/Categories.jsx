import { useEffect, useState } from "react";
import useAxios from "../hooks/UseAxios";
import Category from "../model/Category";
import Navbar from "../navigation/Navbar";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await useAxios("/category", "get");
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  return (
    <>
    <Navbar/>
      <div className="categories">
        {categories.map((category) => (
          <Category category={category} />
        ))}
      </div>
    </>
  );
};

export default Categories;
