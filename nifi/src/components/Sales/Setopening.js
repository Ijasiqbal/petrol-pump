import { useState } from "react";
import TextField from '@mui/material/TextField';
import './Sales.css';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import './Setopening.css'
import axios from "axios";
import { UseReadingcontext } from "../../Readingcontext";
import axiosInstance from "../../utils/axiosInstance";



const Setopening = ({setopeningpage,OpenDuNozzles,setOpenDuNozzles}) => {

    const {api} = UseReadingcontext()

    const handleNozzleChange = (duIndex, nozzleIndex, newValue) => {
        // Use a regular expression to allow only integer numbers
        if (/^\d*\.?\d*$/.test(newValue)) {
            setOpenDuNozzles(prevOpenDuNozzles => {
                const newOpenDuNozzles = [...prevOpenDuNozzles];
                newOpenDuNozzles[duIndex][nozzleIndex] = newValue;
                return newOpenDuNozzles;
            });
        }
    };
    function handleClear(){
        setOpenDuNozzles([
            ['','','',''],
            ['','','',''],
            ['','','',''],
            ['','','',''],
        ]);
    }


    async function handlePrev(){
        axiosInstance.get(api+'api/closingSales/')
        .then((response) => {
          const fetchedData = response.data;
          console.log('Fetched data:', fetchedData);
          console.log('Fetched data:1', fetchedData[0].Du1Nozzle1);
          setOpenDuNozzles([
            [fetchedData[0].Du1Nozzle1, fetchedData[0].Du1Nozzle2, fetchedData[0].Du1Nozzle3, fetchedData[0].Du1Nozzle4],
            [fetchedData[0].Du2Nozzle1, fetchedData[0].Du2Nozzle2, fetchedData[0].Du2Nozzle3, fetchedData[0].Du2Nozzle4],
            [fetchedData[0].Du3Nozzle1, fetchedData[0].Du3Nozzle2, fetchedData[0].Du3Nozzle3, fetchedData[0].Du3Nozzle4],
            [fetchedData[0].Du4Nozzle1, fetchedData[0].Du4Nozzle2, fetchedData[0].Du4Nozzle3, fetchedData[0].Du4Nozzle4],
          ]);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
    return (
        <div className="base window">
            <div className="close">
                <Fab
                  color="error"
                  aria-label="close"
                  onClick={() => {
                    setopeningpage(false);
                }}
                >
                  <CloseIcon />
                </Fab>
            </div>
            <div className="du-grp">
                {OpenDuNozzles.map((du, duIndex) => (
                    <div key={duIndex} className="Du">
                        <h5>{`DU ${duIndex + 1}`}</h5>
                        {du.map((nozzle, nozzleIndex) => (
                            <div>
                                <TextField
                                key={nozzleIndex}
                                sx={{ maxWidth: 200 }}
                                id={`Nozzle ${nozzleIndex + 1}`}
                                label={`Nozzle ${nozzleIndex + 1}`}
                                size="small"
                                value={nozzle}
                                onChange={(e) => handleNozzleChange(duIndex, nozzleIndex, e.target.value)}
                            />
                             {(nozzleIndex + 1) % 2 === 0 && nozzleIndex !== du.length - 1 && <br />} {/*add br tag*/}
                            </div>
                        ))}
                    </div>
                ))}
                <button className="btn2" onClick={()=>{setopeningpage(false)}}>save</button>
                <button className="btn2" onClick={handlePrev}>Previous</button>
                <button className="btn2" onClick={handleClear}>Clear</button>
            </div>
            
        </div>
    );
}

 
export default Setopening;