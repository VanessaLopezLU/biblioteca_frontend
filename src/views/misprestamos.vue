<template>
  <v-container class="py-5" fluid>
    <v-card>
      <v-card-text>
        <v-row class="flex-column">
          <v-data-table
            :headers="headersPrestamo"
            :items="itemsPrestamoTabla"
            :loading="loadTabla"
            sort-by="fecha_inicio"
            :sort-desc="false"
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
              nextIcon: 'mdi-plus',
            }"
            class="elevation-1">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ $store.getters.getUsuario.rol.descripcion.toLowerCase() == "instructor" ? "Mis préstamos" : "Préstamos" }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
            </template>
            <template v-slot:item.estado="{ item }">
              <v-chip
                class="ma-2"
                :color="item.estado.id == 1
                  ? 'primary'
                  : item.estado.id == 2
                    ? 'orange'
                    : 'success'
                  ">
                {{ item.estado.estado }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ index }">
              <v-tooltip top color="info">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="var(--c-orange)"
                    v-bind="attrs"
                    v-on="on"
                    @click="verEquipos(index)">
                    mdi-eye
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
          max-width="700"
          v-model="dialogDetalleEquipos">
          <v-card>
            <v-card-title>
              <span class="headline h5">Equipos</span>
            </v-card-title>
            <v-card-text class="px-1">
              <v-data-table
                :headers="headers"
                :items="itemsPrestamoEquipos"
                locale="es-es"
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
                item-key="index"
                sort-by="tipo_equipo"
                group-by="tipo_equipo"
                show-group-by
                class="elevation-1">
              </v-data-table>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="green" dark @click="dialogDetalleEquipos = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    rutaBackend: `${process.env.VUE_APP_API}`,
    token: {},
    dialogDetalleEquipos: false,
    loadTabla: false,
    sel: null,
    horas: [],
    value: "recent",
    menu2: false,
    menu3: false,
    usuarios: [],
    tiposEquipo: [],
    campoRules: [(v) => !!v || "Campo requerido"],
    headersPrestamo: [
      { text: "Cantidad equipos", value: "cantidad" },
      { text: "Fecha inicio", value: "fecha_inicio" },
      { text: "Fecha devolución", value: "fecha_fin" },
      { text: "Estado préstamo", value: "estado" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    itemsPrestamo: [],
    itemsPrestamoTabla: [],
    headers: [
      {
        text: "Equipos",
        align: "start",
        value: "serial",
        groupable: false,
        sortable: false,
      },
      { text: "Serial", value: "serial", groupable: false },
      { text: "Tipo equipo", value: "tipo_equipo", groupable: false },
      {
        text: "Código telefónica",
        value: "codigo_telefonica",
        groupable: false,
      },
      { text: "Marca", value: "marca", groupable: false },

      { text: "", value: "tipo_equipo", align: "right", sortable: false },
    ],
    itemsPrestamoEquipos: [],
    idUsuario: 123456, //Id usuario logueado
  }),
  methods: {
    async getPrestamos() {
      this.loadTabla = true;
      await axios
        .get(`${this.rutaBackend}/prestamo`, this.token)
        .then((response) => {
          this.itemsPrestamo = response.data;
          this.itemsPrestamoTabla = response.data.map((prestamo) => {
            let fechas = ["", ""];
            if (prestamo.detalle.length > 0) {
              fechas = [
                this.fechaConHora(prestamo.detalle[0].fecha_inicio),
                this.fechaConHora(prestamo.detalle[0].fecha_fin),
              ];
            }
            return {
              cantidad: prestamo.detalle.length,
              fecha_inicio: fechas[0],
              fecha_fin: fechas[1],
              estado: prestamo.estado_prestamo,
            };
          });
        });
      this.loadTabla = false;
    },
    async getMisPrestamos() {
      this.loadTabla = true;
      await axios
        .get(`${this.rutaBackend}/prestamo/usuario/${this.idUsuario}/all`, this.token)
        .then((response) => {
          this.itemsPrestamo = response.data;
          this.itemsPrestamoTabla = response.data.map((prestamo) => {
            let fechas = ["", ""];
            if (prestamo.detalle.length > 0) {
              fechas = [
                this.fechaConHora(prestamo.detalle[0].fecha_inicio),
                this.fechaConHora(prestamo.detalle[0].fecha_fin),
              ];
            }
            return {
              cantidad: prestamo.detalle.length,
              fecha_inicio: fechas[0],
              fecha_fin: fechas[1],
              estado: prestamo.estado_prestamo,
            };
          });
        });
      this.loadTabla = false;
    },
    verEquipos(index) {
      this.itemsPrestamoEquipos = this.itemsPrestamo[index].detalle.map(
        (detalle) => {
          return {
            codigo_telefonica: detalle.equipo.codigo_telefonica,
            marca: detalle.equipo.marca,
            serial: detalle.equipo.serial.split("-")[0],
            tipo_equipo: detalle.equipo.tipo_equipo.tipo,
          };
        }
      );
      this.dialogDetalleEquipos = true;
    },
    fechaConHora(fecha = null) {
      if (fecha) {
        let dia,
          mes = "";
        fecha = new Date(fecha);
        dia = fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate();
        mes =
          ((fecha.getMonth() + 1) < 10
            ? "0" : "") + (fecha.getMonth() + 1);
        return `${fecha.getFullYear()}-${mes}-${dia} ${(fecha.getHours() < 10 ? "0" : "") + fecha.getHours()}:${(fecha.getMinutes() < 10 ? "0" : "") + fecha.getMinutes()
          }`;
      }
      return "Fecha inválida";
    }
  },
  created() {
    const usuario = this.$store.getters.getUsuario;
    this.token = {
      headers: {
        Authorization: `Bearer ${this.$store.getters.getToken}`
      }
    }
    if (usuario) {
      if (usuario.rol.descripcion.toLowerCase() == "instructor") {
        this.idUsuario = this.$store.getters.getUsuario.cedula;
        this.getMisPrestamos();
      } else {
        this.getPrestamos();
      }
    }
  },
};
</script>
