<template>
  <div>
    <v-app-bar app elevate-on-scroll elevation="8" relative>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" src="../../assets/Tulbar.png"></v-img>
      </template>
      <v-app-bar-nav-icon class="btn" dark @click="procesa()"></v-app-bar-nav-icon>

      <v-toolbar-title class="letra">SISTEMA DE BIBLIOTECAS</v-toolbar-title>

      <v-spacer></v-spacer>
      <p class="m-0 p-0 letra" style="font-size: 1.2rem;">
        {{ $store.getters.getUsuario.nombre }} - {{ $store.getters.getUsuario.rol.descripcion }}
      </p>
      <v-menu offset-y>

        <template v-slot:activator="{ on, attrs }">

          <span v-bind="attrs" v-on="on" style="cursor: point" class="mx-5 mr-10">
            <v-avatar size="40">
              <img src="../../assets/perfil.png" />
            </v-avatar>
          </span>
        </template>
        <v-list dense>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item v-for="(item, i) in items" :key="i" @click="action(item.action)">
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-row justify="space-around"> 
      <v-col cols="12">
        <v-dialog transition="dialog-bottom-transition" max-width="550" v-model="dialogPerfil">
          <v-card>
            <v-card-title>Mis datos</v-card-title>
            <v-card-text>
              <v-row class="flex-column">
                <v-col cols="12" class="pb-0">
                  <v-text-field v-model="$store.getters.getUsuario.cedula" filled readonly label="Cédula" />
                </v-col>
                <v-row no-gutters class="flex-xs-wrap">
                  <v-col sm="12" md="6" class="pr-sm-3 pr-1 pl-3 pb-0 col-xs-12">
                    <v-text-field v-model="$store.getters.getUsuario.nombre" filled readonly label="Nombres" />
                  </v-col>
                  <v-col sm="12" md="6" class="pl-sm-3 pl-1 pr-sm-3 pr-3 pb-0 col-xs-12">
                    <v-text-field v-model="$store.getters.getUsuario.apellido" filled readonly label="Apellidos" />
                  </v-col>
                </v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field v-model="$store.getters.getUsuario.telefono" filled readonly label="Teléfono" />
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field v-model="$store.getters.getUsuario.email" filled readonly label="Correo" />
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field v-model="$store.getters.getUsuario.rol.descripcion" filled readonly label="Rol" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="success" tonal dark @click="dialogPerfil = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>

</template>

<script>
export default {

  data() {
    return {
      selectedItem: null,
      items: [
        { text: 'Perfil', icon: 'mdi mdi-account', action: 'perfil' },
        { text: 'Salir', icon: 'mdi mdi-logout', action: 'salir' }
      ],
      dialogPerfil: false
    };
  },
  methods: {
    procesa() {
      this.$emit("handrawer");
    },
    action(action) {
      switch (action.toLowerCase()) {
        case "salir":
          this.$store.commit("setusuario", null);
          this.$router.push("/");
          break;
        case "perfil":
          this.dialogPerfil = true;
          break;
      }
    },

  }
};
</script>
<style lang="scss" scoped>
.letra {
  color: white;
  font-size: 36px;
  font-family: "arial", cursive;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;
}
</style>
