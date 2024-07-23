import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrums = ({ cat, product }) => {

  return (
    <div className='breadcrums'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {cat} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}

export default Breadcrums
