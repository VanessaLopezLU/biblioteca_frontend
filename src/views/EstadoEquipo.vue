<template>
    <v-card class="py-4">
        <v-row class="justify-content-evenly">
            <v-card>
                <v-card-title>
                    Registrar tipo de equipo
                </v-card-title>
                <v-card-text>
                    <v-form ref="formTipo" v-model="validTipo" lazy-validation>
                        <v-text-field
                            v-model="paqueteTipo.tipo"
                            :rules="campoRules"
                            label="Tipo de equipo"
                            placeholder="Ej: Portátil"
                            required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="guardarTipoEquipo" class="btn-tabla">Guardar</v-btn>
                </v-card-actions>
            </v-card>
            <v-card>
                <v-card-title>
                    Registrar estado de equipo
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field
                            v-model="paquete.estado"
                            :rules="campoRules"
                            label="Estado de equipo"
                            placeholder="Ej: Bueno"
                            required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="guardarEstadoEquipo()" class="btn-tabla">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
        <v-row class="mt-3" justify="center">
            <v-col cols="6">
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">Tipos de equipo</h3>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headersTipo"
                            :items="itemsTipo"
                            :loading="loadTablaTipo"
                            loading-text="Cargando, por favor espere..."
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
                            <template slot="no-data">
                                <p class="text-dark">Sin datos</p>
                                <v-btn color="var(--c-orange)" class="mb-2 btn-tabla" @click="obtenerTiposEquipo">Recargar</v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">Estados de equipo</h3>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="items" :loading="loadTabla" loading-text="Cargando, por favor espere..." :footer-props="{
                            'show-current-page': true,
                            'items-per-page-options': [5, 10, 15],
                            itemsPerPageText: 'Registros mostrados',
                            pageText: '{0}-{1} de {2}',
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus'
                        }" class="elevation-1">
                            <template slot="no-data">
                                <p class="text-dark">Sin datos</p>
                                <v-btn color="var(--c-orange)" class="mb-2 btn-tabla" @click="obtenerEstadosEquipo()">Recargar</v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
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
        token: {},
        valid: true,
        validTipo: true,
        validEditar: true,
        campoRules: [
            (v) => !!v || "Campo requerido",
        ],
        paquete: {
            estado: null,
        },
        paqueteTipo: {
            tipo: null,
        },
        paqueteEditar: {
            id: null, estado: null
        },
        headers: [
            { text: 'Estado', value: 'estado', align: 'center' },
        ], headersTipo: [
            { text: 'Tipo', value: 'tipo', align: 'center' },
        ],
        items: [],
        itemsTipo: [],
        dialogEditar: false,
        dialogEliminar: false,
        dialogMsj: false,
        detalleMsj: {
            classTitle: 'error',
            title: null,
            body: null
        },
        loadTabla: false,
        loadTablaTipo: false,
    }),
    methods: {
        async obtenerEstadosEquipo() {
            this.loadTabla = true;
            await axios.get(`${this.rutaBackend}/estado-equipo`, this.token).then(response => {
                this.items = response.data;
            }).catch(error => {
                this.detalleMsj.title = "Obtener estados de equipo";
                this.detalleMsj.body = "No se pudo obtener los estados de equipo, contacta con soporte";
                this.dialogMsj = true;
                console.log(`Error: ${error}`);
            });
            this.loadTabla = false;
        },
        async obtenerTiposEquipo() {
            this.loadTablaTipo = true;
            await axios.get(`${this.rutaBackend}/tipo-equipo`, this.token).then(response => {
                this.itemsTipo = response.data;
            }).catch(error => {
                this.detalleMsj.title = "Obtener tipos de equipo";
                this.detalleMsj.body = "No se pudo obtener los tipos de equipo, contacta con soporte";
                this.dialogMsj = true;
                console.log(`Error: ${error}`);
            })
            this.loadTablaTipo = false;
        },
        async guardarEstadoEquipo() {
            if (this.$refs.form.validate()) {
                this.$emit('loadingManager', 'Creando estado de equipo...');
                await axios.post(`${this.rutaBackend}/estado-equipo/crear`, this.paquete, this.token).then(() => {
                    this.obtenerEstadosEquipo();
                    this.$refs.form.reset();
                }).catch(error => {
                    this.detalleMsj.title = "Guardar estado de equipo";
                    this.detalleMsj.body = "No se pudo guardar el estado de equipo, contacta con soporte";
                    this.dialogMsj = true;
                    console.log(`Error creando: ${error}`);
                });
                this.$emit('loadingManager');
            }
        },
        async guardarTipoEquipo() {
            if (this.$refs.formTipo.validate()) {
                this.$emit('loadingManager', 'Creando tipo de equipo...');
                await axios.post(`${this.rutaBackend}/tipo-equipo/crear`, this.paqueteTipo, this.token).then(() => {
                    this.obtenerTiposEquipo();
                    this.$refs.formTipo.reset();
                }).catch(error => {
                    this.detalleMsj.title = "Guardar tipo de equipo";
                    this.detalleMsj.body = "No se pudo guardar el tipo de equipo, contacta con soporte";
                    this.dialogMsj = true;
                    console.log(`Error creando tipo: ${error}`);
                });
                this.$emit('loadingManager');
            }
        }
    }, created() {
        this.token = {
            headers: {
                Authorization: `Bearer ${this.$store.getters.getToken}`
            }
        }
        this.obtenerTiposEquipo();
        this.obtenerEstadosEquipo();
    }
}
</script>
<style>
.mitad>* {
    width: 49% !important;
}
</style>