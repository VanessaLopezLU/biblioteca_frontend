<template>
  <v-card width="500px" class="mx-auto">
    <v-card-title> Video Beam </v-card-title>
    <v-img
      height="297px"
      lazy-src="../../assets/images/Vdbeam.jpeg"
      src="../../assets/images/Vdbeam.jpeg"></v-img>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.serial"
              :rules="campoRules"
              label="Serial" filled
              required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.marca"
              :rules="campoRules"
              label="Marca" filled
              required></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="success" class="mr-4" @click="guardar">
          Guardar
        </v-btn>
      </v-form>
    </v-card-text>
    <dialogMensaje :mostrar="dialogMsj.mostrar" @cerrado="dialogMsj.mostrar=false" :body="dialogMsj.body" :title="dialogMsj.title" :classTitle="dialogMsj.classTitle" />
  </v-card>
</template>

<script>
import axios from "axios";
import dialogMensaje from "../../components/dialogMensaje.vue";
export default {
  components: {
    dialogMensaje,
  },
  data: () => ({
    rutaBackend: `${process.env.VUE_APP_API}`,
    token: {},
    paquete: {
      codigo: null,
      referencia: null,
      serial: null,
      tipo_equipo: "Video Beam",
    },
    dialogMsj: {
      mostrar: false,
      classTitle: 'error',
      title: null,
      body: null
    },
    campoRules: [(v) => !!v || "Campo requerido"],
    items: ["Nuevo", "En reparacion", "Dañado", "Prestado"],
  }),
  methods: {
    guardarEstadoSeleccionado(estado) {
      if (typeof estado == "object" && estado) {
        this.paquete.estado_equipo = estado.id;
      }
    },
    async guardar() {
      if (this.$refs.form.validate()) {
        this.$emit('loadingManager', 'Creando equipo...');
        await axios
          .post(`${this.rutaBackend}/equipo/crear`, this.paquete, this.token)
          .then((response) => {
            if (response.data.creado) {
              this.$refs.form.reset();
            }
            this.dialogMsj.title = "Crear equipo";
            this.dialogMsj.classTitle = response.data.creado ? "success" : "error";
            this.dialogMsj.body = response.data.message;
            this.dialogMsj.mostrar = true;
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
        this.$emit('closeManager');
      }
    },
  },
  async created() {
    this.token = {
      headers: {
        Authorization: `Bearer ${this.$store.getters.getToken}`
      }
    }
    //Buscar el id del tipo de equipo VideoBeam
    await axios
      .get(`${this.rutaBackend}/tipo-equipo/tipo/VideoBeam`, this.token)
      .then((response) => {
        if (response.data.length == 1) {
          this.paquete.tipo_equipo = response.data[0].id;
        }
      });
  },
};
</script>
