<template>
    <v-app>
      <v-app-bar app dark style="background-color: #a6a6a6">
        <v-row rows="3">
          <v-col class="logo" cols="3">
            <img src="../assets/logos/TAlogin.png" style="max-height: 100px; max-width: 150px" />
          </v-col>
          <v-col cols="6" class="text-center">
            <img src="../assets/logos/title.png" style="max-height: 300px; max-width: 600px" />
          </v-col>        </v-row>
      </v-app-bar>
      <br>
      <v-content>
        <v-container>
          <div class="container h-50">
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
                      <input v-model="correo" type="text" name="" class="form-control input_user" placeholder="Correo electrónico" />
                    </div>
                    <div class="d-flex justify-content-center mt-3 login_container">
                      <vs-button dark class="btn login_btn" @click="recuperarContrasena">Recuperar</vs-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </v-container>
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
      active: "home",
      rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      dialog: false,
      dialogMsj: false,
      paqueteMsj: {
        title: '',
        body: '',
        classTitle: 'error'
      },
      correo: "",
    }),
    methods: {
      async recuperarContrasena() {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}/usuario/recuperar-contrasena`, {
            email: this.correo
          });
          if (response.data.success) {
            this.$refs.formSesion.reset();
            this.$refs.dialogMensaje.mostrarMensaje("Éxito", response.data.message, "success");
            this.$router.navigate
            this.$router.push("/cambio");
          } else {
            this.$refs.dialogMensaje.mostrarMensaje("Error", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error al recuperar la contraseña:", error);
          this.$refs.dialogMensaje.mostrarMensaje("Error", "Error al recuperar la contraseña", "error");
        }
      }
    }
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
  