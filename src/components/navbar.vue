<template>
    <div class="navbar">
        <ul>
            <li v-for="(link, index) in links" :key="index"><a :href="'/' + link.url">{{ link.name }}</a></li>
        </ul>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                links: [
                    {name: 'Home', id: 1, url: ''},
                    {name: 'Explorer', id: 2, url: 'explorer'},
                    {name: 'Wallets', id: 3, url: 'wallets'},
                    {name: 'My Wallet', id: 4, url: 'wallets/auth/'},
                    {name: 'New Wallet', id: 5, url: 'wallets/new'}
                ]
            };
        }
    };
</script>

<style scoped>
    ul{
        margin: auto;
    }
    li{
        list-style-type: none;
        margin: 20px;
        display: inline-block;
    }
</style>