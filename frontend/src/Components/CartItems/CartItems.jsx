import React, { useContext, useEffect } from 'react';
import './CartItems.css';
import cross_icon from '../Assets/cart_cross_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { backend_url, currency } from '../../App';
import PayButton from '../StripeButton/PayButton';

const CartItems = () => {
  const { products, user, cartItems, removeCartItem, getTotalCartAmount, addToCart, fetchCartItems } = useContext(ShopContext);

  const handleLogin = () => {
    alert('You must login first');
    window.location.href = '/login';
  };

  const auth = localStorage.getItem('auth-token');

  // Convert cartItems object to an array
  const cartItemsArray = Object.keys(cartItems).map(productId => ({
    ...cartItems[productId],
    id: productId,
  }));

  useEffect(() => {
    if (user) {
      fetchCartItems(user.id);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="cartitems">
        <h2>Loading...</h2>
      </div>
    );
  }


  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e.id]?.quantity > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format-main cartitems-format">
                <img className="cartitems-product-icon" src={e.image} alt="" />
                <p className="cartitems-product-title">{e.name}</p>
                <p>{currency}{e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id].quantity}</button>
                <p>{currency}{e.new_price * cartItems[e.id].quantity}</p>
                <img onClick={() => { removeCartItem(e.id) }} className="cartitems-remove-icon" src={cross_icon} alt="" />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            {/* <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div> */}
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{currency}{getTotalCartAmount()}</h3>
            </div>
          </div>
          {auth ? (
            <PayButton cartItems={cartItemsArray} userId={user.id} />
          ) : (
            <button className="btn btn-primary" onClick={handleLogin}>PROCEED TO CHECKOUT</button>
          )}
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
