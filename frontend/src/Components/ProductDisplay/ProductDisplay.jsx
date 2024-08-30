import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const ProductDisplay = ({ product }) => {
  const { addToCart, message } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">

        <div className="productdisplay-img-list">
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
          <img src={product.image} alt="img" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">{currency}{product.old_price}</div>
          <div className="productdisplay-right-price-new">{currency}{product.new_price}</div>
        </div>
        {/* <div className="productdisplay-right-description">
          {product.description}
        </div> */}
        <div className="productdisplay-right-size">
          <div className="quantity-control">
            <button className="btn-quantity" onClick={handleDecrement} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button className="btn-quantity" onClick={handleIncrement}>+</button>
          </div>
        </div>
        <button onClick={handleAddToCart}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
