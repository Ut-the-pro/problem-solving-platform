import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './Landing';
import Signup from './Signup';
import Appbar from './Appbar';



function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path= "/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
