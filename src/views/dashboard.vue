<template>
  <v-app id="inspire">
    <Header @handrawer="actualiza()" />
    <Sidebar :drawer="drawer" />
    <v-main>
      <v-container
        class="py-5"
        fluid>
        <v-row>
          <v-col
            cols="12">
            <router-view @loading="(data) => { msgOverlay = data; overlay = true }" @close="() => { msgOverlay = 'Procesando, por favor espere...'; overlay = false }"></router-view>
          </v-col>
        </v-row>
        <v-row class="justify-end"><v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
         <v-tooltip left color="#757575">
                <template v-slot:activator="{ on, attrs }">
                     <v-btn 
          v-model="fab"
          color="#FFA501"
          elevation="24"
          dark
          fab
           v-bind="attrs"
                    v-on="on"
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          
          <v-icon v-else>
            mdi mdi-book-open-page-variant-outline
          </v-icon>
        </v-btn>
                </template>
                <span>Manual</span>
              </v-tooltip>
     
      </template>
      <v-btn
        fab
        dark
        small
        color="#BF360C"
        @click="verManual"
      > 
        <v-icon>mdi mdi-file-pdf-box</v-icon>
      </v-btn>
 
    </v-speed-dial></v-row>
        
      </v-container>
    </v-main>
    <v-overlay :value="overlay" class="overlayDashboard">
      <v-progress-circular
        indeterminate
        size="50" color="orange" />
      <p class="m-0 font-weight-bold" style="font-size: 1.2rem;">{{ msgOverlay }}</p>
    </v-overlay>
  </v-app>
</template>

<script>
import Header from '../components/core/Header.vue'
import Sidebar from '../components/core/Sidebar.vue'
export default {
  components: { Header, Sidebar },
  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: true,
    overlay: false,
    msgOverlay: "Procesando, por favor espere...",
  }),
  methods: {
    actualiza() {
      console.log("actualizado");
      this.drawer = !this.drawer;
    },
    verManual(){
      if(this.$store.getters.getUsuario.rol.descripcion=="Admin"){
        window.open("http://localhost:8080/Manual_Admin.pdf", "_blank");

      }else{
         window.open("http://localhost:8080/Manual_User.pdf", "_blank");
      }
    }

  },
}
</script>

<style>
#inspire {
  background-image: url("../assets/fondo.png");
  background-size: 100% 100%;
  background-attachment: fixed;
  margin: 0;
}
</style>