<template>
    <b-container>
        <h2>Transactions explorer</h2>
        <b-row id="details" style="border: 2px solid #333;">
            <b-col cols="3" md="2" lg="2">Hash:</b-col>
            <b-col cols="9" md="10" lg="10" style="font-size: 2vmin">{{ item[0].hash }}</b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Sender:</b-col>
            <b-col cols="9" md="10" lg="10"><a :href="'/wallets/' + item[0].sender">{{ item[0].sender }}</a></b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Reciever:</b-col>
            <b-col cols="9" md="10" lg="10"><a :href="'/wallets/' + item[0].reciever">{{ item[0].reciever }}</a></b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Transaction Amount:</b-col>
            <b-col cols="9" md="10" lg="10">฿{{ item[0].btc }}</b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">USD Value:</b-col>
            <b-col cols="9" md="10" lg="10">${{ value }}</b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Size:</b-col>
            <b-col cols="9" md="10" lg="10">{{ item[0].size }} bytes</b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Confirmations:</b-col>
            <b-col cols="9" md="10" lg="10">{{ item[0].confirmations }}</b-col>
        </b-row>
        <b-row id="details">
            <b-col cols="3" md="2" lg="2">Timestamp:</b-col>
            <b-col cols="9" md="10" lg="10">{{ (new Date(0 - item[0].timestamp)).toString() }}</b-col>
        </b-row>
        <br>
        <b-button size="sm" @click="ok.push(1)">Modify Hash</b-button>
        <div v-if="ok[0]===1">
          <br>
          <form :action="computedAction" method="POST" @submit="closeForm">
            <input type="text" id="hash" name="hash" placeholder="Hash" :value="item[0].hash"/>
            <input type="submit" value="Submit">
          </form>
        </div>
        <br><br>
    </b-container>
</template>

<script>
    import axios from 'axios';
    const price = [];
    const item = [];
    const ok = [];
    export default {
      data () {
        return {
            item: item,
            price: price,
            ok: ok
        };
      },
      methods: {
          closeForm: function () {
              ok[0] = 0;
          }
      },
      computed: {
        value: function () {
            var val = this.item[0].btc * this.price[0];
            return val.toFixed(2);
        },
        computedAction: function() {
           return 'https://webtech-kashann.c9users.io/transactions/' + item[0].hash + '?_method=PUT';
        }
      },
      mounted(){
            axios.get('https://webtech-kashann.c9users.io' + window.location.pathname).then(function(response){
                item.length = 0;
                response.data.forEach(function(child){
                    item.push(child);
                });
            })
            .catch(function(error) {
                console.log(error);
            });
            
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

<style>
    #details{
        background-color:lavender;
        border-left: 2px solid #333;
        border-right: 2px solid #333;
        border-bottom: 2px solid #333;
        font-size: 3vmin;
    }
    input[type=text], select {
        width: 55%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    input[type=submit] {
        width: 10%;
        background-color: #2693ba;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    input[type=submit]:hover {
        background-color: #0481af;
    }
</style>