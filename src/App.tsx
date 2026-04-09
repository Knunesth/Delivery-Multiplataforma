import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Onboarding Pages
import Splash from './pages/onboarding/Splash';
import Welcome from './pages/onboarding/Welcome';
import Login from './pages/onboarding/Login';
import Register from './pages/onboarding/Register';

// Main Pages
import Home from './pages/main/Home';
import Search from './pages/main/Search';
import Categories from './pages/main/Categories';

// Product Pages
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import Customization from './pages/products/Customization';

// Cart & Order Pages
import Cart from './pages/cart/Cart';
import Checkout from './pages/cart/Checkout';
import Confirmation from './pages/cart/Confirmation';

// User Pages
import Profile from './pages/user/Profile';
import OrderTracking from './pages/user/OrderTracking';

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Onboarding Flow (No Layout) */}
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Flow (With Bottom Navigation Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Pages without Bottom Nav but with Header/Back Button */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/product/:id/customize" element={<Customization />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
