import { createContext, useContext,useState } from "react";

const Readingcontext = createContext();

export const ReadingProvider = ({ children }) => {
    const [petrol,setpetrol] = useState(null);
    const [diesel,setdiesel] = useState(null);
    const [extragreen,setextragreen] = useState(null);
    const [extrapriemium,setextrapriemium] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    //const api = 'https://fuel-station-backend-production.up.railway.app'
    const api = 'https://fuel-station-backend.vercel.app'
    //const api = 'http://127.0.0.1:8000'

    const [accessToken, setAccessToken] = useState(null);

    return(
        <Readingcontext.Provider
        value = {{petrol,
            setpetrol,
            diesel,
            setdiesel,
            extragreen,
            setextragreen,
            extrapriemium,
            setextrapriemium,
            api,
            accessToken,
            setAccessToken,
            refreshToken,
            setRefreshToken}}
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