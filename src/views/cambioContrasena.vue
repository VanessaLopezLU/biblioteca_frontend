<template>
  <v-app>
    <v-app-bar app dark style="background-color: #a6a6a6">
      <v-row rows="3">
        <v-col class="logo" cols="3">
          <img
            src="../assets/logos/TAlogin.png"
            style="max-height: 100px; max-width: 150px" />
        </v-col>
        <v-col cols="6" class="text-center">
          <img
            src="../assets/logos/title.png"
            style="max-height: 300px; max-width: 600px" />
        </v-col>
      </v-row>
    </v-app-bar>
    <br />
    <v-content v-if="puedeRecuperar">
      <v-container>
        <div class="container h-50">
          <div class="d-flex justify-content-center h-50">
            <div class="user_card">
              <div class="d-flex justify-content-center">
                <div class="brand_logo_container">
                  <img
                    src="../assets/logos/TAlogin.png"
                    class="brand_logo"
                    alt="Logo" />
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <v-form v-on:submit.prevent ref="formCambiar" class="mt-12" style="width: 100%;">
                  <v-row no-gutters>
                    <v-col cols="12" class="pt-12">
                      <v-text-field
                        v-model="nuevaContrasena"
                        :append-icon="nueva ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required]"
                        :type="nueva ? 'text' : 'password'"
                        filled
                        label="Nueva contraseña"
                        @click:append="nueva = !nueva" autocomplete="off" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="confirmacionContrasena"
                        filled
                        :append-icon="confirmacion ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, confirmContrasenaRule]"
                        :type="confirmacion ? 'text' : 'password'"
                        label="Confirmar contraseña"
                        @click:append="confirmacion = !confirmacion" autocomplete="off" />
                    </v-col>
                  </v-row>
                  <div
                    class="d-flex justify-content-center mt-3 login_container">
                    <vs-button
                      dark
                      class="btn login_btn"
                      @click="recuperarContrasena">Cambiar contraseña</vs-button>
                  </div>
                </v-form>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-content>
    <v-content v-else>
      <v-row no-gutters class="flex-column align-items-center">
        <v-col cols="9">
          <v-img
            lazy-src="@/assets/images/404.jpg"
            max-height="350"
            src="@/assets/images/404.jpg" />
        </v-col>
        <p class="h3">{{ puedeMsj }}</p>
        <a @click="() => $router.push('/')" class="text-h5">Ir al inicio</a>
      </v-row>
    </v-content>

    <dialogMensaje
      :mostrar="dialogMsj"
      @cerrado="dialogMsj = false"
      :title="paqueteMsj.title"
      :body="paqueteMsj.body"
      :classTitle="paqueteMsj.classTitle" />
  </v-app>
</template>

<script>
import axios from "axios";
import dialogMensaje from "../components/dialogMensaje.vue";

export default {
  name: "App",
  components: {
    dialogMensaje,
  },
  data: () => ({
    confirmacion: false,
    nueva: false,
    nuevaContrasena: null,
    confirmacionContrasena: null,
    rules: {
      required: value => !!value || 'Campo requerido',
    },
    rutaBackend: `${process.env.VUE_APP_API}`,
    puedeRecuperar: false,
    puedeMsj: null,
    dialog: false,
    dialogMsj: false,
    paqueteMsj: {
      title: "",
      body: "",
      classTitle: "error",
    },
    correo: "",
  }),
  methods: {
    async recuperarContrasena() {
      if (this.$refs.formCambiar.validate()) {
        this.$emit('loading', 'Actualizando contraseña...');
        await axios.put(`${this.rutaBackend}/usuario/cambiar-contrasena`,
          {
            cedula: parseInt(this.$route.params.cedula),
            contrasena: this.nuevaContrasena,
          }
        ).then(response => {
          this.paqueteMsj.title = "Cambiar contraseña";
          this.paqueteMsj.body = response.data.message;
          this.paqueteMsj.classTitle = response.data.actualizado ? "success" : "error";
          if (response.data.actualizado) {
            this.$router.push('/');
          }
        });
        this.$emit('close');
      }
    },
  },
  computed: {
    confirmContrasenaRule() {
      return (value) => {
        if (value === this.nuevaContrasena) {
          return true;
        }
        return 'Las contraseñas no coinciden';
      };
    }
  },
  async created() {
    await axios.get(
      `${this.rutaBackend}/usuario/puede-recuperar/${this.$route.params.cedula}/${this.$route.params.token}`
    ).then(response => {
      this.puedeRecuperar = response.data.puede;
      this.puedeMsj = response.data.message;
    });
  }
};
</script>

<style scoped>
.fondo {
  background-image: url("../assets/fondologin2.png");
  background-size: 100% 100%;
  background-attachment: fixed;
  width: 100%;
  height: 120vh;
  margin: 0;
}

.fondo2 {
  background-image: url("../assets/fondoTimeLine.png");
  background-size: 100% 100%;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
}

.fondoGeneral {
  background-image: url(../assets/fondo.png);
  background-size: 100% 100%;
  background-attachment: fixed;
  margin: 0;
}

.letras {
  color: white !important;
  margin: auto !important;
  text-align: center !important;
  font: bold 80px/1 arial !important;
  text-transform: uppercase !important;
  color: rgb(244, 244, 244) !important;
  text-shadow: 0 2px 0 black, 0 4px 0 black, 0 6px 0 black, 0 8px 0 black,
    0 10px 0 black, 0 12px 0 black !important;
}

.letras2 {
  font-size: 25px;
  color: black;
  margin: auto;
  text-align: justify;
  font-family: "Mystery Quest", cursive;
}

@import url("https://fonts.googleapis.com/css?family=Mystery+Quest");

.user_card {
  height: 500px;
  width: 350px;
  margin-top: auto;
  margin-bottom: auto;
  background: #ffffffb9;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

.brand_logo_container {
  position: absolute;
  height: 170px;
  width: 170px;
  top: -75px;
  border-radius: 50%;
  padding: 10px;
  text-align: center;
  margin-top: 70px;
}

.brand_logo {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 2px solid white;
  margin-top: 16px;
}

.form_container {
  margin-top: 100px;
}

.login_btn {
  background: #f47025 !important;
  color: #ffffff !important;
  font-weight: 700;
}

.login_btn:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.login_container {
  padding: 0 2rem;
}

.input-group-text {
  background: #f47025 !important;
  color: #ffffff !important;
  border: 0 !important;
  border-radius: 0.25rem 0 0 0.25rem !important;
}

.input_user,
.input_pass:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.custom-checkbox .custom-control-input:checked~.custom-control-label::before {
  background-color: #c0392b !important;
}

.vs-button {
  margin-top: 25px;
}

.logo {
  margin-top: 10px;
}

.text-center {
  margin-top: 10px;
}
</style>
<style>
.v-dialog {
  box-shadow: none !important;
}

.v-card__title {
  font-size: 30px !important;
  font-weight: bold !important;
}

.v-card__text {
  font-size: 19px !important;
}

.v-text-field .v-input__prepend-inner,
.v-text-field .v-input__append-inner {
  align-self: center !important;
}
</style>
