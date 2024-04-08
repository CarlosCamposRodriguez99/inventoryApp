import React, { useState } from 'react';
import ActionButton from './ActionButton';

const ProductRow = ({ product, isEditing, handleEdit, handleCancelEdit, handleDelete, onUpdateProduct }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const saveChanges = () => {
    onUpdateProduct(editedProduct);
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>{isEditing ? <input type="text" name="numeroDeParte" value={editedProduct.numeroDeParte} onChange={handleChange} /> : product.numeroDeParte}</td>
      <td>{isEditing ? <input type="text" name="nombre" value={editedProduct.nombre} onChange={handleChange} /> : product.nombre}</td>
      <td>{isEditing ? <input type="number" name="costo" value={editedProduct.costo} onChange={handleChange} /> : product.costo}</td>
      <td>
        <img src={product.urlImagen} alt={product.nombre} style={{ width: '50px', height: '50px' }} />
      </td>
      <td>
        {isEditing ? (
          <>
            <ActionButton text="Guardar" onClick={saveChanges} />
            <ActionButton text="Cancelar" onClick={handleCancelEdit} />
          </>
        ) : (
          <>
            <ActionButton text="Editar" onClick={() => handleEdit(product.id)} />
            <ActionButton text="Eliminar" onClick={() => handleDelete(product.id)} />
          </>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
