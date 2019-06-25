<template>
  <b-container fluid>
      <b-container class="bv-row">
        <h2>Wallet</h2>
        <b-row>
            <b-col cols="4" md="3" lg="3">Address:</b-col>
            <b-col cols="6" md="6" lg="6" style="font-size: 3vmin;">{{ item[0].address }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4" md="3" lg="3">Balance:</b-col>
            <b-col cols="6" md="6" lg="6" style="font-size: 4vmin;">฿{{ item[0].btc }}</b-col>
        </b-row>
        <b-row>
            <b-col cols="4" md="3" lg="3">USD Value:</b-col>
            <b-col cols="8" md="6" lg="6" style="font-size: 4vmin;">${{ value }}</b-col>
            <b-col cols="12" md="12" lg="3"><img :src="require('@/assets/qr.jpg')" style="width: 16vw;"/></b-col>
        </b-row>
        <b-button size="sm" v-if="auth[0]===1" @click="auth.push(1)">New Transaction</b-button>
        <div v-if="auth[1]===1">
          <form inline id="trForm" action="https://webtech-kashann.c9users.io/transactions" method="POST" @submit="checkTrans">
            <label for="reciever">Wallet Address:⠀</label>
            <input type="text" id="reciever" v-model="reciever" name="reciever" placeholder="Enter Recieving Address"/>
            <label for="btc">⠀BTC Amount:⠀</label>
            <input type="text" id="btc" v-model="btc" name="btc" placeholder="Enter Amount"/>
            <input type="hidden" id="hiddenAddress" name="sender" :value="item[0].address" />
            <input type="submit" value="Submit">
          </form>
        </div>
        <h4>{{ transactions.length }} Transactions:</h4><br>
      </b-container>
     <!--User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- none --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort direction" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortDirection" slot="append">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
              <option value="last">Last</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Main table element -->
    <b-table show-empty
             stacked="md"
             :items="transactions"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             @filtered="onFiltered">
      <template slot="timestamp" slot-scope="row">{{ (new Date(0 - row.value)).toString() }}</template>
      <template slot="actions" slot-scope="row">
        <b-button size="sm" :to="{name: 'transactionsParam', params: {txid: row.item.hash}}" class="mr-1">See more</b-button>
      </template>
    </b-table>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
    <b-button size="sm" v-if="auth[0]===1" @click="deleteWallet()">Delete Wallet</b-button>
  </b-container>
</template>

<script>
    import axios from 'axios';
    const price = [];
    const item = [];
    const transactions = [];
    const auth = [];
    export default {
      data () {
        return {
            auth: auth,
            item: item,
            price: price,
            transactions: transactions,
            fields: [
                { key: 'sender', label: 'Sender', sortable: true, sortDirection: 'asc' },
                { key: 'reciever', label: 'Reciever', sortable: true, sortDirection: 'asc' },
                { key: 'btc', label: 'BTC Amount', sortable: true, 'class': 'text-center' },
                { key: 'timestamp', label: 'Date', sortable: true, sortDirection: 'asc' },
                { key: 'actions', label: 'Actions' }
            ],
            currentPage: 1,
            perPage: 5,
            totalRows: transactions.length,
            pageOptions: [ 5, 10, 20 ],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null
        };
      },
      computed: {
        value: function () {
            var val = this.item[0].btc * this.price[0];
            return val.toFixed(2);
        },
        sortOptions () {
          // Create an options list from our fields
          return this.fields
            .filter(f => f.sortable)
            .map(f => { return { text: f.label, value: f.key }; });
        }
      },
      methods: {
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.totalRows = filteredItems.length;
          this.currentPage = 1;
        },
        deleteWallet () {
          alert("Are you SURE you want to DELETE your wallet?");
          alert("You will LOSE all your funds!");
          alert("This is it! There is NO going back from here");
          axios.delete('https://webtech-kashann.c9users.io/wallets/' + item[0].address);
          alert("Wallet deleted!");
        },
        split (str) {
          var i = str.indexOf("-");
          if(i > 0)
            return  str.slice(0, i);
          else
            return str;  
        },
        getAuthKey (str) {
          var i = str.indexOf("-");
          if(i > 0)
            return  str.slice(i);
          else
            return str;  
        },
        checkTrans: function(e) {  
          if (this.btc && this.reciever) {
            var amount = parseFloat(this.btc);
            if(amount < item[0].btc){
              console.log("Sufficient funds");
              return true;
            }
            else{
              alert("Unsufficient funds!"); 
              e.preventDefault();
              return false;
            }
          }
          else {
            alert("Complete the form!");
            return false;
          }
        }
      },
      mounted(){
            axios.get('https://webtech-kashann.c9users.io/auth/' + this.getAuthKey(window.location.pathname)).then(function(response){
                auth.length = 0;
                var data = JSON.parse(JSON.stringify(response.data));
                if(data.auth === 1){
                  auth.push(1);
                }
                else{
                  if(data.ago === -1)
                    alert('Authentication required!');
                  else if(data.ago < 60)
                    alert('Authentication expired ' + data.ago + ' minutes ago');
                  else if(data.ago < 60*24)
                    alert('Authentication expired more than an hour ago' + data.ago);
                  else
                    alert('Authentication expired more than a day ago-' + data.ago);
                }
            })
            .catch(function(error) {
                console.log(error);
            });
            
            axios.get('https://webtech-kashann.c9users.io' + this.split(window.location.pathname)).then(function(response){
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
            
            axios.get('https://webtech-kashann.c9users.io' + this.split(window.location.pathname) + '/transactions').then(function(response){
                transactions.length = 0;
                response.data.forEach(function(child){
                    transactions.push(child);
                });
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    };
</script>

<style>
  input[type=text], select {
    width: 32%;
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