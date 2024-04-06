<template>
  <v-app>
    <v-app-bar app dark style="background-color: #a6a6a6">
      <v-row rows="3">
        <v-col class="logo" cols="3">
          <img src="../assets/logos/TAlogin.png" style="max-height: 100px; max-width: 150px" />
        </v-col>
        <v-col cols="6" class="text-center">
          <img src="../assets/logos/title.png" style="max-height: 300px; max-width: 600px" />
        </v-col>
        <v-col cols="3">
          <vs-button class="ml-auto" style="
              background-color: #f57025;
              color: white;
              font-size: 16px;
              font-weight: bold;
            " @click="dialog = true;">Iniciar Sesión</vs-button>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-carousel class="mt-4">
        <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" reverse-transition="fade-transition"
          transition="fade-transition"></v-carousel-item>
      </v-carousel>
      <v-row>
        <v-col cols="4">
          <v-card class="mx-auto my-12" max-width="374" height="550">
            <v-img cover height="250" src="../assets/card1.png"></v-img>
            <v-card-title>¿Quiénes somos?</v-card-title>
            <v-card-text>
              <div>
                Somos una entidad encargada de preservar y catalogar el
                patrimonio bibliográfico y documental del país para ponerlo al
                servicio de investigadores, académicos y del público en general.
                En la Biblioteca del SENA podrás encontrar material sobre
                cualquier tema o autor colombiano. Somos el centro de
                conservación de todo lo que se publica en el país y uno de los
                referentes de la historia y la cultura colombiana.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="mx-auto my-12" max-width="374" height="550">
            <v-img cover height="250" src="../assets/vision.jpg"></v-img>
            <v-card-title>Misión</v-card-title>
            <v-card-text>
              <div>
                La Biblioteca SENA garantiza la recuperación, preservación y
                acceso a la memoria colectiva del país, representada por el
                patrimonio bibliográfico y hemerográfico en cualquier soporte
                físico. En su trabajo, se guía por el reconocimiento de la
                diversidad cultural del país y el derecho de todos los
                ciudadanos a la información y al conocimiento como base de su
                desarrollo individual y colectivo, y con base en estos
                principios orientar sus desarrollos y procesos.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="mx-auto my-12" max-width="374" height="550">
            <v-img cover height="250" src="../assets/estudiantes.jpg"></v-img>
            <v-card-title>Visión</v-card-title>
            <v-card-text>
              <div>
                Nuestra visión para el año 2023 es lograr contar en el futuro
                con la infraestructura necesaria para la conservación a largo
                plazo de las colecciones, con tecnología de punta para el
                desarrollo de nuestros procesos misionales y mantener una red de
                trabajo con las bibliotecas públicas, de acuerdo con nuestra
                misión.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="350" height="400">
        <div class="container h-60">
          <div class="d-flex justify-content-center h-50">
            <div class="user_card">
              <div class="d-flex justify-content-center">
                <div class="brand_logo_container">
                  <img src="../assets/logos/TAlogin.png" class="brand_logo" alt="Logo" />
                </div>
              </div>
              <div class="d-flex justify-content-center form_container">
                <form v-on:submit.prevent ref="formSesion">
                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text"><i class="fas fa-user"></i></span>
                    </div>
                    <input v-model="usuario" type="text" name="" class="form-control input_user" placeholder="Cédula"
                      :rules="numberRules" />
                  </div>
                  <div class="input-group mb-2">
                    <div class="input-group-append">
                      <span class="input-group-text"><i class="fas fa-key"></i></span>
                    </div>
                    <input v-model="contrasena" type="password" name="" class="form-control input_pass"
                      placeholder="Contraseña" :rules="campoRules" />
                  </div>
                  <div class="d-flex justify-content-center mt-3 login_container">
                    <vs-button dark class="btn login_btn" @click="login">Iniciar Sesión</vs-button>
                  </div>
                </form>
              </div>

              <div class="mt-4">
                <div class="d-flex justify-content-center links">
                  <a @click="() => $router.push('/recuperar')" style="color: black">¿Olvidaste tu contraseña?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-dialog>
    </v-main>
    <v-footer padless>
      <v-card flat tile height="100%" width="100%" class="mt-0 orange lighten-1 white--text text-center">
        <v-card-text>
          <v-btn v-for="(icon, index) in icons" :key="icon" class="mx-4 white--text" icon :href="iconsN[index].url">
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          El Sistema Nacional de Bibliotecas - (SBS) proporciona recursos de
          información a la comunidad SENA y a los empresarios innovadores,
          aportando conocimiento para todos los colombianos.
        </v-card-text>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Biblioteca Sena</strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <dialogMensaje :mostrar="dialogMsj" @cerrado="dialogMsj = false" :title="paqueteMsj.title" :body="paqueteMsj.body"
      :classTitle="paqueteMsj.classTitle" />
  </v-app>
</template>

<script>
import axios from "axios";
import dialogMensaje from "../components/dialogMensaje.vue";
dialogMensaje
export default {
  name: "App",
  components: {
    dialogMensaje,
  },
  data: () => ({
    active: "home",
    rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
    dialog: false,
    dialogMsj: false,
    paqueteMsj: {
      title: '',
      body: '',
      classTitle: 'error'
    },
    usuario: "",
    noti: null,
    contrasena: "",
    error: false,
    msg: "",
    isBusy: false,
    array: [],
    rolMenu: [],
    items: [
      {
        src: require("../assets/carousel/biblioteca-1.jpg"),
      },
      {
        src: require("../assets/carousel/biblioteca-2.jpg"),
      },
      {
        src: require("../assets/carousel/biblioteca-3.jpg"),
      },
    ],
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    iconsN: [
      {
        icon: "mdi-facebook",
        url: "https://web.facebook.com/SENACordoba/?_rdc=1&_rdr",
      },
      {
        icon: "mdi-twitter",
        url: "https://twitter.com/senaencordoba?lang=es",
      },
      {
        icon: "mdi-linkedin",
        url: "https://www.linkedin.com/school/servicio-nacional-de-aprendizaje-sena-/?originalSubdomain=co",
      },
      {
        icon: "mdi-instagram",
        url: "https://www.instagram.com/senacomunica/?hl=es-la",
      },
    ],
    campoRules: [(v) => !!v || "Campo requerido"],
    numberRules: [
      (v) => !!v || "Campo requerido",
      (v) => parseInt(v) > 0 || "Debe ser valor númerico",
    ],
  }),
  methods: {
    async login() {
      this.$emit('loading', 'Verificando credenciales, espere un momento...');
      await axios
        .post(`${this.rutaBackend}/auth/login`, {
          cedula: parseInt(this.usuario),
          password: this.contrasena,
        })
        .then((response) => {
          this.$emit('close');
          if (response.data.access_token) {
            this.paqueteMsj.title = "Iniciar sesión";
            this.paqueteMsj.body = "Se inició sesión correctamente";
            this.paqueteMsj.classTitle = response.data ? "success" : "error";
            this.dialogMsj = true;
            this.$store.commit("setusuario", response.data);
            this.$router.push("/dashboard/miprestamo");
          } else {
            this.paqueteMsj.title = "Iniciar sesión";
            this.paqueteMsj.body = "No se pudo iniciar sesión";
            this.paqueteMsj.classTitle = "error";
            this.dialogMsj = true;
          }
        })
        .catch((error) => {
          this.$emit('close');
          console.log("Error login: " + error);
          this.paqueteMsj.title = "Iniciar sesión";
          this.paqueteMsj.body = error.response.data.message;
          this.paqueteMsj.classTitle = "error";
          this.dialogMsj = true;
        });

    }
  },
};
</script>

<style scoped>
.margen {
  margin-top: 150px;
}

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
  width: 100%;
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
</style>
<style>
.v-card__title {
  font-size: 30px !important;
  font-weight: bold !important;

}

.v-card__text {
  font-size: 19px !important;
}
</style>
