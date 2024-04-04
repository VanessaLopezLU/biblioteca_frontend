<template>
    <v-card class="py-4">
        <v-row class="justify-content-evenly">
            <v-card>
                <v-card-title>
                    Registrar estado préstamo
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="validEstado" lazy-validation>
                        <v-text-field
                            v-model="paquete.estado"
                            :rules="campoRules"
                            label="Estado préstamo"
                            placeholder="Ej: Devuelto"
                            required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="guardarEstadoPrestamo" :disabled="disableBtn" class="btn-tabla">Guardar</v-btn>
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
                        :color="item.id == 1 ? 'primary' : item.id == 2 ? 'orange' : 'success'">
                        {{ item.estado }}
                    </v-chip>
                </template>
                <template v-slot:item.actions="{ index }">
                    <v-tooltip top color="error">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                color="var(--c-orange)" v-bind="attrs" v-on="on" @click="eliminarEstado(index)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <span>Eliminar estado préstamo</span>
                    </v-tooltip>
                </template>
                <template slot="no-data">
                    <p class="text-dark">Sin datos de estados de préstamo</p>
                </template>
            </v-data-table>
        </v-row>
        <!--Dialog editar-->
        <v-row justify="space-around">
            <v-col cols="auto">
                <v-dialog
                    transition="dialog-bottom-transition"
                    max-width="500" v-model="dialogEditar">
                    <v-card>
                        <v-toolbar
                            color="var(--c-orange)"
                            dark class="elevation-1">
                            <h2>Editar estado de equipo</h2>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="formEditar" v-model="validEditar" lazy-validation class="mt-3">
                                <v-text-field
                                    v-model="paqueteEditar.estado"
                                    :rules="campoRules"
                                    label="Estado de equipo"
                                    placeholder="Ej: Bueno"
                                    required></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn
                                @click="guardarEditarItem()" class="btn-tabla">Actualizar</v-btn>
                            <v-btn depressed class="btn-cancelar" @click="cerrarDialogEditar()">
                                Cancelar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
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
        disableBtn: false,
        validEstado: true,
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
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'actions', sortable: false, align: 'right' }
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
            await axios.get(`${this.rutaBackend}/estado-prestamo`).then(response => {
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

        eliminarEstado(idEstado) {
            const index = this.itemsEstado.indexOf(idEstado);
            confirm('Are you sure you want to delete this item?') && this.itemsEstado.splice(index, 1)
        },

        cerrarDialogEditar() {
            this.dialogEditar = false;
            this.paqueteEditar.id = null;
            this.paqueteEditar.estado = null;
        },

        async guardarEditarItem() {
            if (this.$refs.formEditar.validate()) {
                //await axios.pu
                console.log('Val');
            }
        },
        async guardarEstadoPrestamo() {
            if (this.$refs.form.validate()) {
                this.disableBtn = true;
                await axios.post(`${this.rutaBackend}/estado-prestamo/crear`, this.paquete).then(() => {
                    this.obtenerEstadosPrestamo();
                    this.$refs.form.reset();
                }).catch(error => {
                    this.detalleMsj.title = "Guardar estado de equipo";
                    this.detalleMsj.body = "No se pudo guardar el estado de equipo, contacta con soporte";
                    this.dialogMsj = true;
                    console.log(`Error creando: ${error}`);
                });
                this.disableBtn = false;
            }
        },
    }, created() {
        this.obtenerEstadosPrestamo();
    }
}
</script>
<style></style>