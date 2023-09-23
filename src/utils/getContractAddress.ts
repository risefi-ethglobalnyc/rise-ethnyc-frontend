// import * as path from 'path'
// import {promises as fs} from 'fs'
// import fsPromises from 'fs/promises'

import { Network } from "./network";

interface ContractAddressesObject {
  [network: string]: {
    [contractName: string]: string;
  };
}

export default async function getContractAddress(
  contractName: string,
  network: Network,
) {
  // const addressesPath = path.join(`scripts/output/contractAddresses.json`)
  // const addressesObject = JSON.parse(await fsPromises.readFile(addressesPath).toString())

  const addresses = await import("../../public/output/contractAddresses.json");
  const addressesObject: ContractAddressesObject = {
    L2: addresses.L2,
    L3: addresses.L3,
  };
  const contractAddress = addressesObject[network][contractName];
  // const contractAddress = addressesObject[network][contractName]
  // use network, contractName as key for addressesObject JSON
  // const contractAddress = addressesObject[network][contractName]

  return contractAddress;
}
