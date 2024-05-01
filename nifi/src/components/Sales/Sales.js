import { useState, useEffect } from "react";
import Setopening from "./Setopening";
import Setclosing from "./Setclosing";
import { UseReadingcontext } from "../../Readingcontext";
import { format, set } from "date-fns";
import { useSelector } from "react-redux";
import ErrorModal from "../../ErrorModal";
import useAxios from "../../utils/useAxios";

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

  // Additional state for new fields
  const [totalCards, setTotalCards] = useState(0);
  const [totalPaytm, setTotalPaytm] = useState(0);
  const [credit, setCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [readings, setreadings] = useState([]);
  const [credits, setCredits] = useState([]);
  
  const petrol = useSelector((state) => state.price.petrol);
  const diesel = useSelector((state) => state.price.diesel);
  const extrapriemium = useSelector((state) => state.price.extrapriemium);
  const extragreen = useSelector((state) => state.price.extragreen);

  const {api
} = UseReadingcontext();


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
  const [test,setTest] = useState([
    [5,5,5,5],
    [5,5,5,5],
    [5,5,5,5],
    [5,5,5,5]
  ])

  function CalcFuelSales() {
    
    let collection = [];
  
    collection.push(parseFloat(CloseDuNozzles[0][0] - OpenDuNozzles[0][0] - test[0][0]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[0][1] - OpenDuNozzles[0][1] - test[0][1]) * diesel);
    collection.push(parseFloat(CloseDuNozzles[0][2] - OpenDuNozzles[0][2] - test[0][2]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[0][3] - OpenDuNozzles[0][3] - test[0][3]) * diesel);
  
    collection.push(parseFloat(CloseDuNozzles[1][0] - OpenDuNozzles[1][0] - test[1][0]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[1][1] - OpenDuNozzles[1][1] - test[1][1]) * diesel);
    collection.push(parseFloat(CloseDuNozzles[1][2] - OpenDuNozzles[1][2] - test[1][2]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[1][3] - OpenDuNozzles[1][3] - test[1][3]) * diesel);
  
    collection.push(parseFloat(CloseDuNozzles[2][0] - OpenDuNozzles[2][0] - test[2][0]) * extrapriemium);
    collection.push(parseFloat(CloseDuNozzles[2][1] - OpenDuNozzles[2][1] - test[2][1]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[2][2] - OpenDuNozzles[2][2] - test[2][2]) * extrapriemium);
    collection.push(parseFloat(CloseDuNozzles[2][3] - OpenDuNozzles[2][3] - test[2][3]) * petrol);
  
    collection.push(parseFloat(CloseDuNozzles[3][0] - OpenDuNozzles[3][0] - test[3][0]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[3][1] - OpenDuNozzles[3][1] - test[3][1]) * extragreen);
    collection.push(parseFloat(CloseDuNozzles[3][2] - OpenDuNozzles[3][2] - test[3][2]) * petrol);
    collection.push(parseFloat(CloseDuNozzles[3][3] - OpenDuNozzles[3][3] - test[3][3]) * extragreen);
  
    let sum = 0;
    for (let i = 0; i < collection.length; i++) {
      sum += collection[i];      
    }
    console.log(sum)
    return sum;
  }

  function CalcShortage() {
    let expense = parseFloat(fuel) + parseFloat(item) + parseFloat(oil) + parseFloat(debit) + parseFloat(openingBalance);
    let income = parseFloat(totalCards) + parseFloat(totalPaytm) + parseFloat(cash) + parseFloat(credit) + parseFloat(closingBalance);
    return income - expense;
  }
  function postSales(){

    const dataobject = {
      shortage: parseFloat(CalcShortage()),
      fuelSales: parseFloat(fuel),
      oil: parseFloat(oil),
      itemSales: parseFloat(item),
      debit: parseFloat(debit),
      openingBalance: parseFloat(openingBalance),
      totalCash: parseFloat(cash),
      totalCard: parseFloat(totalCards),
      totalPaytm: parseFloat(totalPaytm),
      credit: parseFloat(credit),
      closingBalance: parseFloat(closingBalance),
    };
    console.log('Updating record with Data:', dataobject)

    apiCall.post(api+`/api/sales/`, dataobject)
    .then((response) => {
        console.log('database updated',response.data);
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
  async function CalcOpeningBalance(){
    try{
      const response = await apiCall.get(api+'/api/sales/');
      const salesdata = response.data;
      console.log('salesdata',salesdata)
      const closingBalance = salesdata.map((sale) => {return sale.closingBalance});
      setOpeningBalance(closingBalance[salesdata.length-1]);
    }catch(error){
      console.error('Error fetching sales:', error);
    }
  }
  function validatePrice(){
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
      {showmodal && (<ErrorModal message={"Please set prices first"} onClose={()=>{setShowmodal(false)}} />)}

      <h1>Sales</h1>
      <div>{openingpage && <Setopening setopeningpage={setopeningpage} OpenDuNozzles={OpenDuNozzles} setOpenDuNozzles={setOpenDuNozzles} test={test} setTest= {setTest} />}</div>
      <div>{closingpage && <Setclosing setclosingpage={setclosingpage} CloseDuNozzles={CloseDuNozzles} setCloseDuNozzles={setCloseDuNozzles}/>}</div>
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
          <button className="btn1" on onClick={()=>{
            validatePrice()
            setfuel(CalcFuelSales())
          }}>Calculate</button>
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
      <div className={CalcShortage()>0 ? "green" :CalcShortage()<0 ? "red" : "black"} >
        <h4 className="shortage">Shortage/Gain:{CalcShortage()}</h4>
      </div>
      <button id="savebtn" className="btn" onClick={postSales}>Save</button>
    </div>
  );
};

export default Sales;
