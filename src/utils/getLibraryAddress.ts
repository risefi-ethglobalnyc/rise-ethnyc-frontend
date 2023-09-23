// import * as path from 'path'
// import {promises as fs} from 'fs'
// import fsPromises from 'fs/promises'

interface LibraryAddressesObject {
  Library: {
    [contractName: string]: string;
  };
}

export default async function getLibraryAddress(contractName: string) {
  // const addressesPath = path.join(`scripts/output/libraryAddresses.json`)
  // const addressesObject = JSON.parse((await fsPromises.readFile(addressesPath)).toString())

  const addresses = await import("../../public/output/libraryAddresses.json");
  // const addressesObject = JSON.parse(data.toString())
  const addressesObject: LibraryAddressesObject = {
    Library: addresses.Library,
  };

  const contractAddress = addressesObject.Library[contractName];

  return contractAddress;
}
