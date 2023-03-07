export const networks = [
  {
    chainId: 31337,
    name: "localhost",
    abi: "../../contracts/export/abi/localhost.json",
    rpc: "http://localhost:8545",
    reader: "http://localhost:4000/graphql",
  },
  {
    chainId: 80001,
    name: "polygon_mumbai",
    abi: "../../contracts/export/abi/polygon_mumbai.json",
    rpc: "https://matic-mumbai.chainstacklabs.com",
    explorer: "https://mumbai.polygonscan.com",
    reader: "https://echo.rollups.dev.cartesi.io/graphql",
  },
];
