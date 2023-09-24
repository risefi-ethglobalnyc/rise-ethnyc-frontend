import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  openPositionState,
  orderHistoryState,
  positionHistoryState,
  traderBalanceState,
  traderAddressShortState,
} from "@/states/atoms";
import { ethers } from "ethers";
import { Slider, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { formatUsdString } from "@/utils/formatter";

import FaucetModal from "./FaucetModal";
import SetLeverageModal from "./SetLeverageModal";

import _setIndexPrice from "@/rpc/l3/_setIndexPrice";
import _depositMargin from "@/rpc/l3/_depositMargin";
import { placeMarketOrder } from "@/rpc/l3/placeMarketOrder";

import { getOrderHistoryFormatted } from "@/utils/getOrderHistory";
import getPositionRecordsFormatted from "@/rpc/l3/getPositionRecord";
import getOIStatus from "@/rpc/l3/getOIStatus";
import getPriceBuffer from "@/rpc/l3/getPriceBuffer";
import getTraderBalanceFormatted from "@/rpc/l3/getTraderBalance";
import getOpenPositionFormatted from "@/rpc/l3/getOpenPosition";

function _validateOrderAmount(size: string, margin: string) {
  if (size === "" || margin === "") {
    return false;
  }
  if (+size <= 0 || +margin <= 0) {
    return false;
  }
  return true;
}

export default function OrderPanel(props: {
  wsPrice: React.MutableRefObject<number>;
  markPrice: React.MutableRefObject<number>;
  totalPnL: number;
}) {
  const { wsPrice, markPrice, totalPnL } = props;
  const traderBalance = useRecoilValue(traderBalanceState);

  const [traderAddressExists, setTraderAddressExists] = useState(false);
  const [marginSizeInUsdc, setMarginSizeInUsdc] = useState("");
  const [marginInput, setMarginInput] = useState("");
  const [marginInputPlaceHolder, setMarginInputPlaceHolder] =
    useState("Margin Size");
  const [marginPortion, setMarginPortion] = useState(0);
  // const [depositAmount, setDepositAmount] = useState<number | ''>(50000);
  const [leverage, setLeverage] = useState(25);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [openSetLeverageModal, setOpenSetLeverageModal] = useState(false);

  // Recoil States
  const setOpenPosition = useSetRecoilState(openPositionState);
  const setOrderHistory = useSetRecoilState(orderHistoryState);
  const setPositionHistory = useSetRecoilState(positionHistoryState);
  const setTraderBalance = useSetRecoilState(traderBalanceState);
  const setTraderAddressShort = useSetRecoilState(traderAddressShortState);

  // Modal control
  const [openFaucetModal, setOpenFaucetModal] = useState(false);

  const baseTokenSymbol = "ETH";

  useEffect(() => {
    const traderAddress = localStorage.getItem("traderAddress") as string;
    if (traderAddress) {
      setTraderAddressExists(true);
    }
  }, []);

  useEffect(() => {
    setMarginSizeInUsdc("");
    setMarginInput("");
    setMarginPortion(0);
    setMarginInputPlaceHolder("Margin Size");
  }, [leverage]);

  let traderAddress = "";
  let xyz = "";

  // SSR
  if (typeof window !== "undefined") {
    traderAddress = localStorage.getItem("traderAddress") as string;
    xyz = localStorage.getItem("xyz") as string;
  }

  const createNewAccount = async () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem("xyz", wallet.privateKey);
    localStorage.setItem("traderAddress", wallet.address);

    // send 0.005 ETH to the new account
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.risefinance.io",
    );
    const adminPK = process.env.NEXT_PUBLIC_DEPLOY_PRIVATE_KEY as string;
    const adminWallet = new ethers.Wallet(adminPK, provider);
    const tx = await adminWallet.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("0.005"),
    });
    await tx.wait();
    setTraderAddressExists(true);

    setTraderAddressShort(
      `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
    );

    notifications.show({
      id: "new-account",
      title: "Test Account Created",
      message: `new test account created`,
      icon: <IconCheck className="h-6 w-6 text-gray-100" aria-hidden="true" />,
      autoClose: 1500,
    });

    // deposit 50000 USDC to the new account (faucet modal)
    setOpenFaucetModal(true);
  };

  const submitMarketOrder = async (isBuy: boolean, reduceOnly: boolean) => {
    // increase order for long/short
    try {
      const isLong = reduceOnly ? !isBuy : isBuy;
      const isIncrease = !reduceOnly;
      const sideString = isLong ? "Buy" : "Sell";
      const sizeInTokens = (+marginSizeInUsdc * leverage) / +markPrice.current;
      const sizeParam = sizeInTokens.toString();
      const marginParam = marginSizeInUsdc.toString();

      if (!traderAddress || !xyz) {
        return;
      }

      if (!_validateOrderAmount(sizeParam, marginParam)) {
        throw new Error("Invalid order amount");
      }
      notifications.show({
        id: "order-submission",
        title: "Order Submitted",
        message: `${sideString} ${(+sizeInTokens).toFixed(
          2,
        )}${baseTokenSymbol}`,
        loading: true,
        autoClose: false,
      });
      console.log(">>> index price: ", wsPrice.current.toString());
      console.log(">>> checkpoint 0");
      const setPriceTx = await _setIndexPrice(xyz, wsPrice.current.toString());
      console.log(">>> checkpoint 3");
      await setPriceTx.wait();

      // TODO: Generate ZK proof for the data integrity (Asynchronously)
      console.log(">>> price set.");

      const tx = await placeMarketOrder(
        xyz,
        traderAddress,
        sizeParam, // sizeAbs
        marginParam, // marginAbs
        isLong,
        isIncrease,
      );
      console.log(">>> tx: ", tx);

      const result2 = await tx.wait();
      console.log(">>> placeCloseMarketOrder('long') called: ", result2);

      // update recoil states
      const getOpenPositionsFormatted = async () => {
        if (!traderAddress || !xyz) {
          return;
        }
        const marketId = 1;

        let totalPnL = 0;
        let totalMargin = 0;
        // TODO; iteration for all markets
        // long
        let longOpenPositionsFormatted = await getOpenPositionFormatted(
          xyz,
          traderAddress,
          true,
          marketId,
          +markPrice.current,
        );
        if (+longOpenPositionsFormatted[0].size <= 0) {
          // FIXME: select proper market from the list, not the first one
          longOpenPositionsFormatted = [];
        }

        // short
        let shortOpenPositionsFormatted = await getOpenPositionFormatted(
          xyz,
          traderAddress,
          false,
          marketId,
          +markPrice.current,
        );
        if (+shortOpenPositionsFormatted[0].size <= 0) {
          shortOpenPositionsFormatted = [];
        }

        const openPositionsFormatted = longOpenPositionsFormatted.concat(
          shortOpenPositionsFormatted,
        );
        for (let i = 0; i < openPositionsFormatted.length; i += 1) {
          const position = openPositionsFormatted[i];
          const { pnl, margin } = position;
          pnl ? (totalPnL += +pnl) : (totalPnL += 0);
          margin ? (totalMargin += +margin) : (totalMargin += 0);
        }
        setOpenPosition(openPositionsFormatted); // recoil

        // setOpenPositionsCount(openPositionsFormatted.length);
        // setTotalPnL(totalPnL);
        // setTotalActiveMargin(totalMargin);
      };
      getOpenPositionsFormatted();

      notifications.update({
        id: "order-submission",
        withCloseButton: true,
        title: `Order Placed`,
        message: `${sideString} ${(+sizeInTokens).toFixed(
          2,
        )}${baseTokenSymbol}`,
        icon: (
          <IconCheck className="h-6 w-6 text-gray-100" aria-hidden="true" />
        ),
        autoClose: 1500,
      });

      // getTraderBalanceFormatted(traderAddress).then((traderBalance) => {
      //   setTraderBalance(traderBalance);
      // });

      // getOIStatus().then((oiStatus) => {
      //   const [globalLongOI, globalShortOI] = oiStatus;
      //   setGlobalLongOI(+globalLongOI);
      //   setGlobalShortOI(+globalShortOI);
      // });

      // getOrderHistoryFormatted().then((orderHistoryFormatted) => {
      //   setOrderHistory(orderHistoryFormatted);
      // });

      // getPositionRecordsFormatted().then((positionRecordsFormatted) => {
      //   setPositionHistory(positionRecordsFormatted);
      // });

      // getPriceBuffer().then((priceBuffer) => {
      //   setPriceBuffer(+priceBuffer);
      // });
    } catch (e) {
      notifications.show({
        id: "order-submission",
        title: "Order Failed",
        message: `${e}`,
        // icon: <IconX size="1rem" />,
        icon: <IconX className="h-6 w-6 text-gray-100" aria-hidden="true" />,
        color: "red",
        autoClose: 1500,
      });
    }
  };

  const handleReduceOnlyCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setReduceOnly(event.target.checked);
  };

  return (
    <div className="overflow-hidden h-auto bg-gray-900 shadow resize-y rounded-lg ">
      {/* <div className="overflow-hidden h-3/4 bg-gray-800 shadow hover:bg-gray-600"> */}
      <FaucetModal
        openFaucetModal={openFaucetModal}
        setOpenFaucetModal={setOpenFaucetModal}
        xyz={xyz}
        traderAddress={traderAddress}
      />
      <SetLeverageModal
        openSetLeverageModal={openSetLeverageModal}
        setOpenSetLeverageModal={setOpenSetLeverageModal}
        leverage={leverage}
        setLeverage={setLeverage}
      />
      <div className="flex mt-2 justify-center mx-2 gap-x-1">
        <button
          type="button"
          className="rounded w-1/2  bg-white/10 py-1 text-xs font-normal text-white shadow-sm hover:bg-white/20 active:bg-white/5"
          onClick={() => {
            notifications.show({
              id: "isolated mode",
              title: "Cross Mode Only",
              message: `Only Cross Mode is Supported Now`,
              color: "dark",
              // icon: (
              //   <IconCheck
              //     className="h-6 w-6 text-gray-100"
              //     aria-hidden="true"
              //   />
              // ),
              autoClose: 1500,
            });
          }}
        >
          Cross
        </button>
        <button
          type="button"
          className="rounded w-1/2 bg-white/10 py-3/4 text-xs font-normal text-white shadow-sm hover:bg-white/20 active:bg-white/5"
          onClick={() => setOpenSetLeverageModal(true)}
        >
          {leverage}x
        </button>
      </div>
      <div className="mt-4 sm:mt-10">
        <SizeInputForm
          marginInput={marginInput}
          setMarginInput={setMarginInput}
          marginInputPlaceHolder={marginInputPlaceHolder}
          setMarginInputPlaceHolder={setMarginInputPlaceHolder}
          leverage={leverage}
          setMarginPortion={setMarginPortion}
          marginSizeInUsdc={marginSizeInUsdc}
          setMarginSizeInUsdc={setMarginSizeInUsdc}
          marginBalance={traderBalance}
          totalPnL={totalPnL}
        />
      </div>
      <div className="mt-6">
        <MarginPortionSlider
          leverage={leverage}
          marginBalance={traderBalance}
          marginPortion={marginPortion}
          setMarginPortion={setMarginPortion}
          setMarginSizeInUsdc={setMarginSizeInUsdc}
          marginInput={marginInput}
          setMarginInput={setMarginInput}
          setMarginInputPlaceHolder={setMarginInputPlaceHolder}
        />
      </div>
      {/* FIXME: TP/SL impl. */}
      {/* <Checkbox
        description="TP/SL"
        checkedState={reduceOnly}
        stateHandler={handleReduceOnlyCheckboxChange}
      /> */}
      <div className="mt-8 ml-2 sm:ml-0 sm:mt-10">
        <Checkbox
          description="Reduce-Only"
          checkedState={reduceOnly}
          stateHandler={handleReduceOnlyCheckboxChange}
        />
      </div>

      <div className="mt-0 sm:my-10">
        {traderAddressExists ? (
          <div className="flex justify-center mx-2 mt-6 sm:mt-10 gap-x-1.5">
            <BuyButton
              submitMarketOrder={submitMarketOrder}
              reduceOnly={reduceOnly}
            />
            <SellButton
              submitMarketOrder={submitMarketOrder}
              reduceOnly={reduceOnly}
            />
          </div>
        ) : (
          <div className="flex justify-center mx-2 gap-x-1">
            <CreateNewAccountButton createNewAccount={createNewAccount} />
          </div>
        )}
      </div>
    </div>
  );
}

function SizeInputForm(props: {
  marginInput: string;
  setMarginInput: React.Dispatch<React.SetStateAction<string>>;
  marginInputPlaceHolder: string;
  setMarginInputPlaceHolder: React.Dispatch<React.SetStateAction<string>>;
  leverage: number;
  setMarginPortion: React.Dispatch<React.SetStateAction<number>>;
  marginSizeInUsdc: string;
  setMarginSizeInUsdc: React.Dispatch<React.SetStateAction<string>>;
  marginBalance: number | string;
  totalPnL: number;
}) {
  const {
    marginInput,
    setMarginInput,
    marginInputPlaceHolder,
    setMarginInputPlaceHolder,
    leverage,
    setMarginPortion,
    marginSizeInUsdc,
    setMarginSizeInUsdc,
    marginBalance,
    totalPnL,
  } = props;

  // const [inputValue, setInputValue] = useState('');
  // const [prevValidValue, setPrevValidValue] = useState('0');

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    const isValid = /^(\d*\.?\d{0,1}|\.\d+)$/.test(value);

    if (isValid || value === "") {
      setMarginInputPlaceHolder("Margin Size");
      setMarginPortion(0);
      setMarginInput(value);
      setMarginSizeInUsdc(value);
      // setPrevValidValue(value);
      // setError('');
    }
    // else {
    // setError(
    // 'Please enter a valid positive number with up to one decimal place.',
    // );
    // console.log('>>> ERROR');
    // setMarginSizeInUsdc(prevValidValue);
    // }

    // setMarginSizeInUsdc(value);
  };
  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div className="grow">
            <label
              htmlFor="size"
              className="block mx-2 text-xs font-medium leading-6 text-gray-400"
            >
              Avbl. Margin {formatUsdString(+marginBalance + +totalPnL, 1)}
            </label>
          </div>
          <div className="grow text-right">
            <label
              htmlFor="size"
              className="block mx-2 text-xs font-medium leading-6 text-gray-400"
            >
              Size {formatUsdString(+marginSizeInUsdc, 1)} USDC
            </label>
          </div>
        </div>
        <div className="relative mx-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="text"
            name="size"
            id="size"
            value={marginInput}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 bg-white/10 text-gray-200  placeholder:text-gray-500 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
            placeholder={marginInputPlaceHolder}
            autoComplete="off"
            onChange={handleInputChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              id="currency"
              name="currency"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-100 focus:ring-0  sm:text-sm"
            >
              <option>USDC</option>
              <option>ETH</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarginPortionSlider(props: {
  leverage: number;
  marginBalance: number | string;
  marginPortion: number;
  setMarginPortion: React.Dispatch<React.SetStateAction<number>>;
  setMarginSizeInUsdc: React.Dispatch<React.SetStateAction<string>>;
  marginInput: string;
  setMarginInput: React.Dispatch<React.SetStateAction<string>>;
  setMarginInputPlaceHolder: React.Dispatch<React.SetStateAction<string>>;
}) {
  const {
    leverage,
    marginBalance,
    marginPortion,
    setMarginPortion,
    setMarginSizeInUsdc,
    marginInput,
    setMarginInput,
    setMarginInputPlaceHolder,
  } = props;

  const handleValueChange = (value: number) => {
    setMarginInput("");
    setMarginInputPlaceHolder(`${value}%`);
    setMarginPortion(value);
    setMarginSizeInUsdc(((+value * +marginBalance) / 100).toString());
  };

  return (
    <div className="mx-2 my-5">
      <Slider
        color="gray"
        label={marginPortion}
        value={marginPortion}
        onChange={handleValueChange}
        radius={"sm"}
        labelTransition="fade"
        size={5}
        defaultValue={25}
        min={0}
        max={100}
        marks={[
          { value: 0, label: "" },
          { value: 25, label: "25%" },
          { value: 50, label: "50%" },
          { value: 75, label: "75%" },
          { value: 100, label: "100%" },
        ]}
        styles={(theme) => ({
          track: {
            backgroundColor: theme.colors.dark[3],
          },
          mark: {
            // width: rem(6),
            // height: rem(6),
            borderRadius: rem(6),
            borderColor: theme.colors.dark[3],
          },
          markFilled: {
            borderColor: theme.colors.dark[3],
          },
          markLabel: {
            fontSize: theme.fontSizes.xs,
            marginBottom: rem(5),
            marginTop: 0,
          },
          thumb: {
            // height: rem(16),
            // width: rem(16),
            backgroundColor: theme.colors.dark[5],
            borderWidth: rem(1),
          },
        })}
      />
    </div>
  );
}

function Checkbox(props: {
  description: string;
  checkedState: boolean;
  stateHandler: any;
}) {
  const { description, checkedState, stateHandler } = props;
  return (
    <fieldset>
      <div className="mx-2 space-y-5">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="reduceonly"
              aria-describedby="comments-description"
              name="reduceonly"
              type="checkbox"
              className="h-3 w-3 rounded border-gray-500 text-gray-500 focus:ring-0 focus-within:ring-0"
              onChange={stateHandler} // Add onChange handler
              checked={checkedState} // Control the checked state
            />
          </div>
          <div className="ml-1 text-sm leading-6">
            <label
              htmlFor="reduceonly"
              className="text-xs font-normal text-gray-300"
            >
              {description}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  );
}

function BuyButton(props: {
  submitMarketOrder: (isBuy: boolean, reduceOnly: boolean) => Promise<void>;
  reduceOnly: boolean;
}) {
  const { submitMarketOrder, reduceOnly } = props;
  return (
    <button
      type="button"
      className="rounded-sm bg-long w-1/2 h-8 text-xs font-semibold text-white shadow-sm hover:bg-green-400 active:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={async () => {
        await submitMarketOrder(true, reduceOnly);
      }}
    >
      Buy/Long
    </button>
  );
}

function SellButton(props: {
  submitMarketOrder: (isBuy: boolean, reduceOnly: boolean) => Promise<void>;
  reduceOnly: boolean;
}) {
  const { submitMarketOrder, reduceOnly } = props;

  return (
    <button
      type="button"
      className="rounded-sm bg-short w-1/2 h-8 text-xs font-semibold text-white shadow-sm hover:bg-red-400 active:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
      onClick={async () => {
        await submitMarketOrder(false, reduceOnly);
      }}
    >
      Sell/Short
    </button>
  );
}

function CreateNewAccountButton(props: any) {
  const { createNewAccount } = props;
  return (
    <button
      type="button"
      className="rounded-sm bg-blue-500 w-full h-8 text-xs font-semibold text-white shadow-sm hover:bg-blue-400 active:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
      onClick={createNewAccount}
    >
      Get a test account
    </button>
  );
}
