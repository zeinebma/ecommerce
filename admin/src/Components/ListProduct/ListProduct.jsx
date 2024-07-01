import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png'
import { backend_url, currency } from "../../App";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    old_price: "",
    new_price: "",
    category: "",
    image: ""
  });

  const fetchInfo = () => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  
  const updateProduct = async (product) => {
    await fetch(`${backend_url}/updateproduct`, {
      method: 'PUT',  // Notez ici l'utilisation de la méthode PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
  
    fetchInfo();
  }



  const removeProduct = async (id) => {
    await fetch(`${backend_url}/removeproduct`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    })

    fetchInfo();
  }

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      category: product.category,
      image: product.image
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateProduct(formData);
    setEditingProduct(null);
  }

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New Price</p> <p>Category</p> <p>Edit</p> <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((e, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={backend_url + e.image} alt="" />
              <p className="cartitems-product-title">{e.name}</p>
              <p>{currency}{e.old_price}</p>
              <p>{currency}{e.new_price}</p>
              <p>{e.category}</p>
              <button onClick={() => handleEditClick(e)}>Edit</button>
              <img className="listproduct-remove-icon" onClick={() => { removeProduct(e.id) }} src={cross_icon} alt="" />
            </div>
            {editingProduct === e.id && (
              <form onSubmit={handleFormSubmit}>
                <label>
                  Name:
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </label>
                <label>
                  Old Price:
                  <input type="number" name="old_price" value={formData.old_price} onChange={handleInputChange} />
                </label>
                <label>
                  New Price:
                  <input type="number" name="new_price" value={formData.new_price} onChange={handleInputChange} />
                </label>
                <label>
                  Category:
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
                </label>
                <label>
                  Image URL:
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
              </form>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
