<template>
    <v-select
        v-model="estadoSelect"
        :items="items"
        item-text="estado"
        item-value="id"
        return-object
        filled
        :rules="[(v) => !!v || 'Estado es requerido']"
        label="Estado"
        required @change="estadoSeleccionado"></v-select>
</template>
<script>
import axios from 'axios'
export default {
    props: ['estado'],
    name: 'EstadoEquipo',
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        estadoSelect: null,
        pos: null,
        items: [],
    }),
    methods: {
        async obtenerEstadosEquipo() {
            await axios.get(`${this.rutaBackend}/estado-equipo`).then(response => {
                this.items = response.data;
            });
        },
        estadoSeleccionado() {
            this.$emit('selectEstado', { estado: this.estadoSelect, posicion: this.pos });
        }
    },
    watch: {
        estado() {
            console.log(this.$props.estado);
            this.estadoSelect = this.$props.estado.value;
            this.pos = this.$props.estado.index;
        }
    },
    created() {
        this.obtenerEstadosEquipo();
    },

}
</script>