<template>
    <v-container class="py-5" fluid>
        <v-card>
            <v-card-text>
                <v-row class="justify-center">
                    <v-col cols="8">
                        <v-card width="500px" class="mx-auto mt-2">
                            <v-card-title>ENTREGA DE EQUIPOS</v-card-title>
                            <v-card-text>
                                <v-form ref="form">
                                    <v-row no-gutters>
                                        <v-col cols="12" class="pr-0 pb-0">
                                            <v-autocomplete
                                                v-model="paquete.cedula"
                                                :items="usuarios"
                                                :item-text="(usuario) => {
                                                    return `${usuario.cedula} - ${usuario.nombre} ${usuario.apellido}`;
                                                }
                                                    "
                                                item-value="cedula"
                                                label="Cédula"
                                                :rules="campoRules"
                                                filled
                                                required
                                                no-data-text="Sin usuarios"
                                                append-icon="mdi mdi-account">
                                            </v-autocomplete>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-btn
                                    color="#ffa726"
                                    class="py-4 px-2"
                                    @click="buscarPrestamos">
                                    <v-icon dark> mdi mdi-account-search-outline </v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="flex-column mt-4">
                    <v-data-table
                        :headers="headersPrestamo"
                        :items="prestamosTabla"
                        :footer-props="{
                                                    'show-current-page': true,
                                                    'items-per-page-options': [5, 10, 15],
                                                    itemsPerPageText: 'Registros mostrados',
                                                    pageText: '{0}-{1} de {2}',
                                                    showFirstLastPage: true,
                                                    firstIcon: 'mdi-arrow-collapse-left',
                                                    lastIcon: 'mdi-arrow-collapse-right',
                                                    prevIcon: 'mdi-minus',
                                                    nextIcon: 'mdi-plus',
                                                }"
                        class="elevation-1">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Préstamos</v-toolbar-title>
                            </v-toolbar>
                        </template>

                        <template v-slot:item.actions="{ index }">
                            <v-tooltip top color="info">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        color="var(--c-orange)"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="verDetalles(index)">
                                        mdi mdi-eye
                                    </v-icon>
                                </template>
                                <span>Ver equipos</span>
                            </v-tooltip>
                        </template>

                        <template slot="no-data">
                            <p class="text-dark">Sin préstamos</p>
                        </template>
                    </v-data-table>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row justify="space-around">
            <v-col cols="auto">
                <v-dialog
                    transition="dialog-bottom-transition"
                    max-width="900"
                    v-model="dialogDetalle">
                    <v-card>
                        <v-card-title>Equipos</v-card-title>
                        <v-card-text>
                            <v-data-table
                                :headers="headersDetalle"
                                :items="itemsDetalle"
                                :footer-props="{
                                                    'show-current-page': true,
                                                    'items-per-page-options': [5, 10, 15],
                                                    itemsPerPageText: 'Registros mostrados',
                                                    pageText: '{0}-{1} de {2}',
                                                    showFirstLastPage: true,
                                                    firstIcon: 'mdi-arrow-collapse-left',
                                                    lastIcon: 'mdi-arrow-collapse-right',
                                                    prevIcon: 'mdi-minus',
                                                    nextIcon: 'mdi-plus',
                                                }"
                                class="elevation-1">

                                <template v-slot:top>
                                    <v-row justify="end" class="pa-4">
                                        <v-btn color="green" dark @click="entregar">Entregar equipos</v-btn>
                                    </v-row>
                                </template>
                                <template v-slot:item.serial="{ item }">
                                    {{ item.serial.split("-")[0] }}
                                </template>
                                <template v-slot:item.codigo_telefonica="{ item }">
                                    {{ item.codigo_telefonica == null ? '' : item.codigo_telefonica }}
                                </template>
                                <template slot="no-data">
                                    <p class="text-dark">Sin equipos</p>
                                </template>
                            </v-data-table>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn color="error" tonal dark @click="dialogDetalle = false">Cerrar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <dialogMensaje
            :mostrar="dialogMsj"
            @cerrado="dialogMsj = false"
            :title="paqueteMsj.title"
            :body="paqueteMsj.body"
            :classTitle="paqueteMsj.classTitle" />
    </v-container>
</template>

<script>
import axios from "axios";
import dialogMensaje from "../components/dialogMensaje.vue";
export default {
    components: {
        dialogMensaje,
    },
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        horas: [],
        mostrarEquiposPrestamo: false,
        disableBtn: false,
        disableBtnCancelar: false,
        disableBtnConfirmar: false,
        dialogMsj: false,
        dialogDetalle: false,
        paqueteMsj: {
            title: null,
            body: null,
            classTitle: "green",
        },
        value: "recent",
        menu2: false,
        menu3: false,
        usuarios: [],
        tiposEquipo: [],
        campoRules: [(v) => !!v || "Campo requerido"],
        numberRules: [
            (v) => !!v || "Campo requerido",
            (v) => parseInt(v) > 0 || "Cantidad incorrecta",
        ],
        drawer: true,
        valid: false,
        select: null,
        idPrestamoProceso: null,
        paqueteTabla: {
            tipo_equipo: null,
            cantidad: 1,
            fecha_inicio: new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .slice(0, 10),
            hora_inicio: null,
            fecha_fin: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 10),
            hora_fin: null,
        },
        paquete: {
            cedula: null, //Id del usuario al que se le hace el préstamo
        },
        headersPrestamo: [
            { text: "Fecha inicio", value: "fecha_inicio" },
            { text: "Fecha fin", value: "fecha_fin" },
            { text: "Acciones", value: "actions", sortable: false },
        ],
        itemsPrestamo: [],
        prestamosTabla: [],
        headersDetalle: [
            { text: "Tipo equipo", value: "tipo_equipo", sortable: false },
            { text: "Serial", value: "serial", sortable: false },
            { text: "Código telefónica", value: "codigo_telefonica", sortable: false },
            { text: "Marca", value: "marca", sortable: false },
        ],
        observaciones: [],
        estadosSeleccionados: [],
        indexSelecionado: null,
        itemsEstadosEquipos: [],
        itemsDetalle: [],
    }),
    methods: {
        verDetalles(index) {
            if (index != null) {
                this.indexSelecionado = index;
                this.itemsDetalle = this.itemsPrestamo[index].detalle.map((detalle) => {
                    return {
                        tipo_equipo: detalle.equipo.tipo_equipo.tipo,
                        serial: detalle.equipo.serial,
                        codigo_telefonica: detalle.equipo.codigo_telefonica,
                        marca: detalle.equipo.marca
                    };
                });
                this.dialogDetalle = true;
            }
        },
        async buscarPrestamos() {
            if (this.$refs.form.validate()) {
                this.$emit('loading', 'Buscando préstamos, espere un momento...');
                await axios
                    .get(`${this.rutaBackend}/prestamo/usuario/${this.paquete.cedula}/entregar`)
                    .then((response) => {
                        this.itemsPrestamo = response.data;
                        this.prestamosTabla = [];
                        this.itemsPrestamo.forEach((prestamo) => {
                            //Dividir la fecha de inicio por - para obtener el año y el mes, index 0 y 1
                            const p1 = prestamo.detalle[0].fecha_inicio.toString().split("-");
                            //En la posición 2 de p1 queda el día junto con la hora, dividimos por la T para obtener el día y las horas, index 0 y 1
                            const m1 = p1[2].split("T");
                            //Dividir la fecha de fin por - para obtener el año y el mes, index 0 y 1
                            const p2 = prestamo.detalle[0].fecha_fin.toString().split("-");
                            //En la posición 2 de p2 queda el día junto con la hora, dividimos por la T para obtener el día y las horas, index 0 y 1
                            const m2 = p2[2].split("T");
                            console.log(m1);
                            //Fecha de inicio formateada
                            const f1 = new Date(
                                Date.UTC(
                                    parseInt(p1[0]),
                                    parseInt(p1[1]) - 1,
                                    parseInt(m1[0]),
                                    m1[1].slice(0, 2),
                                    m1[1].slice(3, 5),
                                    0
                                )
                            );
                            //Fecha de fin formateada
                            const f2 = new Date(
                                Date.UTC(
                                    parseInt(p2[0]),
                                    parseInt(p2[1]) - 1,
                                    parseInt(m2[0]),
                                    m2[1].slice(0, 2),
                                    m2[1].slice(3, 5),
                                    0
                                )
                            );
                            this.prestamosTabla.push({
                                id: prestamo.id,
                                fecha_inicio: `${f1.getFullYear()}-${(f1.getMonth() < 10 ? "0" : "") + (f1.getMonth() + 1)
                                    }-${(f1.getDate() < 10 ? "0" : "") + f1.getDate()} ${(f1.getHours() < 10 ? "0" : "") + f1.getHours()
                                    }:${f1.getMinutes().toString().padStart(2, '0')}`,
                                fecha_fin: `${f2.getFullYear()}-${(f2.getMonth() < 10 ? "0" : "") + (f2.getMonth() + 1)
                                    }-${(f2.getDate() < 10 ? "0" : "") + f2.getDate()} ${(f2.getHours() < 10 ? "0" : "") + f2.getHours()
                                    }:${f2.getMinutes().toString().padStart(2, '0')}`,
                            });
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.$emit('close');
            }
        },
        async getInstructores() {
            await axios.get(`${this.rutaBackend}/usuario/instructor`).then((response) => {
                this.usuarios = response.data;
            });
        },
        async obtenerEstadosEquipo() {
            await axios.get(`${this.rutaBackend}/estado-equipo`).then((response) => {
                this.itemsEstadosEquipos = response.data;
            });
        },
        eliminarEquipo(index) {
            this.itemsPrestamo.splice(index, 1);
        },
        async entregar() {
            if (this.indexSelecionado != null) {
                const idPrestamo = this.itemsPrestamo[this.indexSelecionado].id;

                await axios
                    .put(`${this.rutaBackend}/prestamo/entregar/${idPrestamo}`)
                    .then((response) => {
                        if (response.data) {
                            this.buscarPrestamos();
                            this.itemsDetalle = [];
                            this.indexSelecionado = null;
                            this.dialogDetalle = false;
                        }
                        this.paqueteMsj.title = "Entrega de equipos";
                        this.paqueteMsj.body = response.data ? "Equipos entregados correctamente" : "No se pudieron entregar los equipos";
                        this.paqueteMsj.classTitle = response.data ? "success" : "error";
                        this.dialogMsj = true;
                    })
                    .catch((error) => {
                        console.log(error);
                        this.paqueteMsj.title = "Entrega de equipos";
                        this.paqueteMsj.body = "No se pudieron entregar los equipos";
                        this.paqueteMsj.classTitle = "error";
                        this.dialogMsj = true;
                    });
            }
        },
        validarEstados() {
            for (let i = 0; i < this.estadosSeleccionados.length; i++) {
                if (
                    this.estadosSeleccionados[i].estado.toLowerCase() != "bueno" &&
                    /^[ ]*$/gm.test(this.observaciones[i])
                ) {
                    this.paqueteMsj.title = "Entrega de equipos";
                    this.paqueteMsj.body =
                        "Los equipos con estado MALO deben llevar su observación";
                    this.paqueteMsj.classTitle = "error";
                    this.dialogMsj = true;
                    return false;
                }
            }
            return true;
        },
    },
    created() {
        this.getInstructores();
    },
};
</script>
