<template>
  <v-card width="500px" class="mx-auto">
    <v-card-title>Cargador</v-card-title>
    <v-img
      height="297px"
      lazy-src="../../assets/cargador.jpg"
      src="../../assets/cargador.jpg"></v-img>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.serial"
              :rules="campoRules"
              label="Serial"
              filled
              required />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.marca"
              :rules="campoRules"
              label="Marca"
              required filled />
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
    dialogMensaje
  },
  data: () => ({
    rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
    valid: true,
    token: {},
    dialogMsj: {
      mostrar: false,
      classTitle: 'error',
      title: null,
      body: null
    },
    paquete: {
      serial: null,
      marca: null,
      tipo_equipo: "Cargador", //Autoload
    },
    campoRules: [(v) => !!v || "Campo requerido"],
    select: null,
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
        this.$emit('loadingManager', 'Creando equipo...')
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
    //Buscar el id del tipo de equipo Cargador
    await axios
      .get(`${this.rutaBackend}/tipo-equipo/tipo/Cargador`, this.token)
      .then((response) => {
        if (response.data.length == 1) {
          this.paquete.tipo_equipo = response.data[0].id;
        }
      });
  },
};
</script>
