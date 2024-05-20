import React, { useState } from 'react';

const ClientsTable = ({ clientes, onEditClient, onDeleteClient }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedClientes = [...clientes].sort((a, b) => {
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
                        <th onClick={() => requestSort('cuentasCobrar')}>Cuentas por Cobrar</th>
                        <th onClick={() => requestSort('status')}>Status</th>
                        <th>Acciones</th>
                        {/* Agrega más encabezados según tus datos */}
                    </tr>
                </thead>
                <tbody>
                    {sortedClientes.map((cliente, index) => (
                        <tr key={index}>
                            <td>{cliente.empresa}</td>
                            <td>{cliente.rfc}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.correo}</td>
                            <td>{cliente.cuentasCobrar}</td>
                            <td>{cliente.status}</td>
                            <td>
                                <button className='btnEditar' onClick={() => onEditClient(cliente.id)}>Editar</button>
                                <button className='btnEliminar' onClick={() => onDeleteClient(cliente.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
