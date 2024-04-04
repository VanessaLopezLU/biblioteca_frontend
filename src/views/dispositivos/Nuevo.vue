<template>
    <v-card width="500px" class="mx-auto">
        <v-card-title>Nuevo equipo</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            v-model="paquete.codigo"
                            :rules="campoRules"
                            label="Código"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="paquete.referencia"
                            :rules="campoRules"
                            label="Referencia"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="paquete.serial"
                            label="Serial"
                            required></v-text-field>
                    </v-col>
                </v-row>
                <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-4"
                    @click="guardar">
                    Guardar
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        rutaBackend: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        valid: true,
        paquete: {
            codigo: null,
            referencia: null,
            serial: null,
            tipo_equipo: "Cable HDMI",//Aquí va el id del tipo de equipo, se carga automático
        },
        campoRules: [
            (v) => !!v || "Campo requerido",
        ],
        select: null,
        items: ["Nuevo", "En reparacion", "Dañado", "Prestado"],
    }),

    methods: {
        async guardar() {
            if (this.$refs.form.validate()) {
                this.valid = false;
                await axios.post(`${this.rutaBackend}/equipo/crear`, this.paquete)
                    .then(response => {
                        console.log(response);
                        this.paquete.estado_equipo = null;
                        this.$refs.form.reset();
                    })
                    .catch(error => {
                        // handle error
                        console.log(error);
                        alert('No se pudo guardar');
                    });
                this.valid = true;
            }
        },
    },
    async created() {
        //Buscar el id del tipo de equipo Cable HDMI
        await axios.get(`${this.rutaBackend}/tipo-equipo/tipo/Cable HDMI`).then(response => {
            if (response.data.length == 1) {
                this.paquete.tipo_equipo = response.data[0].id;
            }
        });
    }
};
</script>