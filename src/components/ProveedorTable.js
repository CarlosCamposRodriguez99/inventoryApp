import React from 'react';

const ProveedorTable = ({ proveedores, onEditProveedor, onDeleteProveedor }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de la Empresa</th>
                        <th>RFC</th>
                        <th>Teléfono</th>
                        <th>Correo Electrónico</th>
                        <th>Cuentas por Pagar</th>
                        <th>Status</th>
                        <th>Acciones</th>
                        {/* Agrega más encabezados según tus datos */}
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map((proveedor, index) => (
                        <tr key={index}>
                            <td>{proveedor.empresa}</td>
                            <td>{proveedor.rfc}</td>
                            <td>{proveedor.telefono}</td>
                            <td>{proveedor.correo}</td>
                            <td>{proveedor.cuentasCobrar}</td>
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
