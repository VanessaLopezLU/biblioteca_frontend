<template>
  <v-container class="py-5" fluid>
    <v-card>
      <v-card-title class="pb-0">
        <h3 class="headline mb-0">NUEVO PRESTAMO</h3>
      </v-card-title>
      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="8">
            <!-- <v-bottom-navigation v-model="value" height="auto" class="flex-column">
                            <v-row>
                                <v-col cols="6" class="pr-1 pb-0">
                                    <v-autocomplete
                                        v-model="paquete.dispositivo"
                                        :items="dispositivosDisponibles"
                                        :item-text="(dispositivo) => { return `${dispositivo.tipo} - ${dispositivo.serial}`; }"
                                        item-value="codigo"
                                        label="Dispositivos disponibles"
                                        filled
                                        required
                                        append-icon="mdi-devices">
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="6" class="pl-1 pb-0">
                                    <v-text-field
                                        type="number"
                                        min="1"
                                        filled
                                        label="Cantidad"
                                        append-icon="mdi-plus"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="6" class="pr-1">
                                    <v-menu
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date"
                                                filled
                                                label="Fecha de inicio"
                                                append-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"></v-text-field>
                                        </template>
<v-date-picker
  v-model="date"
  @input="menu2 = false"
  color="orange white"
  header-color="#ffa726"
  locale="es">
</v-date-picker>
</v-menu>
</v-col>
<v-col cols="6" class="pl-1">
  <v-select
    required
    v-model="sel"
    filled
    label="Hora inicio"
    append-icon="mdi-timer-sand"
    :items="horas">
  </v-select>
</v-col>
</v-row>
<v-row no-gutters>
  <v-col cols="6" class="pr-1">
    <v-menu
      v-model="menu3"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto">

      <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date"
                                                filled
                                                label="Fecha de fin"
                                                append-icon="mdi-calendar"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"></v-text-field>
                                        </template>
      <v-date-picker
        v-model="date"
        @input="menu3 = false"
        color="orange white"
        header-color="#ffa726"
        locale="es">
      </v-date-picker>
    </v-menu>
  </v-col>
  <v-col cols="6" class="pl-1">
    <v-select
      required
      v-model="sel"
      filled
      label="Hora fin"
      append-icon="mdi-timer-sand-complete"
      :items="horas">
    </v-select>
  </v-col>
</v-row>
<v-row justify="center" no-gutters>
  <v-btn
    :disabled="!valid"
    color="#ffa726"
    class="py-4 px-2 btn-agregar"
    @click="guardar()">
    <v-icon dark>
      mdi-plus
    </v-icon>
  </v-btn>
</v-row>
</v-bottom-navigation> -->
            <v-card class="mx-auto mt-2">
              <v-card-title> PRESTAR EQUIPO </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row no-gutters>
                    <v-col cols="6" class="pr-1">
                      <v-dialog
                        v-model="modalFechaInicio"
                        persistent
                        width="290px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="paqueteTabla.fecha_inicio"
                            filled
                            label="Fecha de inicio"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="campoRules"></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="paqueteTabla.fecha_inicio"
                          @input="validarFechas"
                          color="orange white"
                          header-color="#ffa726"
                          locale="es" />
                      </v-dialog>
                    </v-col>
                    <v-col cols="6" class="pl-1">
                      <v-row no-gutters class="flex-nowrap">
                        <v-select
                          required
                          v-model="paqueteTabla.hora_inicio"
                          filled
                          label="Hora inicio"
                          append-icon="mdi-timer-sand"
                          :items="horas"
                          :rules="campoRules"
                          @change="validarFechas">
                        </v-select>
                        <v-select
                          required
                          v-model="paqueteTabla.minuto_inicio"
                          filled
                          label="Minuto"
                          append-icon="mdi mdi-timer-play-outline"
                          :items="minutos"
                          :rules="campoRules"
                          @change="validarFechas">
                        </v-select>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6" class="pr-1">
                      <v-dialog
                        v-model="modalFechaFin"
                        persistent
                        width="290px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="paqueteTabla.fecha_fin"
                            filled
                            label="Fecha de fin"
                            append-icon="mdi mdi-calendar-remove-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="campoRules"></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="paqueteTabla.fecha_fin"
                          @input="validarFechas"
                          color="orange white"
                          header-color="#ffa726"
                          locale="es" />
                      </v-dialog>
                    </v-col>
                    <!-- <v-col cols="6" class="pr-1">
                      <v-menu
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto">

                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="paqueteTabla.fecha_fin"
                            filled
                            label="Fecha de fin"
                            append-icon="mdi mdi-calendar-remove-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="campoRules"></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="paqueteTabla.fecha_fin"
                          @change="validarFechas"
                          color="orange white"
                          header-color="#ffa726"
                          locale="es">
                        </v-date-picker>
                      </v-menu>
                    </v-col> -->
                    <v-col cols="6" class="pl-1">
                      <v-row no-gutters class="flex-nowrap">
                        <v-select
                          required
                          v-model="paqueteTabla.hora_fin"
                          filled
                          label="Hora fin"
                          append-icon="mdi-timer-sand-complete"
                          :items="horas"
                          :rules="campoRules"
                          @change="validarFechas">
                        </v-select>
                        <v-select
                          required
                          v-model="paqueteTabla.minuto_fin"
                          filled
                          label="Minuto"
                          append-icon="mdi mdi-timer-pause-outline"
                          :items="minutos"
                          :rules="campoRules"
                          @change="validarFechas">
                        </v-select>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" class="pr-1 pb-0">
                      <v-autocomplete
                        v-model="paqueteTabla.tipo_equipo"
                        :items="tiposEquipo"
                        item-text="tipo"
                        label="Tipo de equipo"
                        filled
                        required
                        return-object
                        no-data-text="Sin tipo de equipos"
                        append-icon="mdi-devices"
                        :rules="campoRules">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6" class="pl-1 pb-0">
                      <v-text-field
                        v-model="paqueteTabla.cantidad"
                        type="number"
                        min="1"
                        filled
                        label="Cantidad"
                        append-icon="mdi-plus"
                        :rules="numberRules"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center" no-gutters class="mt-2">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="#ffa726"
                          class="py-4 px-2 btn-agregar"
                          @click="agregarEquipo"
                          v-bind="attrs"
                          v-on="on">
                          <v-icon dark> mdi-plus </v-icon>
                        </v-btn>
                      </template>
                      <span>Agregar al préstamo</span>
                    </v-tooltip>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="flex-column mb-4" v-if="mostrarEquiposPrestamo">
          <v-data-table
            :headers="headersDetalle"
            :items="detallePrestamo"
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
                <v-toolbar-title>Detalle de equipos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-row
                  no-gutters
                  class="flex-column"
                  justify="center"
                  align-content="end">
                  <v-btn
                    color="error"
                    class="mr-2 btn-cancelar"
                    @click="cancelar"
                    :disabled="disableBtnCancelar">Cancelar</v-btn>
                  <v-btn
                    color="success"
                    class="btn-confirmar"
                    :disabled="disableBtnConfirmar"
                    @click="confirmar">Confirmar</v-btn>
                </v-row>
              </v-toolbar>
            </template>

            <template slot="no-data">
              <p class="text-dark">Sin equipos disponibles</p>
            </template>
          </v-data-table>
        </v-row>
        <v-row class="flex-column mt-4">
          <v-data-table
            :headers="headersPrestamo"
            :items="itemsPrestamo"
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
                <v-toolbar-title>Equipos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-row
                  no-gutters
                  justify="end"
                  class="align-items-center"
                  align-content="end">
                  <div class="lapso pr-2">
                    <!--eslint-disable-next-line-->
                    <p class="m-0">
                      <strong>{{ paqueteTabla.fecha_inicio }}
                        {{ paqueteTabla.hora_inicio.toString().padStart(2, "0")
                        }}:{{ paqueteTabla.minuto_inicio.toString().padStart(2, "0") }}</strong>
                      -
                      <strong>{{ paqueteTabla.fecha_fin }}
                        {{
                  paqueteTabla.hora_fin.toString().padStart(2, "0")
                }}:{{ paqueteTabla.minuto_fin.toString().padStart(2, "0") }}</strong>
                    </p>
                  </div>
                  <v-btn
                    v-if="itemsPrestamo.length > 0"
                    color="success"
                    :disabled="disableBtn"
                    class="btn-prestar"
                    @click="prestar">Prestar</v-btn>
                </v-row>
              </v-toolbar>
            </template>

            <template v-slot:item.actions="{ index }">
              <v-tooltip top color="error">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="var(--c-orange)"
                    v-bind="attrs"
                    v-on="on"
                    @click="eliminarEquipo(index)">
                    mdi-delete
                  </v-icon>
                </template>
                <span>Eliminar equipo</span>
              </v-tooltip>
            </template>

            <template slot="no-data">
              <p class="text-dark">Sin datos de equipos agregados</p>
            </template>
          </v-data-table>
        </v-row>
      </v-card-text>
    </v-card>
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
    modalFechaFin: false,
    modalFechaInicio: false,
    minutos: [],
    mostrarEquiposPrestamo: false,
    disableBtn: false,
    disableBtnCancelar: false,
    disableBtnConfirmar: false,
    dialogMsj: false,
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
    valid: true,
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
      minuto_inicio: "00",
      fecha_fin: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10),
      hora_fin: null,
      minuto_fin: "00",
    },
    paquete: {
      usuario: 1, //Id del usuario al que se le hace el préstamo
      fecha_inicio: null,
      fecha_fin: null,
      detalle: [],
    },
    headersPrestamo: [
      { text: "Tipo equipo", value: "equipo" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    itemsPrestamo: [],
    headersDetalle: [
      { text: "Tipo equipo", value: "tipo_equipo" },
      { text: "Seriales", value: "equipos" },
      { text: "Cantidad", value: "cantidad" },
    ],
    detallePrestamo: [],
    diasCalendario: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
  }),
  methods: {
    async obtenerUsuarios() {
      await axios.get(`${this.rutaBackend}/usuario`).then((response) => {
        this.usuarios = response.data;
      });
    },
    async obtenerTiposEquipo() {
      await axios.get(`${this.rutaBackend}/tipo-equipo`).then((response) => {
        this.tiposEquipo = response.data;
      });
    },
    agregarEquipo() {
      if (this.paqueteTabla.tipo_equipo != null) {
        const c = isNaN(this.paqueteTabla.cantidad)
          ? 0
          : parseInt(this.paqueteTabla.cantidad);
        if (c > 0) {
          if (!this.existEquipoAndUpdate(this.paqueteTabla)) {
            this.itemsPrestamo.push({
              equipo: this.paqueteTabla.tipo_equipo.tipo,
              detalle: this.paqueteTabla.tipo_equipo,
              cantidad: c,
            });
            this.paqueteTabla.tipo_equipo = null;
            this.paqueteTabla.cantidad = 1;
          }
          return;
        }
        this.paqueteMsj.title = "Cantidad";
        this.paqueteMsj.body = "La cantidad debe ser mayor a 0";
        this.paqueteMsj.classTitle = "error";
        this.dialogMsj = true;
        return;
      }
      this.paqueteMsj.title = "Agregar tipo de equipo";
      this.paqueteMsj.body = "Seleccione un tipo de equipo";
      this.paqueteMsj.classTitle = "error";
      this.dialogMsj = true;
      return;
      /* if (this.$refs.form.validate()) {
        const fecha1 = new Date(
          `${this.paqueteTabla.fecha_inicio} ${this.paqueteTabla.hora_inicio < 10
            ? "0" + this.paqueteTabla.hora_inicio
            : this.paqueteTabla.hora_inicio
          }:${this.paqueteTabla.minuto_inicio}`
        );
        const fecha2 = new Date(
          `${this.paqueteTabla.fecha_fin} ${this.paqueteTabla.hora_fin < 10
            ? "0" + this.paqueteTabla.hora_fin
            : this.paqueteTabla.hora_fin
          }:${this.paqueteTabla.minuto_fin}`
        );

        if (fecha1.getTime() < fecha2.getTime()) {
          if (!this.existEquipoAndUpdate(this.paqueteTabla)) {
            this.itemsPrestamo.push({
              equipo: this.paqueteTabla.tipo_equipo.tipo,
              detalle: this.paqueteTabla.tipo_equipo,
              cantidad: parseInt(this.paqueteTabla.cantidad),
              fecha_inicio: `${this.paqueteTabla.fecha_inicio} ${this.paqueteTabla.hora_inicio < 10
                ? "0" + this.paqueteTabla.hora_inicio
                : this.paqueteTabla.hora_inicio
                }:${this.paqueteTabla.minuto_inicio}`,
              fecha_fin: `${this.paqueteTabla.fecha_fin} ${this.paqueteTabla.hora_fin < 10
                ? "0" + this.paqueteTabla.hora_fin
                : this.paqueteTabla.hora_fin
                }:${this.paqueteTabla.minuto_fin}`,
            });
            this.paqueteTabla.tipo_equipo = null;
            this.paqueteTabla.cantidad = 1;
          }
        } else {
          alert(
            "La fecha y hora final debe ser mayor a la fecha y hora de inicio"
          );
        }
      } */
    },
    existEquipoAndUpdate(equipo = {}) {
      let exist = false;
      this.itemsPrestamo = this.itemsPrestamo.map((item) => {
        if (item.detalle.id == equipo.tipo_equipo.id) {
          item.cantidad += parseInt(equipo.cantidad);
          exist = true;
        }
        return item;
      });
      return exist;
    },
    eliminarEquipo(index) {
      this.itemsPrestamo.splice(index, 1);
    },
    async prestar() {
      if (this.itemsPrestamo.length > 0) {
        this.disableBtn = true;
        if (this.validarFechas()) {
          this.$emit("loading", "Creando préstamo, espere un momento..."); //Mostrar overlay
          this.paquete.fecha_inicio = `${this.paqueteTabla.fecha_fin}T${(this.paqueteTabla.hora_inicio < 10 ? "0" : "") +
            this.paqueteTabla.hora_inicio
            }:${this.paqueteTabla.minuto_inicio}`;

          this.paquete.fecha_fin = `${this.paqueteTabla.fecha_fin}T${(this.paqueteTabla.hora_fin < 10 ? "0" : "") +
            this.paqueteTabla.hora_fin
            }:${this.paqueteTabla.minuto_fin}`;
          const detalles = this.itemsPrestamo.map((item) => {
            return {
              tipo_equipo: item.detalle.id,
              cantidad: item.cantidad,
            };
          });
          this.paquete.detalle = detalles;
          let codigos;
          await axios
            .post(`${this.rutaBackend}/prestamo/crear`, this.paquete)
            .then((response) => {
              if (response.data.length > 1) {
                for (let index = 0; index < response.data.length - 1; index++) {
                  const detalle = response.data[index];
                  codigos = "";
                  if (detalle.prestado) {
                    detalle.equipos.forEach((equipo, index) => {
                      codigos +=
                        index < detalle.equipos.length - 1
                          ? equipo.serial.split("-")[0] + ", "
                          : equipo.serial.split("-")[0];
                    });
                    this.detallePrestamo.push({
                      tipo_equipo:
                        this.itemsPrestamo[detalle.indexPrestamo].equipo,
                      equipos: codigos,
                      cantidad: detalle.cantPrestados,
                    });
                  } else {
                    this.detallePrestamo.push({
                      tipo_equipo:
                        this.itemsPrestamo[detalle.indexPrestamo].equipo,
                      equipos: detalle.message,
                      cantidad: detalle.cantPrestados,
                    });
                  }
                }
              } else {
                console.log(response.data);
              }
              this.idPrestamoProceso =
                response.data[response.data.length - 1].idPrestamo;
            })
            .catch((error) => {
              console.log("Error", error);
            });
          this.mostrarEquiposPrestamo = true;
        } else {
          this.disableBtn = false;
        }
        this.$emit("close"); //Ocultar overlay
      }
    },
    async confirmar() {
      if (this.idPrestamoProceso) {
        this.$emit("loading", "Guardando préstamo, espere un momento..."); //Mostrar overlay
        (this.disableBtn = true),
          (this.disableBtnCancelar = true),
          (this.disableBtnConfirmar = true);
        this.itemsPrestamo = [];
        this.mostrarEquiposPrestamo = false;
        this.detallePrestamo = [];
        this.idPrestamoProceso = null;
        this.paqueteMsj.title = "Confirmar";
        this.paqueteMsj.body = "Préstamo confirmado con éxito";
        this.paqueteMsj.classTitle = "green";
        this.dialogMsj = true;
        (this.disableBtn = false),
          (this.disableBtnCancelar = false),
          (this.disableBtnConfirmar = false);
        this.$emit("close"); //Ocultar overlay
      }
    },
    async cancelar() {
      if (this.idPrestamoProceso) {
        this.$emit("loading", "Cancelando préstamo, espere un momento..."); //Ocultar overlay
        (this.disableBtn = true),
          (this.disableBtnConfirmar = true),
          (this.disableBtnCancelar = true);
        await axios
          .delete(`${this.rutaBackend}/prestamo/${this.idPrestamoProceso}`)
          .then(() => {
            this.paqueteMsj.title = "Cancelar";
            this.paqueteMsj.body = "Préstamo cancelado con éxito";
            this.paqueteMsj.classTitle = "green";
            this.idPrestamoProceso = null;
          })
          .catch((error) => {
            this.paqueteMsj.title = "Cancelar";
            this.paqueteMsj.body = "No se pudo cancelar el préstamo";
            this.paqueteMsj.classTitle = "error";
            console.log(error);
          });
        this.itemsPrestamo = [];
        this.mostrarEquiposPrestamo = false;
        this.detallePrestamo = [];
        this.dialogMsj = true;
        (this.disableBtn = false),
          (this.disableBtnCancelar = false),
          (this.disableBtnConfirmar = false);
        this.$emit("close"); //Ocultar overlay
      }
    },
    actualiza() {
      console.log("actualizado");
      this.drawer = !this.drawer;
    },
    validarFechas() {
      const fecha1 = new Date(
        `${this.paqueteTabla.fecha_inicio} ${this.paqueteTabla.hora_inicio < 10
          ? "0" + this.paqueteTabla.hora_inicio
          : this.paqueteTabla.hora_inicio
        }:${this.paqueteTabla.minuto_inicio}`
      );
      const fecha2 = new Date(
        `${this.paqueteTabla.fecha_fin} ${this.paqueteTabla.hora_fin < 10
          ? "0" + this.paqueteTabla.hora_fin
          : this.paqueteTabla.hora_fin
        }:${this.paqueteTabla.minuto_fin}`
      );
      if (fecha1.getTime() < fecha2.getTime()) {
        this.modalFechaFin = false;
        this.modalFechaInicio = false;
        return true;
      } else {
        this.paqueteMsj.title = "Fechas";
        this.paqueteMsj.body =
          "La fecha inicial debe ser menor a la fecha final";
        this.paqueteMsj.classTitle = "error";
        this.modalFechaFin = false;
        this.modalFechaInicio = false;
        this.dialogMsj = true;
      }
      return false;
    },
  },
  created() {
    this.obtenerTiposEquipo();
    for (let i = 6; i <= 21; i++) {
      this.horas.push(i);
    }
    let hora = new Date().getHours();
    this.paqueteTabla.hora_inicio = 6;
    this.paqueteTabla.hora_fin = 20;
    if (hora >= 6 && hora < 21) {
      this.paqueteTabla.hora_inicio = hora;
      this.paqueteTabla.hora_fin = this.paqueteTabla.hora_inicio + 1;
    }
    this.minutos = Array(6)
      .fill(0)
      .map((min, index) => `${index > 0 ? 10 * index : "0" + index}`);
    this.paquete.usuario = this.$store.getters.getUsuario.cedula;
  },
};
</script>

<style>
.v-application .primary--text {
  color: orange !important;
}

.v-item-group.v-bottom-navigation .v-btn {
  align-items: center;
  border-radius: 4px !important;
  display: inline-flex !important;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: 0.0892857143em !important;
  justify-content: center !important;
  outline: 0;
  position: relative;
  text-decoration: none !important;
  text-indent: 0.0892857143em;
  text-transform: uppercase !important;
  transition-duration: 0.28s !important;
  transition-property: box-shadow, transform, opacity !important;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
  vertical-align: middle;
  white-space: nowrap !important;
  height: 38px !important;
  min-width: 64px !important;
  padding: 0 16px !important;
  color: #ffffff !important;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}

.v-item-group.v-bottom-navigation .v-btn:focus::before,
.v-item-group.v-bottom-navigation .v-btn:hover::before {
  opacity: 0.24;
}

.row.no-gutters {
  height: 70px;
}

.btn-agregar {
  color: #ffffff;
}
</style>
