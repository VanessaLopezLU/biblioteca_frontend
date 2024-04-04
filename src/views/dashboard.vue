<template>
  <v-app id="inspire">
    <Header @handrawer="actualiza()" />
    <Sidebar :drawer="drawer" />
    <v-main>
      <v-container
        class="py-5 "
        fluid>
        <v-row>
          <v-col
            cols="12">
            <router-view @loading="(data) => { msgOverlay = data; overlay = true }" @close="() => { msgOverlay = 'Procesando, por favor espere...'; overlay = false }"></router-view>
          </v-col>
        </v-row>
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