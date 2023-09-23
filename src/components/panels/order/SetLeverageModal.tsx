import { Fragment, useState } from "react";
import { Slider, rem } from "@mantine/core";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function SetLeverageModal(props: {
  openSetLeverageModal: boolean;
  setOpenSetLeverageModal: React.Dispatch<React.SetStateAction<boolean>>;
  leverage: number;
  setLeverage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    openSetLeverageModal,
    setOpenSetLeverageModal,
    leverage,
    setLeverage,
  } = props;

  function LeverageInputForm() {
    const handleInputChange = (event: any) => {
      const { value } = event.target;
      setLeverage(value);
    };
    return (
      <div>
        <div>
          <label
            htmlFor="size"
            className="block mx-2 text-xs font-medium leading-6 text-gray-400"
          >
            Leverage
          </label>
          <div className="flex h-10 rounded-sm shadow-sm justify-between text-gray-400">
            {/* <MinusIcon className="h-4 w-4 self-center"> */}
            <button
              className="mx-5 text-xl"
              onClick={() => {
                setLeverage(leverage > 1 ? leverage - 1 : 1);
              }}
            >
              -
            </button>
            {/* </MinusIcon> */}

            {`${leverage}x`}
            {/* <PlusIcon className="h-4 w-4 self-center"> */}
            <button
              className="mx-5 text-xl"
              onClick={() => {
                setLeverage(leverage < 100 ? leverage + 1 : 100);
              }}
            >
              +
            </button>
            {/* </PlusIcon> */}
          </div>
        </div>
      </div>
    );
  }

  function LeverageSlider() {
    const handleValueChange = (value: number) => {
      setLeverage(value);
    };

    return (
      <div className="mx-2 my-5">
        <Slider
          color="gray"
          label={`${leverage}x`}
          onChange={handleValueChange}
          radius={"sm"}
          labelTransition="fade"
          size={5}
          defaultValue={leverage}
          min={0}
          max={100}
          marks={[
            { value: 1, label: "1x" },
            { value: 25, label: "25x" },
            { value: 50, label: "50x" },
            { value: 75, label: "75x" },
            { value: 100, label: "100x" },
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

  return (
    <Transition.Root show={openSetLeverageModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setOpenSetLeverageModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div> */}
                  <div className="text-center ">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-100"
                    >
                      Set Leverage
                    </Dialog.Title>
                    {/* <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Set Leverage contents
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className="mt-6">
                  <LeverageInputForm />
                </div>
                <LeverageSlider />
                <div className="mt-8 sm:mt-12">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 active:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                    onClick={() => {
                      setOpenSetLeverageModal(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
