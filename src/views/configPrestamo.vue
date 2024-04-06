<template>
    <v-card class="py-4">
        <v-row class="justify-content-evenly">
            <v-card>
                <v-card-title>
                    Registrar estado préstamo
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" lazy-validation>
                        <v-text-field
                            v-model="paquete.estado"
                            :rules="campoRules"
                            label="Estado préstamo"
                            placeholder="Ej: Devuelto" filled
                            required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="guardarEstadoPrestamo" class="btn-tabla">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
        <v-row class="mt-4" justify="center">
            <v-data-table
                :headers="headersEstado"
                :items="itemsEstado"
                :footer-props="{
                    'show-current-page': true,
                    'items-per-page-options': [5, 10, 15],
                    itemsPerPageText: 'Registros mostrados',
                    pageText: '{0}-{1} de {2}',
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus'
                }"
                class="elevation-1">
                <template v-slot:top>
                    <v-toolbar
                        flat>
                        <v-toolbar-title>Estados de préstamo</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical></v-divider>
                    </v-toolbar>
                </template>
                <template v-slot:item.estado="{ item }">
                    <v-chip
                        class="ma-2"
                        :color="item.id == 1 ? 'primary' : item.id == 2 ? 'orange' : item.id == 3 ? 'success' : 'error'">
                        {{ item.estado }}
                    </v-chip>
                </template>
                <template slot="no-data">
                    <p class="text-dark">Sin datos de estados de préstamo</p>
                </template>
            </v-data-table>
        </v-row>
        <!--Dialog para mensajes temporales-->
        <dialogMensaje :mostrar="dialogMsj" :title="detalleMsj.title" :body="detalleMsj.body" :classTitle="detalleMsj.classTitle" @cerrado="dialogMsj = false" />
    </v-card>
</template>
<script>
import axios from 'axios'
import dialogMensaje from '../components/dialogMensaje.vue';
export default {
    components: { dialogMensaje },
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        valid: true,
        token: {},
        disableBtn: false,
        validEditar: true,
        campoRules: [
            (v) => !!v || "Campo requerido",
        ],
        paquete: {
            estado: null,
        },
        paqueteEditar: {
            id: null, estado: null
        },
        headersEstado: [
            { text: 'Estado', value: 'estado', align: 'center' },
        ],
        itemsEstado: [],
        dialogEditar: false,
        dialogEliminar: false,
        dialogMsj: false,
        detalleMsj: {
            classTitle: 'error',
            title: null,
            body: null
        },
        loadTabla: false,
    }),
    methods: {
        async obtenerEstadosPrestamo() {
            this.loadTabla = true;
            await axios.get(`${this.rutaBackend}/estado-prestamo`, this.token).then(response => {
                this.itemsEstado = response.data;
            }).catch(error => {
                this.detalleMsj.title = "Obtener estados de préstamo";
                this.detalleMsj.body = "No se pudo obtener los estados de préstamo, contacta con soporte";
                this.dialogMsj = true;
                console.log(`Error: ${error}`);
            });
            this.loadTabla = false;
        },
        editarEstado(item) {
            this.paqueteEditar.id = this.items[item].id;
            this.paqueteEditar.estado = this.items[item].estado;
            this.dialogEditar = true;
        },

        cerrarDialogEditar() {
            this.dialogEditar = false;
            this.paqueteEditar.id = null;
            this.paqueteEditar.estado = null;
        },
        async guardarEstadoPrestamo() {
            if (this.$refs.form.validate()) {
                this.$emit('loading', 'Creando estado de préstamo...');
                await axios.post(`${this.rutaBackend}/estado-prestamo/crear`, this.paquete, this.token).then((response) => {
                    if (response.data.creado) {
                        this.obtenerEstadosPrestamo();
                        this.$refs.form.reset();
                    }
                    this.detalleMsj.title = "Crear equipo";
                    this.detalleMsj.classTitle = response.data.creado ? "success" : "error";
                    this.detalleMsj.body = response.data.message;
                    this.dialogMsj = true;
                }).catch(error => {
                    this.detalleMsj.title = "Guardar estado de equipo";
                    this.detalleMsj.classTitle = 'error';
                    this.detalleMsj.body = "No se pudo guardar el estado de equipo, contacta con soporte";
                    this.dialogMsj = true;
                    console.log(`Error creando: ${error}`);
                });
                this.$emit('close');
            }
        },
    }, created() {
        this.token = {
            headers: {
                Authorization: `Bearer ${this.$store.getters.getToken}`
            }
        }
        this.obtenerEstadosPrestamo();
    }
}
</script>
<style></style>