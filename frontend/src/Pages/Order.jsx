// src/Components/Order/Order.js
import React, { useEffect, useState } from 'react';
import { backend_url } from '../App';
import './CSS/order.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Order = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const user = await fetchUserDetails();
        fetch(`${backend_url}/api/order/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            });

    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.get('http://localhost:4000/api/auth/user', {
                headers: { 'auth-token': token }
            });
            return response.data.user;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            throw error;
        }
    };

    const getStatusStyle = (delivery_status) => {
        switch (delivery_status) {
            case 'Pending':
                return { color: 'orange', fontWeight: 'bold' };
            case 'Success':
                return { color: 'green', fontWeight: 'bold' };
            case 'Closed':
                return { color: 'red', fontWeight: 'bold' };
            default:
                return {};
        }
    };

    return (
        <div className="orders">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order">
                        <h2>Order number {order.id}</h2>
                        <p>Total Amount: ${order.total}</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>delivery status: <p style={getStatusStyle(order.delivery_status)}>{order.delivery_status}</p> </p>
                        <p>Payment status: {order.payment_status}</p>
                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                        <div className="order-items">
                            {order.OrderItems.map(item => (
                                <Link to={`/product/${item.Product.id}`} >
                                    <div key={item.id} className="order-item">
                                        <img src={`${item.Product.image}`} alt={item.Product.name} />
                                        <div className="order-item-info">
                                            <h3>{item.Product.name}</h3>
                                            <p>Price: ${item.price}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div >
    );
};

export default Order;
