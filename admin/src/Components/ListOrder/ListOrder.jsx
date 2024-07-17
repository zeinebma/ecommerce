import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { backend_url, currency } from "../../App";
import EditOrder from "../EditOrder/EditOrder";
import OrderDetails from "../OrderDetails/OrderDetails";
import './ListOrder.css'

const ListOrder = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [modalOpenShow, setModalOpenShow] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const fetchOrders = () => {
    fetch(`${backend_url}/api/order/listorder`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched orders:', data); // Debug log
        setAllOrders(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };

  const fetchUsers = () => {
    fetch(`${backend_url}/api/auth/users`)
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrderById = async (orderId) => {
    try {
      const response = await fetch(`${backend_url}/api/order/${orderId}`);
      const data = await response.json();
      if (response.ok) {
        setOrderDetails(data);
      } else {
        console.error('Error fetching order details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const updateOrder = async (order) => {
    await fetch(`${backend_url}/api/order/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    fetchOrders();
  };

  const removeOrder = async (id) => {
    await fetch(`${backend_url}/api/order/remove/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchOrders();
  };

  const handleEditClick = (order) => {
    setEditingOrder(order.id);
    setFormData({
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      delivery_status: order.delivery_status,
      date: order.date,
    });
    setModalOpenEdit(true);
  };

  const handleViewDetailsClick = (orderId) => {
    fetchOrderById(orderId);
    setModalOpenShow(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateOrder(formData);
    setEditingOrder(null);
    setModalOpenEdit(false);
  };

  const getUserName = (userId) => {
    const user = Array.isArray(users) ? users.find((e) => e.id === userId) : null;
    return user ? user.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MM-dd-yyyy HH:mm');
  };

  const getStatusStyle = (delivery_status) => {
    switch (delivery_status) {
      case 'Pending':
        return { color: 'yellow' };
      case 'Success':
        return { color: 'green' };
      case 'Closed':
        return { color: 'red' };
      default:
        return {};
    }
  };

  return (
    <div className="listproduct">
      <h1>All Orders List</h1>
      <div className="listproduct-format-main">
        <p>ID</p> <p>Name</p> <p>Total amount</p> <p>Status</p> <p>Date</p> <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {Array.isArray(allOrders) &&
          allOrders.map((e, index) => (
            <div key={index}>
              <div className="listproduct-format-main listproduct-format">
                <p>{e.id}</p>
                <p className="cartitems-product-title">{getUserName(e.userId)}</p>
                <p>{e.total} {currency}</p>
                <p style={getStatusStyle(e.delivery_status)}>{e.delivery_status}</p>
                <p>{formatDate(e.date)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png"
                    width={30}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEditClick(e)}
                  />
                  <img
                    className="listproduct-remove-icon"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSckjmVT1OZgpy0bFGkIAitjAu8Ed6_e2CLCA&s"
                    width={30}
                    alt=""
                    onClick={() => removeOrder(e.id)}
                  />
                  <button onClick={() => handleViewDetailsClick(e.id)}>View Details</button>
                </div>
              </div>
              <hr />
            </div>
          ))}
      </div>
      {editingOrder && (
        <EditOrder
          open={modalOpenEdit}
          handleClose={() => setModalOpenEdit(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          users={users}
        />
      )}
      {orderDetails && (
        <OrderDetails
          open={modalOpenShow}
          handleClose={() => setModalOpenShow(false)}
          orderDetails={orderDetails}
          getUserName={getUserName}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ListOrder;
