<template>
    <div class="equipo">
        <v-data-table
            :headers="headersEquipo"
            :items="itemsEquipo"
            :loading="loadTablaEquipo"
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
            <template v-slot:top>
                <div class="d-flex pa-2 justify-space-between">
                    <h3 class="headline mb-0">Equipos</h3>
                    <v-btn color="var(--c-orange)" @click="dialogExcel = true">Subir excel</v-btn>
                </div>
            </template>
            <template v-slot:item.serial="{ item }">
                {{ item.serial.split('-')[0] }}
            </template>
            <template v-slot:item.actions="{ item, index }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            color="var(--c-orange)"
                            class="mr-2" @click="editarEquipo(item)"
                            v-bind="attrs" v-on="on">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar equipo</span>
                </v-tooltip>
                <v-tooltip top color="error">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            color="var(--c-orange)" v-bind="attrs" v-on="on" @click="eliminarEquipo(index)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <span>Eliminar equipo</span>
                </v-tooltip>
            </template>
            <template slot="no-data">
                <p class="text-dark">Sin datos</p>
                <v-btn color="var(--c-orange)" class="mb-2 btn-tabla" @click="obtenerEquipos">Recargar</v-btn>
            </template>
        </v-data-table>
        <!--Dialog para mensajes temporales-->
        <dialogMensaje :mostrar="dialogMsj" :title="detalleMsj.title" :body="detalleMsj.body" :classTitle="detalleMsj.classTitle" @cerrado="dialogMsj = false" />
        <!-- Subir equipos masivamente -->

        <v-row justify="space-around">
            <v-col cols="auto">
                <v-dialog
                    transition="dialog-bottom-transition"
                    max-width="600"
                    v-model="dialogExcel">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Subir excel de equipos</span>
                        </v-card-title>
                        <v-card-text class="px-1">
                            <v-form ref="formExcel" enctype="multipart/form-data">
                                <v-file-input
                                    label="Excel"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    filled v-model="paquete.excel"
                                    append-icon="mdi mdi-microsoft-excel"
                                    prepend-icon=""
                                    :rules="rulesExcel" />
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn color="green" @click="subir" :disabled="btnSubir">Subir</v-btn>
                            <v-btn color="error" @click="dialogExcel = false">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import axios from 'axios';
import dialogMensaje from './dialogMensaje.vue';
export default {
    name: 'EquipoComponent',
    components: { dialogMensaje },
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        dialogExcel: false,
        headersEquipo: [{ text: 'Serial', value: 'serial' },
        { text: 'Marca', value: 'marca' },
        { text: 'Estado', value: 'estado_equipo.estado' },
        { text: 'Tipo', value: 'tipo_equipo.tipo' },
        { text: 'Acciones', value: 'actions', sortable: false }
        ],
        loadTablaEquipo: false,
        itemsEquipo: [],
        dialogMsj: false,
        detalleMsj: {
            classTitle: 'error',
            title: null,
            body: null
        },
        btnSubir: false,
        paquete: {
            excel: null
        },
        rulesExcel: [
            value => !!value || 'Suba un archivo',
            (e) => {
                if (e) {
                    return e.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? true : 'Deber ser un archivo .xsl o xslx';
                }
                return true;
            }, value => !value || value.size < 2000000 || 'El archivo puede ser de hasta 2 MB',
        ],
    }),
    methods: {
        async subir() {
            if (this.$refs.formExcel.validate()) {
                this.btnSubir = true;
                this.$emit('loadingManager', 'Procesando archivo, espere un momento...');
                await axios.postForm(`${this.rutaBackend}/equipo/subirMasivo`, this.paquete).then(response => {
                    console.log(response);
                    this.$emit('closeManager');
                    this.$refs.formExcel.reset();
                    this.dialogExcel = false;
                    this.detalleMsj.title = "Crear equipos";
                    this.detalleMsj.body = `Equipos CREADOS: ${response.data.creados.length}, Equipos NO CREADOS: ${response.data.nocreados.length}`;
                    this.detalleMsj.classTitle = 'success';
                    this.dialogMsj = true;
                    if (response.data.creados.length > 0) {
                        this.obtenerEquipos();
                    }
                }).catch(error => {
                    this.detalleMsj.title = "Crear equipos";
                    this.detalleMsj.body = `Sucedió un problema creando los equipos`;
                    this.detalleMsj.classTitle = 'error';
                    this.dialogMsj = true;
                    console.log(error);
                });
                this.$emit('closeManager');
                this.btnSubir = false;
            }
        },
        editarEquipo(equipo) {
            console.log(equipo);
        },
        async eliminarEquipo(idEquipo) {
            await axios.delete(`${this.rutaBackend}/equipo/${idEquipo}`).then(response => {
                console.log(response);
                this.obtenerEquipos();
            });
        },
        async obtenerEquipos() {
            this.loadTablaEquipo = true;
            await axios.get(`${this.rutaBackend}/equipo`).then(response => {
                this.itemsEquipo = response.data;
            }).catch(error => {
                this.detalleMsj.title = "Obtener equipos";
                this.detalleMsj.body = "No se pudo obtener los equipo, contacta con soporte";
                this.dialogMsj = true;
                console.log(`Error: ${error}`);
            });
            this.loadTablaEquipo = false;
        }
    },
    created() {
        this.obtenerEquipos();
    }
}
</script>