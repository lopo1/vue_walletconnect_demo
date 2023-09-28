<script setup>
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig,disconnect,getNetwork } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'
import { getAccount, getContract } from '@wagmi/core'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ref, reactive } from 'vue';

const chains = [mainnet,arbitrum,  polygon]
const projectId = '38d62272a06b73b1f9aab563e46185ae'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)

defineProps({
  msg: String,
})


let account = ref(getAccount());
const connectWallet =  async ()=>{
    await web3modal.openModal();
    // account = getAccount();
    // accounts = getAccount();
    // console.log(getAccount());
  }
  const disconnectWallet =  async ()=>{
    // getAccount().
    await disconnect();
    account = ref(getAccount());
    location.reload();
    // web3modal.closeModal();
  }
  const getAccounts =  async ()=>{
    account = await getAccount();
    console.log(getAccount());
    location.reload();
  }
  web3modal.subscribeModal(({open})=>{
    const account1 = getAccount()
    // if (account1.isConnected){
    //     location.reload();
    // }
  });

  web3modal.subscribeModal(({disconnect})=>{
    const account1 = getAccount()
    console.log("end");
    console.log("disconnect =",disconnect);
    // if (account1.isConnected){
    //     location.reload();
    // }
  });
  web3modal.subscribeEvents(event => {
    console.log(event, 'evnt')
    if (event.name === 'ACCOUNT_CONNECTED') {
      console.log("onConnectSuccessCallback");
      account = getAccount()
      location.reload();
      // onConnectSuccessCallback()
    }
    if (event.name === 'ACCOUNT_DISCONNECTED') {
      account = getAccount()
      console.log("onDisconnectCallback");
      location.reload();
    }
  });

  const walletConnectSendTransaction = async ()=>{
    console.log("account =",account);
    // const provider = await web3Modal.connect()
    console.log("getNetwork =",getNetwork());
    // console.log("chains =",chains);
    // console.log("publicClient =",publicClient(chainId=>{
    //   console.log("chainId", chainId);
    // }));
    // let client = publicClient(chainId=>{});
    // console.log("client", client);
    // console.log("chain", client.chain);
    // console.log("chainId", client.chain.id);
    // console.log("ethereumClient =",ethereumClient);
    // console.log("w3mProvider =",w3mProvider);
    // console.log("Web3Modal =",Web3Modal);
    // const nonce = await util.requestWeb3(ac, 'getTransactionCount', account.address)
    // console.log("nonce =",nonce);
  }
</script>

<template>
  <h1>{{ msg }}</h1>
  <h6>{{ account.address }}</h6>

  <div class="card">
    <button @click="connectWallet">Connect Wallet web3</button>
    <button @click="disconnectWallet">Disconnect Wallet</button>
    <button @click="getAccounts">get account</button>
    <button @click="walletConnectSendTransaction">walletConnectSendTransaction</button>
    
  </div>

  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
