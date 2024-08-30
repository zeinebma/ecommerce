import React, { useContext, useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';
import profile_image from '../Assets/nav-profile.svg';
import axios from 'axios';
import { backend_url } from '../../App';

const Navbar = () => {
  const [menu, setMenu] = useState("Categories");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { getTotalCartItems, user } = useContext(ShopContext);
  const menuRef = useRef();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/category/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
        <li onClick={() => { setMenu("shop") }}>
          <Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li>
          <Select
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            displayEmpty
            renderValue={(selected) => selected ? selected : 'Categories'}
            style={{ minWidth: 150 }}
          >
            <MenuItem disabled value="">
              <em>Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.name}
                component={Link}
                to={`/category/${category.name}`}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </li>
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
                  {/* <br /> */}
                  <Link style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop:'20px' }} className="profile-link" to={'/orders'}>
                    <img src="https://cdn-icons-png.freepik.com/256/16767/16767941.png?ga=GA1.1.426852349.1711671118&semt=ais_hybrid" alt="" />
                    <p>
                      Orders
                    </p>
                  </Link>
                  <Link style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="profile-link" to={'/orders'}>
                    <img src="https://cdn-icons-png.freepik.com/256/12122/12122497.png?ga=GA1.1.426852349.1711671118&semt=ais_hybrid" style={{ borderRadius: '100px' }} alt="" />
                    <p>
                      Profile
                    </p>
                  </Link>
                  <button onClick={handleLogout} style={{ color: 'white', backgroundColor: '#e13131' }}>Logout</button>
                </div>
              )}
            </div>
          </>
          :
          <Link to='/login'>Login</Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
