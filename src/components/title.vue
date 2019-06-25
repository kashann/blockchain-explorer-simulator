<template>
    <div class="titlu">
        <h1>BLOCKCHAIN EXPLORER SIMULATOR (1BTC = ${{ price[0] }})</h1>
    </div>
</template>

<script>
    import axios from 'axios';
    const price = [];
    export default {
      data () {
        return {
            price: price
        };
      },
      mounted(){
            axios.get('https://api.coindesk.com/v1/bpi/currentprice/USD.json').then(function(response){
                var data = JSON.parse(JSON.stringify(response.data));
                price.length = 0;
                price.push(data.bpi.USD.rate_float);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    };
    
</script>