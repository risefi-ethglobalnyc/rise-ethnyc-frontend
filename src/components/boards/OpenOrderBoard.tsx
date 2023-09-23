// TODO: Impl.
export default function OpenOrderBoard() {
  return (
    <div className="bg-gray-900">
      <div className="px-2 sm:px-4 lg:px-4">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-hidden sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-600">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 px-2 text-left text-xs font-semibold text-gray-400"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Market
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Order Type
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Side
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Reduce Only
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-xs font-semibold text-gray-400"
                    >
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600 bg-gray-900"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
