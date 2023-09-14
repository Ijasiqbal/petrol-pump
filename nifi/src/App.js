import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Tabs from './components/tab/Tab';



function App() {
  return (
    <Router>
      <div className="App">
       <Navbar />  
       <div className="tab">
       <Tabs />
       </div>
      </div>
    </Router>
  );
}

export default App;
