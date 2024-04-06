<template>
  <v-card width="500px" class="mx-auto">
    <v-card-title>Portátil</v-card-title>
    <v-img height="297px" lazy-src="../../assets/images/Portatil.png" src="../../assets/images/Portatil.png"></v-img>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.serial"
              :rules="campoRules"
              label="Serial" filled
              required />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.codigo_telefonica"
              :rules="campoRules"
              label="Código telefónica" filled
              required />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="paquete.marca"
              label="Marca" filled
              required :rules="campoRules" />
          </v-col>
        </v-row>
        <v-btn
          color="success"
          class="mr-4"
          @click="guardar">
          Guardar
        </v-btn>
      </v-form>
    </v-card-text>
    <!--Dialog para mensajes temporales-->
    <dialogMensaje :mostrar="dialogMsj.mostrar" :title="dialogMsj.title" :body="dialogMsj.body" :classTitle="dialogMsj.classTitle" @cerrado="dialogMsj.mostrar = false" />
  </v-card>
</template>

<script>
import axios from "axios";
import dialogMensaje from '../../components/dialogMensaje.vue';
export default {
  components: {
    dialogMensaje
  },
  data: () => ({
    rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
    token: {},
    paquete: {
      serial: null,
      codigo_telefonica: null,
      marca: null,
      tipo_equipo: "Portátil", //Aquí va el id del tipo de equipo, se carga automático
    },
    campoRules: [
      (v) => !!v || "Campo requerido",
    ],
    select: null,
    items: ["Nuevo", "En reparacion", "Dañado", "Prestado"],
    dialogMsj: {
      classTitle: 'error',
      title: null,
      body: null
    },
  }),

  methods: {
    guardarEstadoSeleccionado(estado) {
      if (typeof estado == 'object' && estado) {
        this.paquete.estado_equipo = estado.id;
      }
    },
    async guardar() {
      if (this.$refs.form.validate()) {
        this.$emit('loadingManager', 'Creando equipo...');
        await axios.post(`${this.rutaBackend}/equipo/crear`, this.paquete, this.token)
          .then(response => {
            if (response.data.creado) {
              this.$refs.form.reset();
            }
            this.dialogMsj.title = "Crear equipo";
            this.dialogMsj.classTitle = response.data.creado ? "success" : "error";
            this.dialogMsj.body = response.data.message;
            this.dialogMsj.mostrar = true;
          })
          .catch(error => {
            this.detalleMsj.classTitle = 'error';
            this.detalleMsj.title = "Crear equipo";
            this.detalleMsj.body = "No se pudo guardar el equipo";
            this.dialogMsj = true;
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
    //Buscar el id del tipo de equipo Portatil
    await axios.get(`${this.rutaBackend}/tipo-equipo/tipo/Portátil`, this.token).then(response => {
      if (response.data.length == 1) {
        this.paquete.tipo_equipo = response.data[0].id;
      }
    });
  }
};
</script>