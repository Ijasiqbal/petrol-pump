import { createContext, useContext,useState } from "react";

const Readingcontext = createContext();

export const ReadingProvider = ({ children }) => {
    const [petrol,setpetrol] = useState(null);
    const [diesel,setdiesel] = useState(null);
    const [extragreen,setextragreen] = useState(null);
    const [extrapriemium,setextrapriemium] = useState(null);

    const [refreshPage,setrefreshPage] = useState(false)

    return(
        <Readingcontext.Provider
        value = {{petrol,setpetrol,diesel,setdiesel,extragreen,setextragreen,extrapriemium,setextrapriemium,refreshPage,setrefreshPage}}
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