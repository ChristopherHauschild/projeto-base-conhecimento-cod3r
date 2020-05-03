<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard"
            sub="Base de Conhecimento" />
        <div class="stats">
            <Stat title="Categorias" :value="stat.categories"
                icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles"
                icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users"
                icon="fa fa-user" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import Stat from './Stat'
import axios from 'axios' // Requisição para o backend
import { baseApiUrl } from '@/global'

export default {
    name: 'Home',
    components: { PageTitle, Stat },
    data: function() { // Estado interno
        return {
            stat: {}
        }
    },
    methods: {
        getStats() { // Requisição para backend
            // Pegando dados de url/stats e injetando em stats
            axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data)
        }
    },
    mounted() {
        this.getStats() // Seta resultado dentro de stat quadno monta component
    }
}
</script>

<style>

    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

</style>