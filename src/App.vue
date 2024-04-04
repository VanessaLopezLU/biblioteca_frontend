<template>
  <v-app id="inspire">
    <div class="app-container">
      <router-view @loading="(data) => { msgOverlay = data; overlay = true }" @close="() => { msgOverlay = 'Procesando, por favor espere...'; overlay = false }" />
    </div>
    <v-overlay :value="overlay" class="overlayApp">
      <v-progress-circular
        indeterminate
        size="64" color="orange" />
      <p class="m-0 font-weight-bold" style="font-size: 1.2rem;">{{ msgOverlay }}</p>
    </v-overlay>
  </v-app>
</template>

<script>

export default {
  data: () => ({
    overlay: false,
    msgOverlay: "Procesando, por favor espere...",
  })
}
</script>

<style lang="scss">
@import "assets/base.scss";
@import "scss/_dashboard.scss";

@font-face {
  font-family: SairaCondensed;
  src: url("./assets/fonts/SairaCondensed-Light.ttf");
}

label,
p,
span,
h1,
h2,
h3,
h4,
h5,
h6,
div {
  font-family: SairaCondensed !important;
}

.font-saira {
  font-family: SairaCondensed !important;
}

.v-overlay.overlayApp.v-overlay--active,
.v-overlay.overlayDashboard.v-overlay--active,
.overlayApp,
.overlayDashboard {
  z-index: 203 !important;
}

:root {
  --c-orange: orange;
}

.bc-orange {
  background-color: orange;
}

.justify-content-evenly {
  justify-content: space-evenly;
}

.c-orange {
  color: orange;
}

.btn-tabla {
  background-color: var(--c-orange) !important;
  color: white !important;
}

.btn-cancelar:hover::before,
.btn-cancelar:focus::before {
  transition: all .3s ease;
  opacity: 0.4 !important;
  background-color: var(--c-orange) !important;
}

.btn-cancelar:hover>.v-btn__content,
.btn-cancelar:focus>.v-btn__content {
  color: #FFFFFF;
}

.v-text-field.v-input--is-focused>.v-input__control>.v-input__slot:after {
  border-color: var(--c-orange) !important;
}

.v-text-field__slot>.v-label.primary--text {
  color: var(--c-orange) !important;
}

.v-progress-linear>.v-progress-linear__background.primary {
  background-color: var(--c-orange) !important;
}

.v-progress-linear .v-progress-linear__indeterminate .long,
.v-progress-linear .v-progress-linear__indeterminate .short {
  background-color: var(--c-orange) !important;
}

.v-sidebar-menu .vsm-header {
  color: rgb(0, 0, 0);
}

div.v-application .primary--text {
  color: orange !important;
}

.v-sidebar-menu .vsm-link {
  background-color: orange !important;
}

.v-sidebar-menu .vsm-title {
  color: #FFFFFF;
}

.v-sidebar-menu .vsm-icon {
  color: #FFFFFF;
}

.v-sidebar-menu .vsm-arrow {
  color: #FFFFFF;
  opacity: 1;
}

.v-sidebar-menu .vsm-link:hover {
  background-color: #ffffff70;
}


.v-sidebar-menu .vsm-item.active-item>.vsm-link>.vsm-icon+.vsm-title {
  color: #000;

}

.v-sidebar-menu .vsm-dropdown .vsm-item .vsm-link {
  padding: 0 2.4rem;
}

.v-sidebar-menu .vsm-dropdown::before {
  background-color: orange !important;
}

.btn-app-bar {
  border-radius: 50px;
  padding: 6px;
  background-color: #a299a3c5;
}

.btn-app-bar:hover {
  border-radius: 50px;
  padding: 6px;
  background-color: #a299a3 !important;
}



/*    .body-component{
    background-image: url("./assets/fondo.png");
    background-size: cover;
    background-repeat: no-repeat;
    height:100vh;
    background-attachment: fixed;
    overflow: scroll;
  } */


.button-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
}

.text-error {
  color: #E539 !important;
}

.text-success {
  color: #43A0 !important;
}


.v-overlay>.v-overlay__content {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  align-items: center !important;
}
</style>