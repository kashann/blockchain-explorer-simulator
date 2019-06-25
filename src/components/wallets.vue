<template>
  <b-container fluid>
      <h2>Wallets explorer</h2>
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
             :items="items"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             @filtered="onFiltered">
      <template slot="actions" slot-scope="row">
        <b-button size="sm" :to="{name: 'walletsParam', params: {wid: row.item.address}}" class="mr-1">Open wallet</b-button>
      </template>
    </b-table>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
    import axios from 'axios';
    const items = [];
    export default {
      data () {
        return {
          items: items,
          fields: [
            { key: 'address', label: 'Public Address', sortable: true, sortDirection: 'asc' },
            { key: 'btc', label: 'BTC Amount', sortable: true, 'class': 'text-center' },
            { key: 'actions', label: 'Actions' }
          ],
          currentPage: 1,
          perPage: 5,
          totalRows: items.length,
          pageOptions: [ 5, 15, 30 ],
          sortBy: null,
          sortDesc: false,
          sortDirection: 'asc',
          filter: null
        };
      },
      computed: {
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
        }
      },
      mounted(){
            axios.get('https://webtech-kashann.c9users.io/wallets').then(function(response){
                items.length = 0;
                response.data.forEach(function(child){
                    items.push(child);
                });
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    };
</script>