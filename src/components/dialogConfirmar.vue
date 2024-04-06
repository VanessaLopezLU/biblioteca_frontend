<template>
    <v-row justify="space-around">
        <v-col cols="auto">
            <v-dialog persistent
                transition="dialog-bottom-transition"
                max-width="430" v-model="dialogConfirmacion">
                <v-card>
                    <v-card-title class="justify-content-center">
                        <h3 style="font-weight: bold;">Eliminar {{ entidad }}</h3>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-dark my-3 h4">¿Seguro de qué quiere eliminar este {{ entidad }}?</p>
                        <p class="text-dark my-3 h5">Está acción no se puede revertir</p>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn color="orange" @click="() => { this.$emit('confirmacion', true) }">Sí, eliminar</v-btn>
                        <v-btn color="error" @click="() => { this.$emit('confirmacion', false) }">No, cancelar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: 'dialogConfirmacion',
    props: {
        entidad: { type: String, default: '' },
        mostrar: {
            type: Boolean, default: false
        },
    },
    data: () => ({
        dialogConfirmacion: false,
    }),
    watch: {
        mostrar() {
            this.dialogConfirmacion = this.mostrar;
        }
    }
}
</script>