import React from 'react';

const ProductTable = ({ products, onEditProduct, onDeleteProduct }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Parte</th>
            <th>Descripción</th>
            <th>Costo</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.numeroDeParte}</td>
              <td>{product.nombre}</td>
              <td>{product.costo}</td>
              <td>
                <img src={product.imagen} alt={product.nombre} style={{ width: '100px', height: 'auto' }} />
              </td>
              <td>
                <button className='btnEditar' onClick={() => onEditProduct(product.id)}>Editar</button>
                <button className='btnEliminar' onClick={() => onDeleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
