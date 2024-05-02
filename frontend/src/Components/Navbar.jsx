import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [localStorage.getItem('token')]);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.reload(); // Refresh the page
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <Link to="/" className="text-xl font-semibold">Home</Link>
      <div>
        <Link to="/" className="mr-4">Search</Link>
        
        {token ? (
          <>
            <Link to="/myrecipes" className="mr-4">My Recipes</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
      {showLogoutPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-black">Are you sure you want to logout?</p>
            <div className="flex justify-center mt-4">
              <button className="mr-4 text-black" onClick={() => setShowLogoutPopup(false)}>Cancel</button>
              <button className="text-black" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
