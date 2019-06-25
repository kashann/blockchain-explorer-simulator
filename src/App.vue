<template>
  <div id="app">
    <titlu/>
    <navbar/>
    <img src="./assets/blockchain.png" style="width: 55vw;">
    <router-view/>
  </div>
</template>

<script>
import titlu from './components/title';
import navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'App',
  components: {
    titlu,
    navbar
  }
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #f2f2f2;
  }
</style>