<template>
    <v-row no-gutters>
        <v-card width="100%">
            <v-card-title class="pt-0 px-0">
                <v-bottom-navigation
                    :value="value"
                    color="var(--c-orange)" class="justify-content-center" height="auto">
                    <div>
                        <h4 class="word-break">Seleccione equipo a registrar</h4>
                        <v-select
                            v-model="select"
                            :items="itemsSelect"
                            item-text="tipo"
                            item-value="id"
                            label="Tipo de equipo"
                            return-object
                            single-line
                            required no-data-text="Sin tipos de equipo"></v-select>
                    </div>
                </v-bottom-navigation>
            </v-card-title>
            <v-card-text>
                <router-view @loadingManager="(data) => { msgOverlay = data; overlayManager = true; }" @closeManager="() => { msgOverlay = 'Procesando, por favor espere...'; overlayManager = false; }" />
            </v-card-text>
        </v-card>

        <!-- <v-card width="300px" height="300px" class="mx-auto">
                <v-card-title>
                    Seleccione equipo a registrar
                </v-card-title>
                <v-card-text>

                </v-card-text>
            </v-card> -->
        <v-overlay :value="overlayManager" class="overlayManager">
            <v-progress-circular
                indeterminate
                size="50" color="orange" />
            <p class="m-0 font-weight-bold">{{ msgOverlay }}</p>
        </v-overlay>
    </v-row>
</template>

<script>
import axios from 'axios';
export default {
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        overlayManager: false,
        msgOverlay: 'Procesando, por favor espere...',
        value: 1,
        select: { tipo: null, ruta: null },
        itemsSelect: [],
        items: [
            {
                tipo: 'VideoBeam',
                ruta: '/dashboard/ManagerView/VideoBeam',
            },
            {
                tipo: 'Portátil',
                ruta: '/dashboard/ManagerView/Portatil'
            },
            {
                tipo: 'Mouse',
                ruta: '/dashboard/ManagerView/Mouse'
            },
            {
                tipo: 'Teclado',
                ruta: '/dashboard/ManagerView/Teclado'
            },
            {
                tipo: 'Cable HDMI',
                ruta: '/dashboard/ManagerView/CableHdmi'
            }

        ],
    }),

    methods: {
        async obtenerTiposEquipo() {
            await axios.get(`${this.rutaBackend}/tipo-equipo`).then(response => {
                this.itemsSelect = response.data;
            });
        }
    },
    watch: {
        select() {
            let comparar1, comparar2, coinc = false;
            this.items.filter(item => {
                comparar1 = item.tipo.toLocaleLowerCase();
                comparar2 = this.select.tipo.toLocaleLowerCase();
                if (comparar1 === comparar2) {
                    coinc = true;
                    this.$router.push(item.ruta);
                }
            });
            if (!coinc) {
                this.$router.push('/dashboard/ManagerView/nuevo');
            }
        }
    },
    created() {
        this.obtenerTiposEquipo();
    }
}
</script>
<style scoped>
.overlayManager {
    z-index: 203 !important;
}
</style>