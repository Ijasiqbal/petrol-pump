import TextField from '@mui/material/TextField';
import './Sales.css'
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import './Setopening.css';
import { UseReadingcontext } from "../../Readingcontext";
import useAxios from '../../utils/useAxios';

const Setclosing = ({setclosingpage,CloseDuNozzles,setCloseDuNozzles}) => {

    let apiCall = useAxios();

    const {api} = UseReadingcontext()

    const placeholder = [
        ['P2','D3','P1','D4'],
        ['P4','D6','P3','D5'],
        ['XP2','P6','XP1','P5'],
        ['P8','XD2','P7','XD1'],
    ];
    

    const handleNozzleChange = (duIndex, nozzleIndex, newValue) => {
        // Use a regular expression to allow only integer numbers
        if (/^\d*\.?\d*$/.test(newValue)) {
            setCloseDuNozzles(prevCloseDuNozzles => {
                const newCloseDuNozzles = [...prevCloseDuNozzles];
                newCloseDuNozzles[duIndex][nozzleIndex] = newValue;
                return newCloseDuNozzles;
            });
        }
    };

    const handleClear = () => {
        const clearedValues = CloseDuNozzles.map(du => du.map(() => ''));
        setCloseDuNozzles(clearedValues);
    };


    const handleSave = () => {
        const postData = {
            Du1Nozzle1: parseFloat(CloseDuNozzles[0][0]),
            Du1Nozzle2: parseFloat(CloseDuNozzles[0][1]),
            Du1Nozzle3: parseFloat(CloseDuNozzles[0][2]),
            Du1Nozzle4: parseFloat(CloseDuNozzles[0][3]),
            Du2Nozzle1: parseFloat(CloseDuNozzles[1][0]),
            Du2Nozzle2: parseFloat(CloseDuNozzles[1][1]),
            Du2Nozzle3: parseFloat(CloseDuNozzles[1][2]),
            Du2Nozzle4: parseFloat(CloseDuNozzles[1][3]),
            Du3Nozzle1: parseFloat(CloseDuNozzles[2][0]),
            Du3Nozzle2: parseFloat(CloseDuNozzles[2][1]),
            Du3Nozzle3: parseFloat(CloseDuNozzles[2][2]),
            Du3Nozzle4: parseFloat(CloseDuNozzles[2][3]),
            Du4Nozzle1: parseFloat(CloseDuNozzles[3][0]),
            Du4Nozzle2: parseFloat(CloseDuNozzles[3][1]),
            Du4Nozzle3: parseFloat(CloseDuNozzles[3][2]),
            Du4Nozzle4: parseFloat(CloseDuNozzles[3][3]),
        };
        console.log('postData:', postData);

        apiCall.post(api+'/api/closingSales/', postData)
            .then((response) => {
                console.log('Data saved:', response.data);
                // Handle success, e.g., show a success message
                setclosingpage(false)
            })
            .catch((error) => {
                console.error('Error saving data:', error);
                // Handle error, e.g., show an error message
            });
    };

    return (
        <div className="base">
             <div className="close">
                <Fab
                  color="error"
                  aria-label="close"
                  onClick={() => {
                    setclosingpage(false);
                }}
                >
                  <CloseIcon />
                </Fab>
            </div>
            <div className="du-grp">
                {CloseDuNozzles.map((du, duIndex) => (
                    <div key={duIndex} className="Du">
                        <h5>{`DU ${duIndex + 1}`}</h5>
                        {du.map((nozzle, nozzleIndex) => (
                            <div>
                                <TextField
                                key={nozzleIndex}
                                sx={{ maxWidth: 200 }}
                                id={`Nozzle ${nozzleIndex + 1}`}
                                label={`Nozzle ${nozzleIndex + 1} (${placeholder[duIndex][nozzleIndex]})`}
                                size="small"
                                value={nozzle}
                                onChange={(e) => handleNozzleChange(duIndex, nozzleIndex, e.target.value)}
                            />
                             {(nozzleIndex + 1) % 2 === 0 && nozzleIndex !== du.length - 1 && <br />}
                            </div>
                        ))}
                    </div>
                ))}
                <button className="btn2" onClick={handleSave}>save</button>
                <button className='btn2' onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
}

 
export default Setclosing;