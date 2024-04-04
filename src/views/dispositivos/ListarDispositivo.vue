<template>
    <div >
        <v-card >
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="dispositivos"
      :search="search"
    ></v-data-table>
  </v-card>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data() {

        return {
            search: '', 
            headers: [
          {
            text: 'Codigo',
            align: 'start',
            filterable: false,
            value: 'codigo',
          },
          { text: 'Referencia', value: 'referencia' },
          { text: 'Serial', value: 'serial' },
          { text: 'Estado', value: 'estado' },
          { text: 'Tipo', value: 'tipo' },
          
        ],
        dispositivos : []
        }
    },
    mounted() {
        var vm = this
        axios.get('http://localhost:3000/dispositivo')
  .then(function (response) {
    vm.dispositivos = response.data
     
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
    },
    
}
</script>
<style >
.cartac
{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
    background-color: rgba(255, 255, 255, 0) !important;
}
</style>