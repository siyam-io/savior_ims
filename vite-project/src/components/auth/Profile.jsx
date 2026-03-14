import React, { useState } from 'react';
// import { toast } from 'react-hot-toast';
import { updateMe } from '../../api/auth.api';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty password field
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      const res = await updateMe(dataToUpdate);
      setUser(res.data);
      // toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-md">
          <div className="mb-2">
            <strong className="text-gray-700">Name:</strong> {user?.name}
          </div>
          <div className="mb-2">
            <strong className="text-gray-700">Email:</strong> {user?.email}
          </div>
          <div className="mb-2">
            <strong className="text-gray-700">Role:</strong> {user?.role?.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
