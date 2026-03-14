import React from 'react';
import { useProduct, useDeleteProduct } from '../../hooks/useProducts';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = () => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        navigate('/products');
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
      <h2>{product.name}</h2>
      <p>Category: {product.category.name}</p>
      <p>Vendor: {product.vendor.name}</p>
      <Link to={`/products/${id}/edit`}>Edit</Link>
      <button onClick={handleDelete} disabled={deleteProductMutation.isLoading}>
        {deleteProductMutation.isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default Product;