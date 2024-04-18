<template>
  <v-card elevation="1">
    <v-navigation-drawer
      v-model="drawerSidebar"
      app
      class="bg-header-global"
      width="322px">
      <vuescroll :ops="ops">
        <div class="bg-header-global">
          <v-img
            contain
            height="120px"
            lazy-src="../../assets/logos/TAlogin.png"
            src="../../assets/logos/TAlogin.png">
          </v-img>
        </div>
        <v-divider></v-divider>
        <div class="app-sidebar-content">
          <sidebar-menu :menu="menu"></sidebar-menu>
        </div>
      </vuescroll>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import vuescroll from "vuescroll";
import { menuRoles } from "@/js/menu";
export default {
  components: {
    SidebarMenu,
    vuescroll,
  },

  props: ["drawer"],
  data: () => ({
    ops: {
      scrollPanel: {
        initialScrollY: false,
        initialScrollX: false,
        scrollingX: false,
        scrollingY: true,
        speed: 300,
        easing: undefined,
        verticalNativeBarPos: "right",
      },
      rail: {
        background: "rgba(0, 0, 0, 0.158)",
        opacity: 1,
        size: "10px",
        specifyBorderRadius: false,
        gutterOfEnds: null,
        gutterOfSide: "2px",
        keepShow: false,
      },
      bar: {
        showDelay: 500,
        onlyShowBarOnScroll: true,
        keepShow: false,
        background: "#0378a677",
        opacity: 1,
        hoverStyle: false,
        specifyBorderRadius: false,
        minSize: 0,
        size: "9px",
        disable: false,
      },
    },
    drawerSidebar: false,
    menu: [],
  }),
  mounted() {
    const rol = this.$store.getters.getUsuario.rol.descripcion.toLowerCase();
    const indexRol = menuRoles.findIndex(
      (item) => item.rol.toLowerCase() == rol
    );
    if (indexRol != -1) {
      this.menu = menuRoles[indexRol].menu;
    }
  },
  watch: {
    drawer: {
      handler(val) {
        this.drawerSidebar = val;
      },
      immediate: true
    }
  },
  methods: {
    prestamo() {
      this.$router.push("/dashboard/ManagerView");
    },
    navegar(title) {
      switch (title) {
        case "Inicio":
          this.$router.push("/");
          break;
        case "Prestamo":
          this.$router.push("/dashboard/ManagerView");
          break;
        case "Préstamo p":
          this.$router.push("/prestamo");
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
/* .bg-header-global {
    /* background-color: #FFA726!important; 
    /* background-image: url('@/assets/fondo.png') !important; 
    /*background-repeat: repeat; 
} */

.theme--light.v-list-item:hover::before {
  color: #000 !important;
  opacity: 0.3 !important;
}

.v-list-item--link:before {
  background-color: #b3e5fc !important;
}

.letra {
  color: #ffffff;
  font-size: 20px;
  font-family: "Mystery Quest";
  font-weight: 400;
}
</style>
