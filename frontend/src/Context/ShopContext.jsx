import React, { createContext, useState, useEffect } from 'react';
import { backend_url } from '../App';
import axios from 'axios';

export const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axios.get(`${backend_url}/api/auth/user`, {
        headers: { 'auth-token': token }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${backend_url}/api/product/allproducts`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`${backend_url}/api/cart/${userId}`);
      const data = await response.json();
      // console.log(data);
      const items = data.reduce((acc, item) => {
        acc[item.productId] = {
          id: item.productId,
          quantity: item.quantity,
          name: item.Product.name,
          new_price: item.Product.new_price,
          image: item.Product.image
        };
        return acc;
      }
        , {});
      // Update state and local storage with fetched cart items
      setCartItems(items);
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchProducts();
    // Load cart items from local storage on initial render
    const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems(user.id);
    }
  }, [user]);

  useEffect(() => {
    // Save cart items to local storage whenever they change
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert("User not authenticated")
        throw new Error("User not authenticated");
      }

      // Fetch product details
      const productResponse = await fetch(`${backend_url}/api/product/getproduct/${productId}`);
      const productData = await productResponse.json();

      // Add product to cart on the backend
      await axios.post(`${backend_url}/api/cart/add`, {
        userId: user.id,
        productId,
        quantity
      }, {
        headers: { 'auth-token': token }
      });
      setMessage(true)
      setTimeout(() => {
        setMessage(false)
      }, 3000);

      // Update state with the new cart item
      setCartItems((prevItems) => {
        const newQuantity = (prevItems[productId]?.quantity || 0) + quantity;
        const updatedItems = {
          ...prevItems,
          [productId]: {
            id: productId,
            quantity: newQuantity,
            name: productData.name,
            new_price: productData.new_price,
            image: productData.image
          }
        };
        // Save updated items to local storage
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        return updatedItems;
      });
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error("User not authenticated");

      await axios.delete(`${backend_url}/api/cart/remove/${user.id}/${productId}`, {
        headers: { 'auth-token': token }
      });

      setCartItems((prevItems) => {
        const updatedItems = { ...prevItems };
        delete updatedItems[productId];
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        return updatedItems;
      });
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

  const getTotalCartAmount = () => {
    return products.reduce((total, product) => {
      const quantity = cartItems[product.id]?.quantity || 0;
      return total + quantity * product.new_price;
    }, 0);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCategoryById = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/category/${id}`);
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return 'Unknown';
    }
  }

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        user,
        addToCart,
        message,
        removeCartItem,
        getTotalCartAmount,
        getTotalCartItems,
        fetchUserDetails,
        fetchCartItems,
        getCategoryById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
