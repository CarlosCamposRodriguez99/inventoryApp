import React, { useState } from 'react';

const ProveedorTable = ({ proveedores, onEditProveedor, onDeleteProveedor }) => {

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedProveedores = [...proveedores].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
    
        if (typeof aValue === 'undefined' || typeof bValue === 'undefined') {
            return 0;
        }
    
        if (sortConfig.direction === 'ascending') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('empresa')}>Nombre</th>
                        <th onClick={() => requestSort('rfc')}>RFC</th>
                        <th onClick={() => requestSort('telefono')}>Teléfono</th>
                        <th onClick={() => requestSort('correo')}>Correo Electrónico</th>
                        <th onClick={() => requestSort('cuentasPagar')}>Cuentas por Pagar</th>
                        <th onClick={() => requestSort('status')}>Status</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProveedores.map((proveedor, index) => (
                        <tr key={index}>
                            <td>{proveedor.empresa}</td>
                            <td>{proveedor.rfc}</td>
                            <td>{proveedor.telefono}</td>
                            <td>{proveedor.correo}</td>
                            <td>{proveedor.cuentasPagar}</td>
                            <td>{proveedor.status}</td>
                            {/* Agrega más celdas según tus datos */}
                            <td>
                                <button className='btnEditar' onClick={() => onEditProveedor(proveedor.id)}>Editar</button>
                                <button className='btnEliminar' onClick={() => onDeleteProveedor(proveedor.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProveedorTable;
