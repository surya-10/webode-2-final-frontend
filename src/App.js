import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Search from './components/search';
import Result from './components/result';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Search/>}/>
        {/* <Route path='/:searchValue' element={<Result/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
