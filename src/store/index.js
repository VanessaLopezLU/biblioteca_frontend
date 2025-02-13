import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        usuario: null,
    },
    mutations: {
        setusuario(state, data) {
            state.usuario = data;
        },
    },

    getters: {
        getUsuario(state) {
            return state.usuario;
        },
        getToken(state) {
            return state.usuario.access_token;
        }
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()],
});