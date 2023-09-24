"use client";

import { Fragment, useState } from "react";
import {
  SignalIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/outline";

import AppShellDesktop from "@/components/appshells/desktop/AppShellDesktop";
import SlideOver from "./SlideOver";
import EthLogo from "@/components/logos/EthLogo";
import UsdcLogo from "@/components/logos/UsdcLogo";
import UsdcLogoSmall from "@/components/logos/UsdcLogoSmall";

const stats = [
  {
    id: 1,
    name: "Price Sources",
    stat: "5",
    icon: SignalIcon,
    contents: [
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
      "wss://fstream.binance.com/ws",
    ],
    indices: [],
  },
  {
    id: 2,
    name: "Last Prices",
    stat: "$ 1947.6",
    icon: ChartBarIcon,
    contents: ["1947.6", "1947.6", "1947.6", "1947.6", "1947.6"],
    indices: ["Source A", "Source B", "Source C", "Source D", "Source E"],
  },
  // {
  //   id: 3,
  //   name: "Last Data Integrity Proofs",
  //   stat: "24.57%",
  //   icon: AdjustmentsHorizontalIcon,
  //   contents: ["0.15", "0.24", "0.18", "0.31", "0.12"],
  //   indices: ["Weight A", "Weight B", "Weight C", "Weight D", "Weight E"],
  // },
];

const statuses = {
  Verified: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },
  {
    tx_id: "0xcce3...1b49",
    commit: "2d89f0c8",
    branch: "main",
    status: "Verified",
    mark_price: "1947.6",
    date: "45 minutes ago",
    dateTime: "2023-09-15 05:26:56",
  },

  // More items...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  return (
    <>
      <div>
        <AppShellDesktop blockNumber={0} currentPageName={"Price Feed"} />
        <div>
          <main>
            <SlideOver open={slideOverOpen} setOpen={setSlideOverOpen} />
            <header>
              {/* Heading */}
              <div className="flex flex-col items-center justify-start gap-x-4 gap-y-4 bg-gray-800 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
                <div className="flex items-center gap-x-3">
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h1 className="flex gap-x-3 text-base leading-7">
                    <span className="font-semibold text-white">
                      Price Feed Status
                    </span>
                  </h1>
                </div>
                <div className="flex flex-row items-center gap-1 text-gray-100">
                  <div className="order-first flex-none rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                    ETH/USDC
                  </div>
                </div>
              </div>

              <dl className="mx-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div
                  key={1}
                  className="relative overflow-hidden rounded-lg bg-gray-900 px-4 pb-5 pt-5 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                      Last On-Chain Mark Price
                    </p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-100">
                      $ 1947.6
                    </p>
                  </dd>
                </div>
              </dl>

              {/* Stats */}
              <div>
                {/* <h3 className="mx-4 sm:mx-6 lg:mx-8 text-base font-semibold leading-6 text-gray-100">
                  Price Feed Status
                </h3> */}

                <dl className="mx-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-lg bg-gray-900 px-4 pb-5 pt-5 shadow sm:px-6 sm:pt-6"
                    >
                      <dt>
                        <div className="absolute rounded-md bg-indigo-500 p-3">
                          <item.icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-gray-500">
                          {item.name}
                        </p>
                      </dt>
                      <dd className="ml-16 flex flex-col items-baseline pb-6 sm:pb-7">
                        {item.contents.map((content, idx) => (
                          <div key={idx}>
                            <p className="text-xs font-semibold text-gray-100">
                              {content}
                            </p>
                          </div>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </header>

            {/* Activity list */}
            <div className="border-t border-white/10 pt-11">
              <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
                Price Data Integrity Proof
              </h2>
              <table className="mt-6 w-full whitespace-nowrap text-left">
                <colgroup>
                  <col className="w-full sm:w-2/12" />
                  <col className="lg:w-2/12" />
                  <col className="lg:w-3/12" />
                  <col className="lg:w-3/12" />
                  <col className="lg:w-2/12" />
                </colgroup>
                <thead className="border-b border-white/10 text-sm leading-6 text-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Tx Id
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
                    >
                      Mark Price
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                    >
                      Proving Key
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                    >
                      Data Integrity Status
                    </th>

                    <th
                      scope="col"
                      className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activityItems.map((item) => (
                    <tr
                      key={item.commit}
                      className="hover:bg-gray-700"
                      onClick={() => setSlideOverOpen(true)}
                    >
                      <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                        <div className="flex items-center gap-x-4">
                          <div className="truncate text-sm font-normal leading-6 text-gray-400">
                            {item.tx_id}
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                        {item.mark_price}
                      </td>
                      <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                        <div className="flex gap-x-3">
                          <div className="font-mono text-sm leading-6 text-gray-400">
                            {item.commit}
                          </div>
                          <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                            {item.branch}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                          <time
                            className="text-gray-400 sm:hidden"
                            dateTime={item.dateTime}
                          >
                            {item.date}
                          </time>
                          <div
                            className={classNames(
                              statuses[item.status],
                              "flex-none rounded-full p-1",
                            )}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-current" />
                          </div>
                          <div className="hidden text-white sm:block">
                            {item.status} (3/3)
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                        <time dateTime={item.dateTime}>{item.dateTime}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
