import React, { useContext } from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
import { ShopContext } from '../../Context/ShopContext';

const Breadcrums = ({ cat, product }) => {
  const { message } = useContext(ShopContext);

  return (
    <>
      <div className="center_message">

        <div className='alert_add_product'>
          {
            message &&
            <p> <strong> &#10003;</strong> the product added successfully</p>
          }
        </div>
      </div>
      <div className='breadcrums'>
        HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {cat} <img src={arrow_icon} alt="" /> {product.name}
      </div>
    </>
  )
}

export default Breadcrums
