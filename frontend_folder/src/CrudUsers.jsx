import React, { useState } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/users`;
console.log("API_BASE =", API_BASE);

export default function CrudUsers() {
  const [page, setPage] = useState("landing");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  async function fetchUsers() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    try {
      // ensure role is uppercase to match backend enum
      const payload = { ...signupData, role: signupData.role?.toUpperCase() };
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }

      setMessage("Signup successful! Please login.");
      setSignupData({ username: "", email: "", password: "", role: "STUDENT" });
      setPage("login");
    } catch (err) {
      setMessage("Signup error: " + err.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const payload = { ...loginData, role: loginData.role?.toUpperCase() };
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // backend now returns user object or error message
      const data = await res.json();
      if (!data || data.id == null) {
        throw new Error(typeof data === 'string' ? data : 'Invalid credentials');
      }

      setMessage("Login successful!");
      setPage("dashboard");
      fetchUsers();
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const id = editingUser.id;

    const payload = { ...editData, role: editData.role?.toUpperCase() };
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditingUser(null);
    fetchUsers();
  }

  async function handleDelete(id) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    handleSignup(e);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    handleUpdate(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Landing */}
        {page === "landing" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to User Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your users efficiently and securely
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button
                onClick={() => setPage("login")}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
              >
                Login
              </button>

              <button
                onClick={() => setPage("signup")}
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border-2 border-indigo-600 hover:bg-indigo-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {message && page !== "landing" && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg shadow-md">
            {message}
          </div>
        )}

        {/* ---------------- LOGIN PAGE ---------------- */}
        {page === "login" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Login
            </h2>

            {/* role selector */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-gray-200 rounded-lg p-1">
                {['STUDENT','MENTOR','ADMIN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLoginData({ ...loginData, role: r })}
                    className={`px-4 py-2 rounded-lg focus:outline-none
                      ${loginData.role === r ? 'bg-white text-indigo-600' : 'text-gray-600'}`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />

              <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">
                Login
              </button>
            </form>

            <button
              onClick={() => setPage("signup")}
              className="mt-4 w-full text-indigo-600 underline"
            >
              Create Account
            </button>

            <button
              onClick={() => setPage("landing")}
              className="mt-2 w-full text-gray-600 underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ---------------- SIGNUP PAGE ---------------- */}
        {page === "signup" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Sign Up
            </h2>

            {/* role selector */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-gray-200 rounded-lg p-1">
                {['STUDENT','MENTOR','ADMIN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSignupData({ ...signupData, role: r })}
                    className={`px-4 py-2 rounded-lg focus:outline-none
                      ${signupData.role === r ? 'bg-white text-indigo-600' : 'text-gray-600'}`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSignupSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />

              <button className="w-full py-3 bg-indigo-600 text-white rounded-lg">
                Sign Up
              </button>
            </form>

            <button
              onClick={() => setPage("login")}
              className="mt-4 w-full text-indigo-600 underline"
            >
              Already have an account?
            </button>

            <button
              onClick={() => setPage("landing")}
              className="mt-2 w-full text-gray-600 underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ---------------- DASHBOARD ---------------- */}
        {page === "dashboard" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">All Users</h2>

              <button
                onClick={() => {
                  setPage("landing");
                  setMessage("");
                  setLoginData({ email: "", password: "", role: "Student" });
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role ? (u.role.charAt(0) + u.role.slice(1).toLowerCase()) : ''}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setEditData({
                            username: u.username,
                            email: u.email,
                            password: "",
                            role: (u.role || "STUDENT").toString().toUpperCase(),
                          });
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EDIT FORM */}
            {editingUser && (
              <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Edit User</h3>

                <form className="space-y-4" onSubmit={handleUpdateSubmit}>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) =>
                      setEditData({ ...editData, username: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={editData.password}
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <div className="flex justify-center mb-4">
                    <div className="inline-flex bg-gray-200 rounded-lg p-1">
                      {['STUDENT','MENTOR','ADMIN'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setEditData({ ...editData, role: r })}
                          className={`px-3 py-1 rounded-lg focus:outline-none
                            ${editData.role === r ? 'bg-white text-indigo-600' : 'text-gray-600'}`}
                        >
                          {r.charAt(0) + r.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-2 bg-green-600 text-white rounded-lg">
                    Save Changes
                  </button>

                  <button
                    onClick={() => setEditingUser(null)}
                    type="button"
                    className="w-full py-2 bg-gray-600 text-white rounded-lg mt-2"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
