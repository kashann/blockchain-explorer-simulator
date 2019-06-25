<template>
    <b-container>
        <div>
            A PUBLIC KEY (Address) and PRIVATE KEY will be generated
        </div>
        <b-button size="sm" @click="ok.push(1)">Proceed</b-button>
        <br>
        <div v-if="ok[0]===1">
            <h2>Public Address: <strong>{{ data[0] }}</strong></h2>
            <h4>Private Key: <strong>{{ data[1] }}</strong></h4>
            <b-button size="sm" @click="register">I have saved the data and I am ready to go!</b-button>
        </div>
    </b-container>
</template>

<script>
    import axios from 'axios';
    const data = [];
    const ok = [];
    export default {
      data () {
        return {
            ok: ok,
            data: data
        };
      },
      methods: {
          register: function () {
              var value = Math.floor(Math.random()*90000000)/100000000;
              axios.post('https://webtech-kashann.c9users.io/wallets', {
                address: data[0],
                privateKey: data[1],
                btc: value
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
              //redirect to login
              this.$router.push("auth");
          }
      },
      mounted(){
            axios.get('https://webtech-kashann.c9users.io/new').then(function(response){
                data.length = 0;
                data.push(response.data.address);
                data.push(response.data.privateKey);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    };
</script>