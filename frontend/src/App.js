import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import LoginSignup from "./Pages/LoginSignup";
import NotFound from "./Components/error/notFound";
import Order from "./Pages/Order";
import CheckoutSuccess from "./Components/success/checkoutSuccess";
import AuthRoute from "./Components/AuthRoute";
import Profile from "./Components/Profile/Profile";

export const backend_url = 'http://localhost:4000';
export const currency = '€';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/category/:categoryName" element={<ShopCategory />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path="/cart/:id" element={<AuthRoute><Cart /></AuthRoute>} />
          <Route path="/checkout_success" element={<CheckoutSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/orders"
            element={
              <AuthRoute>
                <Order />
              </AuthRoute>
            }
          />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
