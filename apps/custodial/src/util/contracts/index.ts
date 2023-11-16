// import configs from "./contractConfigs";
// import { Contract } from "web3-eth-contract";
// import env from "../constants/env";
//
// const contracts = {};
// Contract.setProvider(env.web3Provider);
//
// configs.map(config => {
//   let abi;
//   try {
//     abi = require(`abi/${config.name.toLowerCase()}.json`)
//   } catch (e) {
//     abi = require(`abi/erc20.json.json`)
//   }
//   contracts[config.name] = new Contract(abi, config.address);
// });
//
// export default contracts;
