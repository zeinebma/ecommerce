import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png';
import { backend_url, currency } from "../../App";
import EditProduct from '../EditProduct/EditProduct';
import add_product_icon from '../Assets/Product_Cart.svg';
import { Link } from 'react-router-dom';

const ListProduct = () => {
  const [image, setImage] = useState(null);
  const [allproducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [data, setdata] = useState({
    id: "",
    name: "",
    old_price: "",
    new_price: "",
    categoryId: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchInfo = () => {
    fetch(`${backend_url}/api/product/allproducts`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  const fetchCategories = () => {
    fetch(`${backend_url}/api/category/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchInfo();
    fetchCategories();
  }, []);

  const updateProduct = async () => {
    let formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append('description', data.description);
    formdata.append('categoryId', data.categoryId);
    formdata.append('new_price', data.new_price);
    formdata.append('old_price', data.old_price);
    if (image) {
      formdata.append('image', image);
    }

    const addProductResponse = await fetch(`${backend_url}/api/product/updateproduct/${data.id}`, {
      method: 'PUT',
      body: formdata,
    });
    const addProductResponseJson = await addProductResponse.json();
    if (addProductResponseJson.status === 'success') {
      setEditingProduct(null);
      setModalOpen(false);
    }
    fetchInfo();
  }

  const removeProduct = async (id) => {
    await fetch(`${backend_url}/api/product/removeproduct/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchInfo();
  }

  const removeSelectedProducts = async () => {
    for (const id of selectedProducts) {
      await removeProduct(id);
    }
    setSelectedProducts([]);
  }

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setdata({
      id: product.id,
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      categoryId: product.categoryId,
    });
    setModalOpen(true);

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setdata({
      ...data,
      [name]: value
    });
  };

  const handleFormSubmit = (formData) => {
    updateProduct(formData);
    setEditingProduct(null);
    setModalOpen(false);
    setImage(null)
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleCheckboxChange = (e, productId) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allProductIds = allproducts.map(product => product.id);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div style={{ position: 'absolute', right: '40px' }}>
        <Link to='/addproduct' className="button-17">
          <p>+ Add Product</p>
        </Link>
      </div>
      {selectedProducts.length > 0 &&
        <button onClick={removeSelectedProducts} className="button-17">Remove Selected</button>
      }
      <div className="listproduct-format-main">
        <input type="checkbox"
          onChange={handleSelectAll}
          style={{ height: '20px', cursor: "pointer", }}
        />
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New</p> <p>Category</p> <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => handleCheckboxChange(e, product.id)}
                style={{ height: '15px' }}
              />
              <img className="listproduct-product-icon" width={170} src={product.image} alt="" />
              <p className="cartitems-product-title">{product.name}</p>
              <p>{currency}{product.old_price}</p>
              <p>{currency}{product.new_price}</p>
              <p>{getCategoryName(product.categoryId)}</p>
              <div className="action-btn">
                <img src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" width={30} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(product)} />
                <img className="listproduct-remove-icon" onClick={() => removeProduct(product.id)} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSckjmVT1OZgpy0bFGkIAitjAu8Ed6_e2CLCA&s" width={30} alt="" />
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
      {editingProduct && (
        <EditProduct
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          data={data}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          categories={categories}
          setImage={setImage}
          image={image}
        />
      )}
    </div>
  )
}
export default ListProduct;
