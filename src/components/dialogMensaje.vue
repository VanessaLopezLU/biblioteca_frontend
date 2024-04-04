<template>
    <v-row justify="space-around">
        <v-col cols="auto">
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="500" v-model="dialogMsj">
                <v-card>
                    <v-card-title class="justify-content-center">
                        <h3 :class="ponerClase" style="font-weight: bold;">{{ title }}</h3>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-dark my-3 h5">{{ body }}</p>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: 'dialogMensaje',
    props: {
        title: { type: String, default: '' },
        body: { type: String, default: '' },
        mostrar: {
            type: Boolean, default: false
        },
        classTitle: {
            type: String, default: 'error'
        },
    },
    data: () => ({
        dialogMsj: false,
    }),
    methods: {
        tiempoDialog() {
            setTimeout(() => {
                this.dialogMsj = false;
                this.$emit('cerrado');
            }, 1650);
        },
    },
    watch: {
        mostrar() {
            this.dialogMsj = this.mostrar;
            if (this.mostrar) {
                this.tiempoDialog();
            }
        }
    },
    computed: {
        ponerClase() {
            return `font-saira mb-0 text-center ${this.classTitle}--text`;
        }
    }
}
</script>