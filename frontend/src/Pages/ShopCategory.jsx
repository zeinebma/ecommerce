import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";
import { backend_url } from "../App";
import women_banner from "../Components/Assets/banner_women.png";
import men_banner from "../Components/Assets/banner_mens.PNG";

const ShopCategory = () => {
  const { categoryName } = useParams();
  const [allproducts, setAllProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [banner, setBanner] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");

  const fetchInfo = () => {
    fetch(`${backend_url}/api/product/category/${categoryName}`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setSortedProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
    if (categoryName === "vetements") {
      setBanner(women_banner);
    } else if (categoryName === "equipements") {
      setBanner(men_banner);
    }
  }, [categoryName]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
    const sorted = [...allproducts].sort((a, b) => {
      if (criteria === "priceAsc") {
        return a.new_price - b.new_price;
      } else if (criteria === "priceDesc") {
        return b.new_price - a.new_price;
      } else if (criteria === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    setSortedProducts(sorted);
  };

  return (
    <div className="shopcategory">
      <img src={banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p><span>Showing 1 - {sortedProducts.length}</span> out of {allproducts.length} Products</p>
        <div className="shopcategory-sort">
          Sort by
          <select onChange={(e) => handleSortChange(e.target.value)} style={{ border: 'none', cursor: "pointer" }} value={sortCriteria}>
            <option value="name">Name</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {sortedProducts.map((item, i) => (
          <Item id={item.id} key={i} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
