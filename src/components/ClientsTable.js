import React from 'react';

const ClientsTable = ({ clientes, onEditClient, onDeleteClient }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de la Empresa</th>
                        <th>RFC</th>
                        <th>Teléfono</th>
                        <th>Correo Electrónico</th>
                        <th>Cuentas por cobrar</th>
                        <th>Status</th>
                        <th>Acciones</th>
                        {/* Agrega más encabezados según tus datos */}
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, index) => (
                        <tr key={index}>
                            <td>{cliente.empresa}</td>
                            <td>{cliente.rfc}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.correo}</td>
                            <td>{cliente.cuentasCobrar}</td>
                            <td>{cliente.status}</td>
                            {/* Agrega más celdas según tus datos */}
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
