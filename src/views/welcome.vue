<template>
  <v-container class="body-component">
    <v-row class="row">
      <v-col>
        <v-img src="../assets/welcome.png" class="logo"></v-img>
        <h3>
          ¡Bienvenido a la Nueva plataforma, con una mejor experiencia de
          usuario! Biblioteca Sena, una herramienta segura y fácil de usar que
          ayuda a los educadores y aprendices a administrar.
        </h3>
      </v-col>
      <v-col cols="6">
        <v-img
          width="500px"
          src="https://cloudfront-us-east-1.images.arcpublishing.com/semana/SMWU75HKVJASJNDKTGRDEZVF7E.JPG"
        />
      </v-col>
      <v-col cols="6">
        <v-img
          src="https://img.freepik.com/foto-gratis/ordenador-portatil-libro-trabajo-sala-biblioteca_1150-5925.jpg"
          width="500px"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default{
  mounted(){
    console.log('Datos usuariolog: ', this.$store.getters.getUsuario);
  }
}
</script>
<style scoped>
.row {
  align-items: center;
  justify-content: center;
}
.img {
  height: 500px;
  width: 500px;
}

h3 {
  padding-top: 0px;
  font-family: "Staatliches", cursive;
}
.logo {
  height: 100px;
  width: 700px;
  margin: 0;
  padding: 0;
}
</style>
