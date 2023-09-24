import { useState } from "react";
import OpenPositionBoardDesktop from "../../boards/desktop/OpenPositionBoardDesktop";
import OrderHistoryBoardDesktop from "../../boards/desktop/OrderHistoryBoardDesktop";
import PositionHistoryBoardDesktop from "../../boards/desktop/PositionHistoryBoardDesktop";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface TableTabsDesktopProps {
  wsPrice: React.MutableRefObject<number>;
  markPrice: React.MutableRefObject<number>;
  openPositionsCount: number;
  openOrdersCount: number;
}

export default function TableTabsDesktop(props: TableTabsDesktopProps) {
  const { wsPrice, markPrice, openPositionsCount, openOrdersCount } = props;

  const [activeTabIndex, setActiveTabIndex] = useState(0); // Initially, Open Position tab is active

  // Cache table contents of each tab
  const [orderHistoryContent, setOrderHistoryContent] = useState<any>(null);
  const [positionHistoryContent, setPositionHistoryContent] =
    useState<any>(null);

  type tab = {
    name: string;
    href: string;
    count?: string;
  };

  const tabs: tab[] = [
    { name: "Open Positions", href: "#", count: openPositionsCount.toString() },
    // { name: "Open Orders", href: "#", count: openOrdersCount.toString() },
    { name: "Order History", href: "#" },
    { name: "Position History", href: "#" },
  ];

  return (
    <div className="bg-gray-900 mx-6">
      {/* Mobile */}
      <div className="sm:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-sm bg-gray-700 text-gray-100 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          //   defaultValue={tabs.find((tab) => tab.current).name}
          // onChange={(event) => {
          //   console.log('>>> taget value: ', event.target.value);
          // }}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <nav
          className="mt-0.5 px-4 flex space-x-6"
          aria-label="Tabs"
          // onChange={(event) => {
          //   console.log('>>> EVENT: ', event);
          // }}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.name}
              onClick={() => {
                setActiveTabIndex(index);
                // tab.current = true;
              }}
              className={classNames(
                // tab.current
                index == activeTabIndex
                  ? "border-gray-100 text-gray-100"
                  : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                "flex whitespace-nowrap border-b-2 pb-2 pt-3 px-1 text-xs font-bold",
              )}
              // aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
              {tab.count ? (
                <span
                  className={classNames(
                    // tab.current
                    index == activeTabIndex
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-900",
                    "ml-3 hidden rounded-full py-0.5 px-2 text-xs font-medium md:inline-block",
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
      {/* Conditionally render table based on active tab */}
      {/* FIXME: total PnL 계산이 Open Position의 렌더링 과정의 일부인 문제 */}
      {activeTabIndex === 0 && (
        <OpenPositionBoardDesktop wsPrice={wsPrice} markPrice={markPrice} />
      )}
      {activeTabIndex === 1 && <OrderHistoryBoardDesktop />}
      {activeTabIndex === 2 && <PositionHistoryBoardDesktop />}
    </div>
  );
}
