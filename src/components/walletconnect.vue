<script setup>
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig,disconnect,getNetwork } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'
import { getAccount, getContract } from '@wagmi/core'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'
import { ref, reactive,watch } from 'vue';

const chains = [mainnet,arbitrum,  polygon]
const chains1 = [11155111]
const projectId = '85cd042efdd7139347fe2f4b6da3c8bc'

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
  item: Object ,
})


let account = ref(getAccount());
let senderAddress = ref('');
let ethereumProvider = undefined;
let WalletProvider = undefined;
const connectWallet =  async ()=>{
    // await web3modal.openModal();
    try{
        if(!ethereumProvider){
            ethereumProvider = await EthereumProvider.init({
                projectId: projectId,
                chains: chains1,
                showQrModal: true,
                methods: ["eth_sendTransaction", "personal_sign"],
                events: ["chainChanged", "accountsChanged"],
            });
           
            // console.log("ethereumProvider:",ethereumProvider);
            ethereumProvider.on("connect", () =>
                {
                    console.info(ethereumProvider.accounts);
                    account.address = ethereumProvider.accounts[0];
                    senderAddress.value = ethereumProvider.accounts[0];
                }
            );
            ethereumProvider.on('disconnect', ()=>{
              console.log("Disconnect");
                account.address ="";
                senderAddress.value ="";
                alert("连接断开")
            })

            ethereumProvider.on('session_request', (event)=>{
                alert("event",event)
            })
            ethereumProvider.on('session_event', (event)=>{
                alert("session_event ",event)
            })

            ethereumProvider.on('session_request', (event)=>{
              console.info("session_request",event)
            })
            ethereumProvider.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }
                // Get updated accounts and chainId
                const {accounts, chainId} = payload.params[0];
            });
            ethereumProvider.on('session_update', (event)=>{
              console.info("session_update",event)
            })
            ethereumProvider.on('accountsChanged', (event)=>{
              console.info("accountsChanged",event)
            })
            // ethereumClient.rejectSession
            
        }
        // console.log("ethereumProvider:",ethereumProvider);
        ethereumProvider.connect();
        // ethers
        WalletProvider = new ethers.BrowserProvider(ethereumProvider)
    }catch(error){
        console.error(error);
    }  
  }
  const disconnectWallet =  async ()=>{
    // ethereumProvider.disconnect()
    // console.log("ethereumProvider = ",ethereumProvider);
    ethereumProvider.disconnect();
    
    if (!account.isConnected){
      console.log("Disconnect account");
    }
    // location.reload();
    // web3modal.closeModal();
  }
  const getAccounts =  async ()=>{
    const accounts =  await WalletProvider.send("eth_requestAccounts", []);
    console.log("accounts = ",accounts);
    // 读取chainid
    const { chainId } = await WalletProvider.getNetwork()
    console.log(`chainid: ${chainId}`)
    const signer = await WalletProvider.getSigner()
    const balance = await WalletProvider.getBalance(signer.getAddress());
    console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)
    const blockNum = await WalletProvider.getBlockNumber()
    console.log(`区块高度: ${blockNum}`)
    
    // account.address = accounts[0];
    // location.reload();
    // alert(accounts);
  }
  

  


  const walletConnectSendTransaction = async ()=>{
    const abiERC20 = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint)",
        "function transfer(address,uint256) external returns (bool)",
    ];
    const signer = await WalletProvider.getSigner()
    const addressUSDT = '0x16c975455d5f95952cD342Bed75e5014dD3aED19';
    const contractUSDT = new ethers.Contract(addressUSDT, abiERC20, signer);
    const totalSupply = await contractUSDT.totalSupply();
    contractUSDT.transfer("0x549AdF13B93fd60E692A56f5C494cf71FE1E99aA",100);
    console.log("totalSupply = ",totalSupply);
    const abi = new ethers.Interface(abiERC20);
    const functionData = abi.encodeFunctionData('balanceOf',['0x6B175474E89094C44Da98b954EedeAC495271d0F']);
    const tx = {
        to: addressUSDT,
        data: functionData  // 上面编码出来的data
    }
    const response = await signer.call(tx);
    console.log("response ",response);
  }

  watch(account, (account) => {
  console.log(account);
  props.item.address = account.address;
});
</script>

<template>
  <h1>{{ msg }}</h1>
  <h6>{{ account.address }}</h6>
  <h6>{{ senderAddress }}</h6>

  <div class="card">
    <button @click="connectWallet">Connect Wallet ethers</button>
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
