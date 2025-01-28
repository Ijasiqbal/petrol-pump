import { useState, useEffect } from "react";
import Setopening from "./Setopening";
import Setclosing from "./Setclosing";
import { UseReadingcontext } from "../../Readingcontext";
import { format, set, subDays } from "date-fns";
import { useSelector } from "react-redux";
import ErrorModal from "../../ErrorModal";
import useAxios from "../../utils/useAxios";
import { TextField } from "@mui/material";

const Sales = () => {

  let apiCall = useAxios();

  const [openingpage, setopeningpage] = useState(false);
  const [closingpage, setclosingpage] = useState(false);

  const [debit, setdebit] = useState(0);
  const [oil, setoil] = useState(0);
  const [item, setitem] = useState(0);
  const [fuel, setfuel] = useState(0);
  const [cash, setcash] = useState(0);
  const [showmodal, setShowmodal] = useState(false);

  const [petrolUnits, setPetrolUnits] = useState(0);
  const [dieselUnits, setDieselUnits] = useState(0);
  const [extrapriemiumUnits, setExtraPremiumUnits] = useState(0);
  const [extragreenUnits, setExtraGreenUnits] = useState(0);

  const [petrolSales, setPetrolSales] = useState(0);
  const [dieselSales, setDieselSales] = useState(0);
  const [extraPremiumSales, setExtraPremiumSales] = useState(0);
  const [extraGreenSales, setExtraGreenSales] = useState(0);

  // Additional state for new fields
  const [totalCards, setTotalCards] = useState(0);
  const [totalPaytm, setTotalPaytm] = useState(0);
  const [credit, setCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [readings, setreadings] = useState([]);
  const [credits, setCredits] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const petrol = useSelector((state) => state.price.petrol);
  const diesel = useSelector((state) => state.price.diesel);
  const extrapriemium = useSelector((state) => state.price.extrapriemium);
  const extragreen = useSelector((state) => state.price.extragreen);

  const { api } = UseReadingcontext();

  let today = format(new Date(), "yyyy-MM-dd");

  // Create state for 4 DU and 4 nozzle
  const [OpenDuNozzles, setOpenDuNozzles] = useState(
    Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => '')
    )
  );

  // Create state for 4 DU 4 nozzle
  const [CloseDuNozzles, setCloseDuNozzles] = useState(
    Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => '')
    )
  );
  const [test, setTest] = useState([
    [5, 5, 5, 5],
    [5, 5, 5, 5],
    [5, 5, 5, 5],
    [5, 5, 5, 5]
  ])

  function CalcFuelSales() {
    let petrolUnits = 0;
    let dieselUnits = 0;
    let extrapriemiumUnits = 0;
    let extragreenUnits = 0;

    let petrolSales = 0;
    let dieselSales = 0;
    let extrapriemiumSales = 0;
    let extragreenSales = 0;

    petrolUnits += parseFloat(CloseDuNozzles[0][0] - OpenDuNozzles[0][0] - test[0][0]);
    dieselUnits += parseFloat(CloseDuNozzles[0][1] - OpenDuNozzles[0][1] - test[0][1]);
    petrolUnits += parseFloat(CloseDuNozzles[0][2] - OpenDuNozzles[0][2] - test[0][2]);
    dieselUnits += parseFloat(CloseDuNozzles[0][3] - OpenDuNozzles[0][3] - test[0][3]);

    petrolUnits += parseFloat(CloseDuNozzles[1][0] - OpenDuNozzles[1][0] - test[1][0]); 
    dieselUnits += parseFloat(CloseDuNozzles[1][1] - OpenDuNozzles[1][1] - test[1][1]);
    petrolUnits += parseFloat(CloseDuNozzles[1][2] - OpenDuNozzles[1][2] - test[1][2]);
    dieselUnits += parseFloat(CloseDuNozzles[1][3] - OpenDuNozzles[1][3] - test[1][3]);

    extrapriemiumUnits += parseFloat(CloseDuNozzles[2][0] - OpenDuNozzles[2][0] - test[2][0]);
    petrolUnits += parseFloat(CloseDuNozzles[2][1] - OpenDuNozzles[2][1] - test[2][1]);
    extrapriemiumUnits += parseFloat(CloseDuNozzles[2][2] - OpenDuNozzles[2][2] - test[2][2]);
    petrolUnits += parseFloat(CloseDuNozzles[2][3] - OpenDuNozzles[2][3] - test[2][3]);

    petrolUnits += parseFloat(CloseDuNozzles[3][0] - OpenDuNozzles[3][0] - test[3][0]);
    extragreenUnits += parseFloat(CloseDuNozzles[3][1] - OpenDuNozzles[3][1] - test[3][1]);
    petrolUnits += parseFloat(CloseDuNozzles[3][2] - OpenDuNozzles[3][2] - test[3][2]);
    extragreenUnits += parseFloat(CloseDuNozzles[3][3] - OpenDuNozzles[3][3] - test[3][3]);

    petrolSales = parseInt(petrolUnits * petrol);
    dieselSales = parseInt(dieselUnits * diesel);
    extrapriemiumSales = parseInt(extrapriemiumUnits * extrapriemium);
    extragreenSales = parseInt(extragreenUnits * extragreen);

  
  
    let totalSales = petrolSales + dieselSales + extrapriemiumSales + extragreenSales;
  
    setPetrolSales(petrolSales);
    setDieselSales(dieselSales);
    setExtraPremiumSales(extrapriemiumSales);
    setExtraGreenSales(extragreenSales);

    setPetrolUnits(parseFloat(petrolUnits.toFixed(2)));
    setDieselUnits(parseFloat(dieselUnits.toFixed(2)));
    setExtraPremiumUnits(parseFloat(extrapriemiumUnits.toFixed(2)));
    setExtraGreenUnits(parseFloat(extragreenUnits.toFixed(2)));
    
    return totalSales;

  }

  function CalcShortage() {
    let expense = parseFloat(fuel) + parseFloat(item) + parseFloat(oil) + parseFloat(debit) + parseFloat(openingBalance);
    let income = parseFloat(totalCards) + parseFloat(totalPaytm) + parseFloat(cash) + parseFloat(credit) + parseFloat(closingBalance);
    return income - expense;
  }

  function postSales() {
    const dataobject = {
      shortage: parseFloat(CalcShortage()),
      fuelSales: parseFloat(fuel),
      extraGreenSales: parseFloat(extraGreenSales),
      dieselSales: parseFloat(dieselSales),
      petrolSales: parseFloat(petrolSales),
      extraPremiumSales: parseFloat(extraPremiumSales),
      oil: parseFloat(oil),
      itemSales: parseFloat(item),
      debit: parseFloat(debit),
      openingBalance: parseFloat(openingBalance),
      totalCash: parseFloat(cash),
      totalCard: parseFloat(totalCards),
      totalPaytm: parseFloat(totalPaytm),
      credit: parseFloat(credit),
      closingBalance: parseFloat(closingBalance),
      date: selectedDate,
    };
    console.log('Updating record with Data:', dataobject)

    apiCall.post(api + `/api/sales/`, dataobject)
      .then((response) => {
        console.log('database updated', response.data);
        setfuel(0);
        setoil(0);
        setitem(0);
        setdebit(0);
        setcash(0);
        setTotalCards(0);
        setTotalPaytm(0);
        setCredit(0);
        setClosingBalance(0);
        setOpeningBalance(0);
        setSelectedDate('');

      })
      .catch((error) => {
        console.error('Error updating database:', error);
      })
  }

  const fetchreadings = async () => {
    try {
      const response = await apiCall.get(api + "/api/readings/");
      console.log("Response data:", response.data);
      setreadings(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function fetchcredits() {
    try {
      const response = await apiCall.get('/api/transactions/');

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const responseData = response.data;

      // Sort the response data by id in ascending order
      responseData.sort((a, b) => b.id - a.id);

      setCredits(responseData);
    } catch (error) {
      console.log('Error fetching credit transactions', error);
    }
  }

  async function CalcOpeningBalance() {
    try {
      const response = await apiCall.get(api + '/api/sales/');
      const salesdata = response.data;
      console.log('salesdata', salesdata)
      const closingBalance = salesdata.map((sale) => { return sale.closingBalance });
      setOpeningBalance(closingBalance[salesdata.length - 1]);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }

  function validatePrice() {
    if (petrol === '' || diesel === '' || extrapriemium === '' || extragreen === '') {
      setShowmodal(true)
    }
  }

  useEffect(() => {
    fetchreadings();
    fetchcredits();
  }, []);

  return (
    <div >
      {showmodal && (<ErrorModal message={"Please set prices first"} onClose={() => { setShowmodal(false) }} />)}

      <div className="header">
        <h1>Sales</h1>
        <div className="dateContainer">
          <TextField
            id="date"
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginLeft: 'auto' }}
          />
          <div className="DateBtn" onClick={() => setSelectedDate(today)}>Today</div>
          <div className="DateBtn" onClick={() => setSelectedDate(format(subDays(new Date(), 1), "yyyy-MM-dd"))}>Yesterday</div>
        </div>
      </div>
      <div>{openingpage && <Setopening setopeningpage={setopeningpage} OpenDuNozzles={OpenDuNozzles} setOpenDuNozzles={setOpenDuNozzles} test={test} setTest={setTest} />}</div>
      <div>{closingpage && <Setclosing setclosingpage={setclosingpage} CloseDuNozzles={CloseDuNozzles} setCloseDuNozzles={setCloseDuNozzles} />}</div>
      <div className="expense">
        <h3>Expense</h3>
        <div className="fuel">
          {/* Fuel Sales */}
          <label>Fuel Sales</label>
          <input
            type="number"
            value={fuel}
            onChange={(e) => setfuel(e.target.value)}
          />
          <button className="btn1" onClick={() => setopeningpage(true)}>
            Set opening
          </button>
          <button className="btn1" onClick={() => setclosingpage(true)}>
            Set closing
          </button>
          <button className="btn1" onClick={() => {
            validatePrice();
            const sales = CalcFuelSales();
            setfuel(sales);
          }}>Calculate</button>
          <div className="salesSplitContainer">
            <div className="salesSplit">
              <p>Extra Green Units: {extragreenUnits}</p>
              <p>Diesel Units: {dieselUnits}</p>
              <p>Petrol Units: {petrolUnits}</p>
              <p>Extra Premium Units: {extrapriemiumUnits}</p>
              
            </div>
            <div className="salesSplit2">
              <label>
                Extra Green Sales: 
                <input type="number" value={extraGreenSales} onChange={(e) => setExtraGreenSales(e.target.value)} />
              </label>
              <label>
                Diesel Sales: 
                <input type="number" value={dieselSales} onChange={(e) => setDieselSales(e.target.value)} />
              </label>
              <label>
                Petrol Sales: 
                <input type="number" value={petrolSales} onChange={(e) => setPetrolSales(e.target.value)} />
              </label>
              <label>
                Extra Premium Sales: 
                <input type="number" value={extraPremiumSales} onChange={(e) => setExtraPremiumSales(e.target.value)} />
              </label>
            </div>
            
          </div>
          
        </div>
        {/* Debit */}
        <div className="debit">
          <label>Debit</label>
          <input
            type="number"
            value={debit}
            onChange={(e) => setdebit(e.target.value)}
          />
          <button
            className="btn1"
            onClick={() => {
              fetchcredits();
              let sum = 0;
              credits.forEach((item) => {
                if (item.transaction_date === today && item.debit_amount != null && item.modeOfPayment !== "cheque") {
                  sum = sum + parseFloat(item.debit_amount);
                  setdebit(sum);
                }
              });
            }}
          >
            Calculate
          </button>
        </div>

        {/* Oil */}
        <div className="debit">
          <label>Oil</label>
          <input
            type="number"
            value={oil}
            onChange={(e) => setoil(e.target.value)}
          />
          <button className="btn1" onClick={() => {
            fetchreadings();
            let sum = 0;
            readings.forEach((item) => {
              if (item.date === today && item.oil !== null) {
                sum = sum + item.oil;
                setoil(sum);
              }
            });
          }}>Calculate</button>
        </div>

        {/* Item Sales */}
        <div className="debit">
          <label>Item Sales</label>
          <input
            type="number"
            value={item}
            onChange={(e) => setitem(e.target.value)}
          />
        </div>

        {/* Opening Balance */}
        <div className="debit">
          <label>Opening Balance</label>
          <input
            type="number"
            value={openingBalance}
            onChange={(e) => {
              setOpeningBalance(e.target.value)
            }}
          />
          <button
            className="btn1"
            onClick={CalcOpeningBalance}
          >Calculate</button>
        </div>
      </div>

      <div className="income">
        <h3>Sales</h3>
        {/* Total Cash */}
        <div className="debit">
          <label>Total Cash</label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setcash(e.target.value)}
          />
          <button className="btn1" onClick={() => {
            fetchreadings();
            let sum = 0;
            readings.forEach((item) => {
              if (item.date === today && item.cash !== null) {
                sum = sum + item.cash;
                setcash(sum);
              }
            });
          }}>Calculate</button>
        </div>

        {/* Total Cards */}
        <div className="debit">
          <label>Total Cards</label>
          <input
            type="number"
            value={totalCards}
            onChange={(e) => setTotalCards(e.target.value)}
          />
          <button className="btn1" onClick={() => {
            fetchreadings();
            let sum = 0;
            readings.forEach((item) => {
              if (item.date === today && item.card !== null) {
                sum = sum + item.card;
                setTotalCards(sum);
              }
            });
          }}>Calculate</button>
        </div>

        {/* Total Paytm */}
        <div className="debit">
          <label>Total Paytm</label>
          <input
            type="number"
            value={totalPaytm}
            onChange={(e) => setTotalPaytm(e.target.value)}
          />
          <button className="btn1" onClick={() => {
            fetchreadings();
            let sum = 0;
            readings.forEach((item) => {
              if (item.date === today && item.paytm !== null) {
                sum = sum + item.paytm;
                setTotalPaytm(sum);
              }
            });
          }}>Calculate</button>
        </div>

        {/* Credit */}
        <div className="debit">
          <label>Credit</label>
          <input
            type="number"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
          <button className="btn1" onClick={() => {
            fetchcredits();
            let sum = 0;
            credits.forEach((item) => {
              if (item.transaction_date === today && item.credit_amount !== null) {
                console.log(item);
                sum = sum + parseFloat(item.credit_amount);
                setCredit(sum);
              }
            });
          }}>Calculate</button>
        </div>

        {/* Closing Balance */}
        <div className="debit">
          <label>Closing Balance</label>
          <input
            type="number"
            value={closingBalance}
            onChange={(e) => setClosingBalance(e.target.value)}
          />
        </div>
      </div>
      <div className={CalcShortage() > 0 ? "green" : CalcShortage() < 0 ? "red" : "black"} >
        <h4 className="shortage">Shortage/Gain:{CalcShortage()}</h4>
      </div>
      <button id="savebtn" className="btn" onClick={postSales}>Save</button>
    </div>
  );
};

export default Sales;