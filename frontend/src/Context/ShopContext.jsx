import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

  }, []);

  useEffect(() => {
    // Fetch products
    fetch(`${backend_url}/api/product/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data));

    // Retrieve cart items if user is logged in
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${backend_url}/api/cart/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': authToken,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const parsedCart = JSON.parse(data.cartData || '{}');
          setCartItems(parsedCart);
          localStorage.setItem('cartItems', JSON.stringify(parsedCart)); // Save to localStorage
        });
    }
  }, []);


  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) { }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalItem += itemInfo ? cartItems[item] : 0;
        } catch (error) { }
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login");
      return;
    }
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    // Update backend cart
    fetch(`${backend_url}/api/cart/addtocart`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'auth-token': localStorage.getItem("auth-token"),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 1) - 1 };
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Save to localStorage

    // Update backend cart
    fetch(`${backend_url}/api/cart/removefromcart`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'auth-token': localStorage.getItem("auth-token"),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const contextValue = {
    products,
    getTotalCartItems,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
