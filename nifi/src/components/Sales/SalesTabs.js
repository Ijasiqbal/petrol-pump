import { useState } from "react";
import Sales from "./Sales";
import SalesTable from "./SalesTable";

const SalesTabs = () => {
  const [salesPage, setSalesPage] = useState(true);
  const [salesTable, setSalesTable] = useState(false);

  return (
    <div className="sales">
      <button
        className={`btn2 ${salesPage ? 'active-btn' : ''}`}
        onClick={() => {
          setSalesPage(true);
          setSalesTable(false);
        }}
      >
        Sales
      </button>
      <button
        className={`btn2 ${salesTable ? 'active-btn' : ''}`}
        onClick={() => {
          setSalesPage(false);
          setSalesTable(true);
        }}
      >
        Sales Table
      </button>
      <div>
        {salesPage && <Sales />}
        {salesTable && <SalesTable />}
      </div>
    </div>
  );
};

export default SalesTabs;
