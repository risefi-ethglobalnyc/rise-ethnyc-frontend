import snarkjs from "snarkjs";

export default async function generateProof() {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      a: [1, 0, 2, 5, 2],
      price: [159359, 159420, 159350, 159321, 159401],
      markpricetimes10: 1593466,
    },
    "../../../public/zk-snark/priceintegrity.wasm",
    "../../../public/zk-snark/priceintegrity_final.zkey",
  );

  const funcinput = await snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals,
  );
  // const funcinput = await snarkjs.zkesc(proof, publicSignals);
  //console.log("Proof: ");
  //console.log(JSON.stringify(proof, null, 1));
  console.log("Public Signals: ");
  console.log(funcinput);
  //const [_pA, _pB, _pC, _pubSignals] = funcinput;
  console.log(typeof funcinput);
  const vKey = await import("../../../public/zk-snark/verification_key.json");
  // const vKey = JSON.parse(fs.readFileSync("verification_key.json").toString());

  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }
}

generateProof();
