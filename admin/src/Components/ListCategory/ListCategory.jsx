import React, { useEffect, useState } from 'react'
import EditCategory from '../EditCategory/EditCategory';
import { backend_url, currency } from "../../App";
import { Link } from 'react-router-dom';
import cross_icon from '../Assets/cross_icon.png';
import "./ListCategory.css"

const ListCategory = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
    });
    const fetchCategories = () => {
        fetch(`${backend_url}/api/category/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data));
    };

    const updateCaregory = async (category) => {
        await fetch(`${backend_url}/api/category/updateCategory`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });
        fetchCategories();
    }
    const removeCategory = async (id) => {
        await fetch(`${backend_url}/api/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetchCategories();
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEditClick = (product) => {
        setEditingCategory(product.id);
        setFormData({
            id: product.id,
            name: product.name,
        });
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateCaregory(formData);
        setEditingCategory(null);
        setModalOpen(false);
    };
    return (
        <div className="listproduct">
            <h1>All Products List</h1>
            <div style={{ position: 'absolute', right: '40px' }}>
                <Link to='/addcategory' className="button-17">
                    <p>+ Add Category</p>
                </Link>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((e, index) => (
                            <tr key={index}>
                                <td>{e.name}</td>
                                <td>
                                    <div className='category-btn'>
                                        <img src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" width={30} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(e)} />
                                        <img className="listcategory-remove-icon" onClick={() => removeCategory(e.id)} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSckjmVT1OZgpy0bFGkIAitjAu8Ed6_e2CLCA&s" width={30} alt="" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingCategory && (
                <EditCategory
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFormSubmit={handleFormSubmit}
                    categories={categories}
                />
            )}
        </div>
    )
}

export default ListCategory