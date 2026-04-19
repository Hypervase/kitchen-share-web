import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import EditListing from './pages/EditListing';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import CookProfile from './pages/CookProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Navigate to="/" replace />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:id" element={<EditListing />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cook/:id" element={<CookProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;