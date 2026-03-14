import React from 'react';
import { useUser, useDeleteUser } from '../../hooks/useUsers';
import { useParams, Link, useNavigate } from 'react-router-dom';

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useUser(id);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = () => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        navigate('/users');
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <Link to={`/users/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete} disabled={deleteUserMutation.isLoading}>
        {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default User;