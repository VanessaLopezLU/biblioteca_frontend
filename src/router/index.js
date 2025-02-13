import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
Vue.use(VueRouter);

//rutas de elementos del sidebar
const routes = [{
        path: "/",
        name: "Login",
        component: () =>
            import ("../views/iniciarSesion.vue"),
    },
    {
        path: "/recuperar",
        name: "restablecimiento",
        component: () =>
            import ("../views/restcontrasena.vue"),
    },
    {
        path: "/cambio-contrasena/:cedula(\\d+)/:token",
        name: "CambioContrasena",
        component: () =>
            import ("../views/cambioContrasena.vue"),
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () =>
            import ("../views/dashboard"),
        children: [{
                name: "DashboardWelcome",
                path: "/dashboard/welcome",
                component: () =>
                    import ("../views/welcome.vue"),
                beforeEnter: (to, from, next) => {
                    const usuario = store.getters.getUsuario;
                    return usuario ? next() : next("/");
                },
            },
            {
                name: "ManagerView",
                path: "/dashboard/ManagerView",
                component: () =>
                    import ("../views/dispositivos/ManagerView"),
                children: [{
                        name: "EquposView",
                        path: "/dashboard/ManagerView/",
                        component: () =>
                            import ("../components/Equipo.vue"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                    {
                        name: "VideoBeam",
                        path: "/dashboard/ManagerView/VideoBeam",
                        component: () =>
                            import ("../views/dispositivos/VideoBeam"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                    {
                        name: "Portatil",
                        path: "/dashboard/ManagerView/Portatil",
                        component: () =>
                            import ("../views/dispositivos/Portatil"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                    {
                        name: "Mouse",
                        path: "/dashboard/ManagerView/Mouse",
                        component: () =>
                            import ("../views/dispositivos/Mouse"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                    {
                        name: "Cargador",
                        path: "/dashboard/ManagerView/Cargador",
                        component: () =>
                            import ("../views/dispositivos/Cargador"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                    {
                        name: "Cable HDMI",
                        path: "/dashboard/ManagerView/CableHdmi",
                        component: () =>
                            import ("../views/dispositivos/CableHdmi"),
                        beforeEnter: (to, from, next) => {
                            const rolesAllow = ["ADMIN"];
                            const usuario = store.getters.getUsuario;
                            if (usuario) {
                                return rolesAllow.includes(
                                        usuario.rol.descripcion.toUpperCase()
                                    ) ?
                                    next() :
                                    next(from);
                            }
                            return next("/");
                        },
                    },
                ],
            },
            {
                name: "estadoEquipo",
                path: "/dashboard/estadoEquipo",
                component: () =>
                    import ("../views/EstadoEquipo"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                path: "/dashboard/prestamo",
                name: "Prestamo",
                component: () =>
                    import ("../views/prestamo.vue"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN", "INSTRUCTOR"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                path: "/dashboard/miprestamo",
                name: "Miprestamo",
                component: () =>
                    import ("../views/misprestamos.vue"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN", "INSTRUCTOR"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                path: "/dashboard/configprestamo",
                name: "Configprestamo",
                component: () =>
                    import ("../views/configPrestamo.vue"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                name: " Devolucion",
                path: "/dashboard/devolucion",
                component: () =>
                    import ("../views/devolucion.vue"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN", "INSTRUCTOR"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                name: "Entrega",
                path: "/dashboard/entrega",
                component: () =>
                    import ("../views/entrega.vue"),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                },
            },
            {
                name: 'Usuarios',
                path: '/dashboard/usuarios',
                component: () =>
                    import ('../views/Usuarios.vue'),
                beforeEnter: (to, from, next) => {
                    const rolesAllow = ["ADMIN"];
                    const usuario = store.getters.getUsuario;
                    if (usuario) {
                        return rolesAllow.includes(usuario.rol.descripcion.toUpperCase()) ?
                            next() :
                            next(from);
                    }
                    return next("/");
                }
            }
        ],
    },
];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes,
});

export default router;