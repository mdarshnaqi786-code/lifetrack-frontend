import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiUser, FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const firstLetter = user.fullname
    ? user.fullname.charAt(0).toUpperCase()
    : "U";

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex justify-end items-center px-10">

      <div className="relative" ref={dropdownRef}>

        {/* Profile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-slate-100 rounded-xl px-3 py-2 transition"
        >

          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">

            {firstLetter}

          </div>

          <MdKeyboardArrowDown
            className={`text-2xl transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />

        </button>

        {/* Dropdown */}

        {open && (

          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">

            <div className="px-5 py-4 border-b">

              <p className="font-semibold text-slate-800">
                {user.fullname}
              </p>

              <p className="text-sm text-slate-500 truncate">
                {user.email}
              </p>

            </div>

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-100 transition"
            >

              <FiUser className="text-lg" />

              My Profile

            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition"
            >

              <FiLogOut className="text-lg" />

              Logout

            </button>

          </div>

        )}

      </div>

    </header>
  );
}

export default Navbar;