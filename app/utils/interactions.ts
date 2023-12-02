import { Contract } from "ethers";
import { IStatus } from "../utils";
import { shortenAccount } from "./utils";

export const swap = async (
  provider: any,
  amm: Contract,
  token: Contract,
  symbol: string,
  amount: string,
  setSwapStatus: (swapStatus: IStatus) => void
) => {
  setSwapStatus({ status: "INPROGRESS", transactionHash: undefined });
  try {
    const signer = await provider.getSigner();

    let transaction = await token.connect(signer).approve(amm?.address, amount);
    await transaction.wait();

    if (symbol === "DAPP") {
      transaction = await amm.connect(signer).swapToken1(amount);
    } else {
      transaction = await amm.connect(signer).swapToken2(amount);
    }
    await transaction.wait();

    setSwapStatus({
      status: "SUCCESS",
      transactionHash: shortenAccount(transaction.hash),
    });
  } catch (error) {
    setSwapStatus({ status: "ERROR", transactionHash: undefined });
    console.log("Error while swapping tokens. ", error);
  }
};

export const addLiquidity = async (
  provider: any,
  amm: Contract,
  tokens: Contract[],
  amounts: string[],
  setDepositStatus: (depositStatus: IStatus) => void
) => {
  setDepositStatus({ status: "INPROGRESS", transactionHash: undefined });
  try {
    const signer = await provider.getSigner();

    let transaction = await tokens[0]
      .connect(signer)
      .approve(amm?.address, amounts[0]);
    await transaction.wait();

    transaction = await tokens[1]
      .connect(signer)
      .approve(amm?.address, amounts[1]);
    await transaction.wait();

    transaction = await amm
      .connect(signer)
      .addLiquidity(amounts[0], amounts[1]);
    await transaction.wait();
    setDepositStatus({
      status: "SUCCESS",
      transactionHash: shortenAccount(transaction.hash),
    });
  } catch (error) {
    setDepositStatus({ status: "ERROR", transactionHash: undefined });
    console.log("Error while depositing tokens. ", error);
  }
};