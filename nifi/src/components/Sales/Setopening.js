import TextField from '@mui/material/TextField';
import './Sales.css';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import './Setopening.css'
import { UseReadingcontext } from "../../Readingcontext";
import useAxios from '../../utils/useAxios';



const Setopening = ({setopeningpage,OpenDuNozzles,setOpenDuNozzles,test,setTest}) => {

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

    function handleClearTest(){
        setTest([
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ])
    }


    async function handlePrev(){
        apiCall.get(api+'/api/closingSales/')
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
                                label={`Nozzle ${nozzleIndex + 1} (${placeholder[duIndex][nozzleIndex]})`}
                                size="small"
                                value={nozzle}
                                onChange={(e) => handleNozzleChange(duIndex, nozzleIndex, e.target.value)}
                            />
                                <TextField 
                                id= {`test${nozzleIndex}`}
                                label="Test"
                                size="small"
                                sx={{ maxWidth: 60 }}
                                value={test[duIndex][nozzleIndex]}
                                type='number'
                                onChange={(e) => {
                                    setTest(prevTest => {
                                        const newTest = [...prevTest];
                                        newTest[duIndex][nozzleIndex] = e.target.value;
                                        return newTest;
                                    });
                                
                                }}
                                />
                             {(nozzleIndex + 1) % 2 === 0 && nozzleIndex !== du.length - 1 && <br />} {/*add br tag*/}
                            </div>
                        ))}
                    </div>
                ))}
                <button className="btn2" onClick={()=>{setopeningpage(false)}}>save</button>
                <button className="btn2" onClick={handlePrev}>Previous</button>
                <button className="btn2" onClick={handleClear}>Clear</button>
                <button className="btn2" onClick={handleClearTest}>Clear Test</button>
            </div>
            
        </div>
    );
}

 
export default Setopening;