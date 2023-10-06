import { useState } from "react";
import TextField from '@mui/material/TextField';
import './Sales.css'

const Sales = () => {
    const duCount = 4;
    const nozzleCount = 4;

    // Create state for each DU and nozzle
    const [duNozzles, setDuNozzles] = useState(
        Array.from({ length: duCount }, () =>
            Array.from({ length: nozzleCount }, () => '')
        )
    );

    const handleNozzleChange = (duIndex, nozzleIndex, newValue) => {
        // Use a regular expression to allow only integer numbers
        if (/^\d*\.?\d*$/.test(newValue)) {
            setDuNozzles(prevDuNozzles => {
                const newDuNozzles = [...prevDuNozzles];
                newDuNozzles[duIndex][nozzleIndex] = newValue;
                return newDuNozzles;
            });
        }
    };

    return (
        <div className="base">
            <div className="du-grp">
                {duNozzles.map((du, duIndex) => (
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
                             {(nozzleIndex + 1) % 2 === 0 && nozzleIndex !== du.length - 1 && <br />}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sales;
