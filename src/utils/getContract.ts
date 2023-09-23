import { ethers } from "ethers";
// import * as path from 'path'
// import {promises as fs} from 'fs'
// import fsPromises from 'fs/promises'

import getContractAddress from "./getContractAddress";
import getLibraryAddress from "./getLibraryAddress";
import getPresetAddress from "./getPresetAddress";
import { Network, RpcUrl } from "./network";

export async function getContract(
  domainPath: string,
  contractName: string,
  network: Network,
  isPresetAddress?: boolean,
  pk?: string,
) {
  const { provider, contractAbi, contractAddress } = await getContractBase(
    domainPath,
    contractName,
    network,
    isPresetAddress,
  );

  let wallet;
  if (!pk) {
    const privateKey = process.env.NEXT_PUBLIC_DEPLOY_PRIVATE_KEY as string;
    wallet = new ethers.Wallet(privateKey, provider);
  } else {
    wallet = new ethers.Wallet(pk, provider);
  }
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

  return contract;
}

export async function getReadOnlyContract(
  domainPath: string,
  contractName: string,
  network: Network,
  isPresetAddress?: boolean,
) {
  const { provider, contractAbi, contractAddress } = await getContractBase(
    domainPath,
    contractName,
    network,
    isPresetAddress,
  );

  const contract = new ethers.Contract(contractAddress, contractAbi, provider);

  return contract;
}

export async function getLibrary(
  domainPath: string,
  contractName: string,
  network: Network,
  pk?: string,
) {
  const { provider, contractAbi, libraryAddress } = await getLibraryBase(
    domainPath,
    contractName,
    network,
  );

  let wallet;
  if (!pk) {
    const privateKey = process.env.NEXT_PUBLIC_DEPLOY_PRIVATE_KEY as string;
    wallet = new ethers.Wallet(privateKey, provider);
  } else {
    wallet = new ethers.Wallet(pk, provider);
  }
  const contract = new ethers.Contract(libraryAddress, contractAbi, wallet);

  return contract;
}

export async function getContractBase(
  domainPath: string,
  contractName: string,
  network: Network,
  isPresetAddress?: boolean,
) {
  let provider;

  if (network === Network.L2) {
    provider = new ethers.providers.JsonRpcProvider(RpcUrl.L2);
  } else if (network === Network.L3) {
    provider = new ethers.providers.JsonRpcProvider(RpcUrl.L3);
  } else {
    throw new Error("Invalid network");
  }

  // const contractAbiPath = path.join(`artifacts/contracts/${domainPath}/${contractName}.sol/${contractName}.json`)
  // const contractAbiObject = JSON.parse((await fsPromises.readFile(contractAbiPath)).toString())

  const contractAbiObject = await import(
    `../../artifacts/contracts/${domainPath}/${contractName}.sol/${contractName}.json`
  );
  const contractAbi = contractAbiObject.abi;

  let contractAddress;

  if (isPresetAddress) {
    contractAddress = await getPresetAddress(contractName);
  } else {
    contractAddress = await getContractAddress(contractName, network);
  }

  return {
    provider,
    contractAbi,
    contractAddress,
  };
}

async function getLibraryBase(
  domainPath: string,
  contractName: string,
  network: Network,
) {
  let provider;

  if (network === Network.L2) {
    provider = new ethers.providers.JsonRpcProvider(RpcUrl.L2);
  } else if (network === Network.L3) {
    provider = new ethers.providers.JsonRpcProvider(RpcUrl.L3);
  } else {
    throw new Error("Invalid network");
  }

  // const contractAbiPath = path.join(`artifacts/contracts/${domainPath}/${contractName}.sol/${contractName}.json`)
  // const contractAbiObject = JSON.parse((await fsPromises.readFile(contractAbiPath)).toString())
  const contractAbiObject = await import(
    `../../artifacts/contracts/${domainPath}/${contractName}.sol/${contractName}.json`
  );
  const contractAbi = contractAbiObject.abi;

  const libraryAddress = await getLibraryAddress(contractName);

  return {
    provider,
    contractAbi,
    libraryAddress,
  };
}
