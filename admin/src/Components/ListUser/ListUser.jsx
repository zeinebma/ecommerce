import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { backend_url, currency } from "../../App";
import EditUser from "../EditUser/EditUser";
import axios from "axios";
import { Button } from "@mui/material";
import UserModal from "./UserModal";
import './ListUser.css'

const ListUser = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [formData, setFormData] = useState({ id: '', role: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);

    const addAdmin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/auth/add-admin', user);
            fetchInfo();
            console.log('Signup successful:', response.data);
        } catch (error) {
            alert("Signup failed: " + error.response.data.errors);
        }
    };

    const fetchInfo = () => {
        fetch(`${backend_url}/api/auth/users`)
            .then((res) => res.json())
            .then((data) => setAllUsers(data));
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const updateUser = async (user) => {
        await fetch(`${backend_url}/api/auth/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        fetchInfo();
    }

    const removeUser = async (id) => {
        await fetch(`${backend_url}/api/auth/remove/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetchInfo();
    }

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setFormData({
            id: user.id,
            role: user.role
        });
        setModalOpen(true);
    };

    const handleClickAdmin = () => {
        setUser({ username: "", email: "", password: "" });
        setModalOpenAdmin(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInputChangeAdmin = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateUser(formData);
        setEditingUser(null);
        setModalOpen(false);
    };

    const handleFormSubmitAdmin = (e) => {
        e.preventDefault();
        addAdmin();
        setModalOpenAdmin(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'MM-dd-yyyy HH:mm');
    };

    return (
        <div className="listproduct">
            <h1>Users List</h1>
            <div style={{ position: 'absolute', right: '40px' }}>
                <Button onClick={() => handleClickAdmin()} className="button-17">
                    <div style={{ display: "flex", alignItems: "center", gap: '5px' }}>
                        <span style={{ fontSize: '20px' }}>+</span><p> Add Admin</p>
                    </div>
                </Button>
            </div>
            <div className="listproduct-format-main">
                <p>ID</p> <p>Name</p> <p>Email</p> <p>Role</p> <p>Date</p>  <p>Actions</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allUsers.map((e, index) => (
                    <div key={index}>
                        <div className="listproduct-format-main listproduct-format">
                            <p>{e.id}</p>
                            <p className="cartitems-product-title">{e.name}</p>
                            <p>{e.email}</p>
                            <p>{e.role}</p>
                            <p>{formatDate(e.date)}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: '5px' }}>
                                <img src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" width={30} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(e)} />
                                <img
                                    className="listproduct-remove-icon"
                                    onClick={() => removeUser(e.id)}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSckjmVT1OZgpy0bFGkIAitjAu8Ed6_e2CLCA&s"
                                    alt="remove-icon"
                                    width={30}
                                />
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
            {editingUser && (
                <EditUser
                    open={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFormSubmit={handleFormSubmit}
                />
            )}
            {user && (
                <UserModal
                    open={modalOpenAdmin}
                    handleClose={() => setModalOpenAdmin(false)}
                    user={user}
                    handleInputChangeAdmin={handleInputChangeAdmin}
                    handleFormSubmitAdmin={handleFormSubmitAdmin}
                />
            )}
        </div>
    );
};

export default ListUser;
