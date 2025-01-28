import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '',  company: '' });
  const [notification, setNotification] = useState(null); // For delete notification
  const [showModal, setShowModal] = useState(false); 

  // Fetch users from API
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  // Handle form submission for adding new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone  || !newUser.company) return;
    const addedUser = {
      ...newUser,
      id: users.length + 1, // Add a simple incremental ID for new user
    };
    setUsers([...users, addedUser]);
    setNewUser({ name: '', email: '', phone: '', company: '' }); // Clear input after adding
    setShowModal(false); // Close modal after adding user
  };

  // Handle editing a user
  const handleEditClick = (user) => {
    setIsEditing(true);
    setEditUser({ ...user });
    setShowModal(true); // Open modal in edit mode
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map((user) =>
      user.id === editUser.id ? editUser : user
    );
    setUsers(updatedUsers);
    setIsEditing(false);
    setEditUser(null);
    setShowModal(false);
  };

  // delete user
  const handleDelete = (id, name) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    setNotification(`${name} - User Deleted!`); // Show notification
    setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
  };
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => {
      if (name === 'company') {
        return { ...prevUser, company: { name: value } }; 
      }
      return { ...prevUser, [name]: value };
    });
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'company') {
      setEditUser((prevUser) => ({ ...prevUser, company: { name: value } })); 
    } else {
      setEditUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User's List</h1>
      <button className='add-button' onClick={() => { setShowModal(true); setIsEditing(false); }}>Add User</button>
      {/* Notification for user delete */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <div className="card-container">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3 className="header">{user.name}</h3>
            <div className="button-container">
              <button className="edit-button" onClick={() => handleEditClick(user)}>
                <img src="./edit.png" width={"23px"} height={"23px"} alt="Edit" />
              </button>
              <button className="edit-button" onClick={() => handleDelete(user.id, user.name)}>
                <img src="./trash.png" width={"23px"} height={"23px"} alt="Delete" />
              </button>
            </div>

            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Company:</strong> {user.company.name}</p>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
            <input
              type="text"
              name="name"
              value={isEditing ? editUser.name : newUser.name}
              onChange={isEditing ? handleEditChange : handleNewUserChange}
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={isEditing ? editUser.email : newUser.email}
              onChange={isEditing ? handleEditChange : handleNewUserChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={isEditing ? editUser.phone : newUser.phone}
              onChange={isEditing ? handleEditChange : handleNewUserChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="company"
              value={isEditing ? editUser.company.name : newUser.company.name}
              onChange={isEditing ? handleEditChange : handleNewUserChange}
              placeholder="Company"
            />
            <div className="modal-buttons">
              <button className='cancel-button' onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={isEditing ? handleSaveEdit : handleAddUser}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
