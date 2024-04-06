<template>
    <v-container class="py-5" fluid>
        <v-card>
            <v-card-text>
                <v-row class="flex-column">
                    <v-data-table
                        :headers="headersUsuarios"
                        :items="usuarios"
                        :loading="loadTabla"
                        sort-by="estado"
                        :sort-desc="false"
                        loading-text="Cargando, por favor espere..."
                        :footer-props="{
                            'show-current-page': true,
                            itemsPerPageText: 'Registros mostrados',
                            pageText: '{0}-{1} de {2}',
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus',
                            'items-per-page-all-text': 'Todos'
                        }"
                        class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Usuarios</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-row class="justify-end">
                                    <v-btn
                                        color="orange"
                                        @click="dialogCrearUsuario = true">
                                        <v-icon
                                            left
                                            dark>
                                            mdi mdi-account-plus
                                        </v-icon>
                                        Nuevo
                                    </v-btn>
                                </v-row>

                            </v-toolbar>
                        </template>
                        <template v-slot:item.nombre="{ item }">
                            {{ item.nombre }} {{ item.apellido }}
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <v-chip
                                class="ma-2"
                                :color="item.estado == 'Activo' ? 'success' : 'error'">
                                {{ item.estado }}
                            </v-chip>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-tooltip top color="info" v-if="item.estado == 'Activo'">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        color="var(--c-orange)"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="cambiarEstadoUsuario(item.cedula, 'Inactivo')">
                                        mdi mdi-account-lock-outline
                                    </v-icon>
                                </template>
                                <span>Desactivar usuario</span>
                            </v-tooltip>
                            <v-tooltip top color="info" v-else>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        color="var(--c-orange)"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="cambiarEstadoUsuario(item.cedula, 'Activo')">
                                        mdi mdi-account-lock-open-outline
                                    </v-icon>
                                </template>
                                <span>Activar usuario</span>
                            </v-tooltip>
                        </template>
                        <template slot="no-data">
                            <p class="text-dark">Sin usuarios</p>
                        </template>
                    </v-data-table>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row justify="space-around">
            <v-col cols="auto">
                <v-dialog persistent transition="dialog-bottom-transition" max-width="520" v-model="dialogCrearUsuario">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Crear usuario</span>
                        </v-card-title>
                        <v-card-text class="px-1">
                            <v-form ref="formUsuario">
                                <v-col cols="12" class="py-0 px-1">
                                    <v-text-field type="number" v-model="paqueteUsuario.cedula" persistent-hint hint="Sin puntos o comas" filled :rules="cedulaRules" label="Cédula" required />
                                </v-col>
                                <v-row no-gutters>
                                    <v-col cols="6" sm="12" md="6" class="px-1 py-0">
                                        <v-text-field v-model="paqueteUsuario.nombre" filled max-length="79" :rules="campoRules" label="Nombres" required />
                                    </v-col>
                                    <v-col cols="6" sm="12" md="6" class="px-1 py-0">
                                        <v-text-field v-model="paqueteUsuario.apellido" max-length="79" filled :rules="campoRules" label="Apellidos" required />
                                    </v-col>
                                </v-row>
                                <v-col cols="12" class="py-0 px-1">
                                    <v-text-field type="tel" v-model="paqueteUsuario.telefono" filled :rules="campoRules" label="Celular" required />
                                </v-col>
                                <v-col cols="12" class="py-0 px-1">
                                    <v-text-field type="email" persistent-hint hint="Este correo se usará para recuperar la contraseña" v-model="paqueteUsuario.email" max-length="49" filled :rules="correoRules" label="Correo" required />
                                </v-col>
                                <v-col cols="12" class="py-0 px-1">
                                    <v-text-field v-model="paqueteUsuario.contrasena" filled :rules="campoRules" label="Contraseña" required />
                                </v-col>
                                <v-col cols="12" class="py-0 px-1">
                                    <v-select v-model="paqueteUsuario.rol" :rules="campoRules" :items="roles" item-text="descripcion" item-value="id" label="Rol" filled required no-data-text="Sin roles" />
                                </v-col>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn color="orange" @click="crearUsuario">Crear</v-btn>
                            <v-btn color="error" @click="dialogCrearUsuario = false">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <dialogMensaje :mostrar="dialogMsj.mostrar" :body="dialogMsj.body" :title="dialogMsj.title" :classTitle="dialogMsj.classTitle" @cerrado="dialogMsj.mostrar = false" />
    </v-container>
</template>
<script>
import axios from 'axios';
import dialogMensaje from "../components/dialogMensaje.vue";

export default {
    components: {
        dialogMensaje
    },
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        token: {},
        loadTabla: false,
        dialogMsj: {
            mostrar: false,
            classTitle: 'error',
            title: null,
            body: null
        },
        campoRules: [
            (v) => !!v || "Campo requerido",
            (v) => /^(?!\s*$).+/.test(v) || 'El campos no puede estar vacío'
        ],
        cedulaRules: [
            (v) => !!v || "Campo requerido",
            (v) => /\d+/.test(v) || 'Solo deben ser números'
        ],
        correoRules: [
            (v) => !!v || 'Campo requerido',
            (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Ingresa un correo válido'
        ],
        dialogCrearUsuario: false,
        roles: [],
        usuarios: [],
        headersUsuarios: [
            { text: "Cédula", value: "cedula" },
            { text: "Nombre", value: "nombre" },
            { text: "Correo", value: "email" },
            { text: "Celular", value: "telefono" },
            { text: "Rol", value: "rol.descripcion" },
            { text: 'Estado', value: "estado" },
            { text: 'Acciones', value: 'actions', sortable: false }
        ],
        paqueteUsuario: {
            cedula: null,
            nombre: null,
            apellido: null,
            telefono: null,
            email: null,
            contrasena: null,
            rol: null,
        }
    }),
    methods: {
        async crearUsuario() {
            if (this.$refs.formUsuario.validate()) {
                this.paqueteUsuario.cedula = parseInt(this.paqueteUsuario.cedula);
                await axios.post(`${this.rutaBackend}/usuario/crear`, this.paqueteUsuario, this.token).then(response => {

                    if (response.data.creado) {
                        this.$refs.formUsuario.reset();
                        this.dialogCrearUsuario = false;
                        this.getRoles();
                        this.getUsuarios();
                    }
                    this.dialogMsj.title = "Crear usuario";
                    this.dialogMsj.classTitle = response.data.creado ? "success" : "error";
                    this.dialogMsj.body = response.data.message;
                    this.dialogMsj.mostrar = true;

                }).catch(error => {
                    console.log(error);
                });
            }
        },
        async cambiarEstadoUsuario(cedula, estado) {
            if (cedula != null) {
                await axios.put(`${this.rutaBackend}/usuario/actualizar/${parseInt(cedula)}/estado/${estado}`, this.token).then(response => {
                    if (response.data.actualizado) {
                        this.getUsuarios();
                    }
                    this.dialogMsj.title = "Cambiar estado";
                    this.dialogMsj.classTitle = response.data.actualizado ? "success" : "error";
                    this.dialogMsj.body = response.data.message;
                    this.dialogMsj.mostrar = true;

                }).catch(error => {
                    console.log(error);
                });
            }
        },
        async getUsuarios() {
            this.loadTabla = true;
            await axios.get(`${this.rutaBackend}/usuario`, this.token).then(response => {
                this.usuarios = response.data;
            }).catch(error => {
                console.log(error);
            });
            this.loadTabla = false;
        },
        async getRoles() {
            await axios.get(`${this.rutaBackend}/rol`, this.token).then(response => {
                this.roles = response.data;
            });
        }
    },
    created() {
        this.token = {
            headers: {
                Authorization: `Bearer ${this.$store.getters.getToken}`
            }
        }
        this.getUsuarios();
        this.getRoles();
    }
}

</script>