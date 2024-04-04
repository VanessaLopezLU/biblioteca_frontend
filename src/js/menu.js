export const menuRoles = [
  {
    rol: "Admin",
    menu: [
      {
        header: "Navegación principal",
        hiddenOnCollapse: true,
      },
      {
        href: "/dashboard/welcome",
        title: "Inicio",
        icon: "fa fa-home",
      },
      {
        title: "Equipo",
        icon: "mdi mdi-devices",
        child: [
          {
            href: "/dashboard/ManagerView",
            title: "Administrar equipos",
            icon: "mdi mdi-plus",
          },
          {
            href: "/dashboard/estadoEquipo",
            title: "Configuración para equipos",
            icon: "mdi mdi-format-list-bulleted-type",
          },
        ],
      },
      {
        title: "Préstamo",
        icon: "mdi mdi-package-variant-closed-check",
        child: [
          {
            title: "Préstamos",
            icon: "mdi mdi-file-eye-outline",
            href: "/dashboard/miprestamo",
          },
          {
            title: "Devolución de préstamo",
            icon: "mdi mdi-lan-check",
            href: "/dashboard/devolucion",
          },
          {
            title: "Entrega de préstamo",
            icon: "mdi mdi-package-check",
            href: "/dashboard/entrega",
          },
          {
            title: "Configurar préstamo",
            icon: "mdi mdi-format-list-bulleted-type",
            href: "/dashboard/configprestamo",
          },
        ],
      },
    ],
  },
  {
    rol: "Instructor",
    menu: [
      {
        header: "Navegación principal",
        hiddenOnCollapse: true,
      },
      {
        href: "/dashboard/welcome",
        title: "Inicio",
        icon: "fa fa-home",
      },
      {
        title: "Préstamo",
        icon: "mdi mdi-package-variant-closed-check",
        child: [
          {
            title: "Préstamo",
            icon: "mdi mdi-book-plus-multiple",
            href: "/dashboard/prestamo",
          },

          {
            title: "Mis préstamos",
            icon: "mdi mdi-file-eye-outline",
            href: "/dashboard/miprestamo",
          },
        ],
      },
    ],
  },
];
