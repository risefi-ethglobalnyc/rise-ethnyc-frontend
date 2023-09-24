import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SlideOver(props: {
  open: boolean;
  setOpen: any;
  // txId: string;
  // markPrice: string;
  // dataIntegrityProof: string;
  // dataIntegrityStatus: string;
  // timestamp: string;
}) {
  const {
    open,
    setOpen,
    // txId,
    // markPrice,
    // dataIntegrityProof,
    // dataIntegrityStatus,
    // timestamp,
  } = props;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-100">
                          Price Feed Integrity Report
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-gray-800 text-gray-400 hover:text-gray-500 focus:ring-1 focus:ring-gray-100"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="divide-y divide-gray-700">
                      <div className="pb-6">
                        <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-16">
                          <div>
                            <div className="-m-1 flex"></div>
                          </div>
                          <div className="mt-6 sm:ml-6 sm:flex-1">
                            <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0"></div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:px-0 sm:py-0">
                        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-700">
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Tx Id
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:ml-6 sm:mt-0">
                              <p>
                                Enim feugiat ut ipsum, neque ut. Tristique mi id
                                elementum praesent. Gravida in tempus feugiat
                                netus enim aliquet a, quam scelerisque. Dictumst
                                in convallis nec in bibendum aenean arcu.
                              </p>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Mark Price
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:ml-6 sm:mt-0">
                              New York, NY, USA
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Data Integrity Proof
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:ml-6 sm:mt-0">
                              ashleyporter.com
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Data Integrity Status
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:ml-6 sm:mt-0">
                              Verified
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Timestamp
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:col-span-2 sm:ml-6 sm:mt-0">
                              <time dateTime="1982-06-23">June 23, 1982</time>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
