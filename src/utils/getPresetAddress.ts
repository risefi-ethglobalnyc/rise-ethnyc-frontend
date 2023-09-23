// import * as path from 'path'
// import fsPromises from 'fs/promises'

interface PresetAddressesObject {
  [presetName: string]: string;
}

export default async function getPresetAddress(name: string) {
  // const addressesPath = path.join(`scripts/input/presetAddresses.json`)
  // const addressesObject = JSON.parse((await fsPromises.readFile(addressesPath)).toString())

  const addresses = await import("../../public/input/presetAddresses.json");
  // const addressesObject = JSON.parse(addresses.toString())
  const addressesObject: PresetAddressesObject = {
    deployer: addresses.deployer,
    keeper: addresses.keeper,
    Inbox: addresses.Inbox,
    IOutbox: addresses.IOutbox,
    Bridge: addresses.Bridge,
    NodeInterface: addresses.NodeInterface,
    ArbSys: addresses.ArbSys,
    WETH: addresses.WETH,
  };

  return addressesObject[name];
}
