<template>
  <div class="equipo">
    <v-data-table
      :headers="headersEquipo"
      :items="itemsEquipo"
      :loading="loadTablaEquipo"
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
        'items-per-page-all-text': 'Todos',
      }"
      class="elevation-1"
    >
      <template v-slot:top>
        <div class="d-flex pa-1 justify-space-between">
          <h3 class="headline mb-0">Equipos</h3>

          <div class="d-flex">
            <v-btn
              color="var(--c-orange)"
              class="mr-2"
              @click="dialogExcel = true"
              >Subir excel</v-btn
            >
            <v-btn color="var(--c-orange)" @click="generarPdf" variant="tonal"
              ><v-icon left dark> mdi mdi-file-download-outline </v-icon
              >Inventario</v-btn
            >
          </div>
        </div>
      </template>
      <template v-slot:item.serial="{ item }">
        {{ item.serial.split("-")[0] }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="var(--c-orange)"
              class="mr-2"
              @click="verEquipo(item)"
              v-bind="attrs"
              v-on="on"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar equipo</span>
        </v-tooltip>
        <v-tooltip top color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="var(--c-orange)"
              v-bind="attrs"
              v-on="on"
              @click="
                () => {
                  serialEliminar = item.serial;
                  confirmacion.mostrar = true;
                }
              "
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar equipo</span>
        </v-tooltip>
      </template>
      <template slot="no-data">
        <p class="text-dark">Sin datos</p>
        <v-btn
          color="var(--c-orange)"
          class="mb-2 btn-tabla"
          @click="obtenerEquipos"
          >Recargar</v-btn
        >
      </template>
    </v-data-table>
    <!--Dialog para mensajes temporales-->
    <dialogMensaje
      :mostrar="dialogMsj"
      :title="detalleMsj.title"
      :body="detalleMsj.body"
      :classTitle="detalleMsj.classTitle"
      @cerrado="dialogMsj = false"
    />
    <!-- Subir equipos masivamente -->

    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
          v-model="dialogExcel"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Subir excel de equipos</span>
            </v-card-title>
            <v-card-text class="px-1">
              <v-form ref="formExcel" enctype="multipart/form-data">
                <v-file-input
                  label="Excel"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  filled
                  v-model="paquete.excel"
                  append-icon="mdi mdi-microsoft-excel"
                  prepend-icon=""
                  :rules="rulesExcel"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="green" @click="subir" :disabled="btnSubir"
                >Subir</v-btn
              >
              <v-btn color="error" @click="dialogExcel = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Editar equipo -->
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          persistent
          transition="dialog-bottom-transition"
          max-width="500"
          v-model="dialogEditarEquipo"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar equipo</span>
            </v-card-title>
            <v-card-text class="px-1">
              <v-form ref="formEditarEquipo">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="paqueteEditarEquipo.marca"
                      filled
                      :rules="campoRules"
                      label="Marca"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="paqueteEditarEquipo.estado"
                      :items="estadosEquipo"
                      item-text="estado"
                      item-value="id"
                      return-object
                      filled
                      :rules="[(v) => !!v || 'Estado es requerido']"
                      label="Estado"
                      required
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="orange" @click="actualizarEquipo">Actualizar</v-btn>
              <v-btn color="error" @click="dialogEditarEquipo = false"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <dialogConfirmacion
      :mostrar="confirmacion.mostrar"
      :entidad="confirmacion.entidad"
      @confirmacion="
        (resp) => {
          resp
            ? ((this.confirmacion.mostrar = false), this.eliminarEquipo())
            : (this.confirmacion.mostrar = false);
        }
      "
    />
  </div>
</template>
<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dialogMensaje from "./dialogMensaje.vue";
import dialogConfirmacion from "./dialogConfirmar.vue";
export default {
  name: "EquipoComponent",
  components: { dialogMensaje, dialogConfirmacion },
  data: () => ({
    rutaBackend: `${process.env.VUE_APP_API}`,
    dialogExcel: false,
    dialogEditarEquipo: false,
    estadosEquipo: [],
    token: {},
    headersEquipo: [
      { text: "Serial", value: "serial" },
      { text: "Marca", value: "marca" },
      { text: "Estado", value: "estado_equipo.estado" },
      { text: "Tipo", value: "tipo_equipo.tipo" },
      { text: "Codigo telefonica", value: "codigo_telefonica" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    loadTablaEquipo: false,
    itemsEquipo: [],
    dialogMsj: false,
    detalleMsj: {
      classTitle: "error",
      title: null,
      body: null,
    },
    confirmacion: {
      mostrar: false,
      entidad: "equipo",
    },
    btnSubir: false,
    paquete: {
      excel: null,
    },
    rulesExcel: [
      (value) => !!value || "Suba un archivo",
      (e) => {
        if (e) {
          return e.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ? true
            : "Deber ser un archivo .xsl o xslx";
        }
        return true;
      },
      (value) =>
        !value || value.size < 2000000 || "El archivo puede ser de hasta 2 MB",
    ],
    campoRules: [(v) => !!v || "Campo requerido"],
    paqueteEditarEquipo: {
      serial: null,
      marca: null,
      estado: {},
    },
    serialEliminar: null,
  }),
  methods: {
    generarPdf() {
      const doc = new jsPDF();
      const imgData = require("@/assets/logos/TAlogin.png");

      const headersInventario = [
        { text: "Serial", value: "serial" },
        { text: "Marca", value: "marca" },
        { text: "Estado", value: "estado_equipo.estado" },
        { text: "Tipo", value: "tipo_equipo.tipo" },
        { text: "Codigo telefonica", value: "codigo_telefonica" },
      ];
      // Configurar encabezado de la tabla
      const headers = headersInventario.map((header) => header.text);

      // Configurar datos de la tabla
      const rows = this.itemsEquipo.map((item) => [
        item.serial.split("-")[0],
        item.marca,
        item.estado_equipo.estado,
        item.tipo_equipo.tipo,
        item.codigo_telefonica,
      ]);
      const d = new Date();
      // Agregar encabezado al PDF
      doc.addImage(imgData, 2, 5, 35, 20);

      doc.text("Inventario de Equipos", 40, 20);

      doc.text(
        ` ${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d.getFullYear().toString().padStart(2, "0")} ${d
          .getHours()
          .toString()
          .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
          .getSeconds()
          .toString()}`,
        143,
        20
      );

      // Agregar tabla al PDF
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        headStyles: {
          fillColor: [255, 165, 0],
        },
      });

      // Guardar el PDF
      doc.save("inventario_equipos.pdf");
    },
    async subir() {
      if (this.$refs.formExcel.validate()) {
        this.btnSubir = true;
        this.$emit(
          "loadingManager",
          "Procesando archivo, espere un momento..."
        );
        await axios
          .postForm(
            `${this.rutaBackend}/equipo/subirMasivo`,
            this.paquete,
            this.token
          )
          .then((response) => {
            console.log(response);
            this.$emit("closeManager");
            this.$refs.formExcel.reset();
            this.dialogExcel = false;
            this.detalleMsj.title = "Crear equipos";
            this.detalleMsj.body = `Equipos CREADOS: ${response.data.creados.length}, Equipos NO CREADOS: ${response.data.nocreados.length}`;
            this.detalleMsj.classTitle = "success";
            this.dialogMsj = true;
            if (response.data.creados.length > 0) {
              this.obtenerEquipos();
            }
          })
          .catch((error) => {
            this.detalleMsj.title = "Crear equipos";
            this.detalleMsj.body = `Sucedió un problema creando los equipos`;
            this.detalleMsj.classTitle = "error";
            this.dialogMsj = true;
            console.log(error);
          });
        this.$emit("closeManager");
        this.btnSubir = false;
      }
    },
    verEquipo(equipo) {
      if (equipo != null) {
        this.paqueteEditarEquipo.serial = equipo.serial;
        this.paqueteEditarEquipo.marca = equipo.marca;
        this.paqueteEditarEquipo.estado = equipo.estado_equipo;
        this.dialogEditarEquipo = true;
      }
    },
    async actualizarEquipo() {
      if (this.$refs.formEditarEquipo.validate()) {
        this.$emit(
          "loadingManager",
          "Actualizando datos, espere un momento..."
        );
        await axios
          .put(
            `${this.rutaBackend}/equipo/actualizar`,
            {
              ...this.paqueteEditarEquipo,
              estado: this.paqueteEditarEquipo.estado.id,
            },
            this.token
          )
          .then((response) => {
            if (response.data.actualizado) {
              this.obtenerEstadosEquipo();
              this.obtenerEquipos();
              this.dialogEditarEquipo = false;
            }
            this.detalleMsj.title = "Actualizar equipo";
            this.detalleMsj.body = response.data.message;
            this.detalleMsj.classTitle = response.data.actualizado
              ? "success"
              : "error";
            this.dialogMsj = true;
          })
          .catch((error) => {
            console.log(error);
          });
        this.$emit("closeManager");
      }
    },
    async eliminarEquipo() {
      if (this.serialEliminar != null) {
        this.$emit("loadingManager", "Eliminando equipo, espere un momento...");
        await axios
          .delete(
            `${this.rutaBackend}/equipo/${this.serialEliminar}`,
            this.token
          )
          .then((response) => {
            if (response.data.eliminado) {
              this.obtenerEstadosEquipo();
              this.obtenerEquipos();
            }
            this.detalleMsj.title = "Eliminar equipo";
            this.detalleMsj.body = response.data.message;
            this.detalleMsj.classTitle = response.data.eliminado
              ? "success"
              : "error";
            this.dialogMsj = true;
          });
        this.$emit("closeManager");
      }
    },
    async obtenerEquipos() {
      this.loadTablaEquipo = true;
      await axios
        .get(`${this.rutaBackend}/equipo`, this.token)
        .then((response) => {
          this.itemsEquipo = response.data;
        })
        .catch((error) => {
          this.detalleMsj.title = "Obtener equipos";
          this.detalleMsj.body =
            "No se pudo obtener los equipo, contacta con soporte";
          this.detalleMsj.classTitle = "error";
          this.dialogMsj = true;
          console.log(`Error: ${error}`);
        });
      this.loadTablaEquipo = false;
    },
    async obtenerEstadosEquipo() {
      await axios
        .get(`${this.rutaBackend}/estado-equipo`, this.token)
        .then((response) => {
          this.estadosEquipo = response.data;
        });
    },
  },
  created() {
    this.token = {
      headers: {
        Authorization: `Bearer ${this.$store.getters.getToken}`,
      },
    };
    this.obtenerEstadosEquipo();
    this.obtenerEquipos();
  },
};
</script>
