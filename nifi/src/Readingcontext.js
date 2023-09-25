import { createContext, useContext,useState } from "react";

const Readingcontext = createContext();

export const ReadingProvider = ({ children }) => {
    const [petrol,setpetrol] = useState(null);
    const [diesel,setdiesel] = useState(null);
    const [extragreen,setextragreen] = useState(null);
    const [extrapriemium,setextrapriemium] = useState(null);

    const api = 'https://fuel-station-backend-production.up.railway.app'



    //const [refreshPage,setrefreshPage] = useState(false)
    let refreshPage = false

    return(
        <Readingcontext.Provider
        value = {{petrol,setpetrol,diesel,setdiesel,extragreen,setextragreen,extrapriemium,setextrapriemium,refreshPage,api}}
        >
        { children }
        </Readingcontext.Provider>
    );
};

export const UseReadingcontext = () => {

    const context = useContext(Readingcontext);
    if (!context) {
        throw new Error('useReadingContext must be used within a ReadingProvider');
      }

    return context;
};