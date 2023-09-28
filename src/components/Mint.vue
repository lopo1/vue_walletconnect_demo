<script setup>
import { ref } from 'vue'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
defineProps({
  msg: String,
})

let walletConnector = null;
let web3 = null;
const connectWallet =  async ()=>{
    try {
      walletConnector = new WalletConnectProvider({
        infuraId: "df3af6e2414b4c23a7b33864d17baa88" // 替换为你自己的 Infura 项目 ID
      });

      await walletConnector.enable();

      // 创建一个新的 Web3 实例
      web3 = new Web3(walletConnector);

      // 监听断开连接事件，以便在用户手动断开连接时清理资源
      walletConnector.on("disconnect", () => {
        web3 = null;
        walletConnector = null;
      });

      // 连接成功后，你可以执行其他操作，例如获取用户账户地址等
      const accounts = await web3.eth.getAccounts();
      console.log("Connected with address:", accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }
  const disconnectWallet =  async ()=>{
    if (walletConnector) {
      walletConnector.close();
    }
  }
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button @click="connectWallet">Connect Wallet</button>
    <button @click="disconnectWallet">Disconnect Wallet</button>
    <p>
      Edit
      <code>components/Mint.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
