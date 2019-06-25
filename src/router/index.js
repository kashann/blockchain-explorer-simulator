import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import wallets from '@/components/wallets';
import walletsParam from '@/components/walletsParam';
import newWallet from '@/components/newWallet';
import transactions from '@/components/transactions';
import transactionsParam from '@/components/transactionsParam';
import auth from '@/components/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/wallets',
      name: 'wallets',
      component: wallets
    },
    {
      path: '/wallets/auth',
      name: 'auth',
      component: auth
    },
    {
      path: '/wallets/new',
      name: 'newWallet',
      component: newWallet
    },
    {
      path: '/wallets/:wid',
      name: 'walletsParam',
      component: walletsParam
    },
    {
      path: '/explorer',
      name: 'transactions',
      component: transactions
    },
    {
      path: '/explorer/:txid',
      name: 'transactionsParam',
      component: transactionsParam
    }
  ]
});