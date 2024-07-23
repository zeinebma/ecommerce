import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';
import profile_image from '../Assets/nav-profile.svg';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { getTotalCartItems, user } = useContext(ShopContext);

  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('role');
    localStorage.removeItem('cart');
    window.location.replace("/");
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className='nav'>
      <Link to='/' onClick={() => { setMenu("shop") }} style={{ textDecoration: 'none' }} className="nav-logo">
        <img src={logo} alt="logo" />
        <p>CampExplore</p>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("vetements") }}><Link to='/category/vetements' style={{ textDecoration: 'none' }}>Vêtements et Accessoires</Link>{menu === "vetements" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("equipements") }}><Link to='/category/equipements' style={{ textDecoration: 'none' }}>Équipement de Camping</Link>{menu === "equipements" ? <hr /> : <></>}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to={`/cart/${user?.id}`}><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
        {user ?
          <>
            <div className="profile-container">
              <img onClick={toggleProfileMenu} className="profile-image" src={profile_image} alt="profile" />
              {isProfileOpen && (
                <div className="profile-menu">
                  <p>Welcome,
                    <br />
                    <strong> {user?.name}</strong>
                  </p>
                  <br />
                  <Link style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="profile-link" to={'/orders'}>
                    <img src="data:image/png;base64,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" alt="" />
                    <p> Orders</p>
                  </Link>
                  <hr />
                  <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </>
          : <Link to='/login' style={{ textDecoration: 'none' }}><button>Login</button></Link>}
      </div>
    </div>
  );
};

export default Navbar;
