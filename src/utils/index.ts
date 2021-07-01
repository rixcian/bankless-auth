import * as ethUtil from "ethereumjs-util";

export const hashMessage = (msg: string) => {
  const buffer = Buffer.from(msg);
  const result = ethUtil.hashPersonalMessage(buffer);

  return ethUtil.bufferToHex(result);
}

export const recoverAddress = (hashedSignedMessage, hash) => {
  const sigParams = ethUtil.fromRpcSig(hashedSignedMessage);
  const hashBuffer = Buffer.from(hash.replace("0x", ""), "hex");
  const result = ethUtil.ecrecover(
    hashBuffer,
    sigParams.v,
    sigParams.r,
    sigParams.s
  );

  return ethUtil.bufferToHex(ethUtil.publicToAddress(result));
}