
export const navigation = [
    {
        text: 'Poliza Nomina',
        icon: 'folder',
        items: [
            {
                text: 'Generador',
                path: '/nomina/genera',
                icon: 'folder'
            },
            {
                text: 'Polizas Generadas',
                path: '/nomina/consultaGeneradas',
                icon: 'folder'
            },
            {
                text: 'Visualiza Póliza',
                path: '/nomina/vista',
                icon: 'folder'
            },
            {
                text: 'Vista Previa',
                path: '/nomina/previa',
                icon: 'folder'
            },
            {
                text: 'Pólizas Pendientes',
                path: '/nomina/pendientes',
                icon: 'folder'
            }
        ]
    },
    {
        text: 'Reporte Nomina',
        icon: 'columnchooser',
        items: [
            {
                text: 'Conciliación',
                path: '/reporte/conciliacion',
                icon: 'folder'
            },
            {
                text: 'Empleados',
                path: '/reporte/empleados',
                icon: 'folder'
            },
            {
                text: 'Empleados Prorrateo',
                path: '/reporte/prorrateados',
                icon: 'folder'
            },
            {
                text: 'concentrado',
                path: '/reporte/concentrado',
                icon: 'folder'
            }
        ]
    }
];
