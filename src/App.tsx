import { useState } from 'react'
import './App.css'
import { Story } from 'inkjs';

import {PAGE_STATE} from './constants.tsx';

import IntroPage from './pages/intro.tsx';
import MachinePage from './pages/machine.tsx';
import PaintingPage from './pages/painting.tsx';

function App() {
  const [pageState, setPageState] = useState(PAGE_STATE["intro"]);
  const [memorabilia, setMemorabilia] = useState([["", "", -1, -1, ""], ["", "", -1, -1, ""], ["", "", -1, -1, ""]]);
  
  return (
    <>
      {pageState == PAGE_STATE['intro'] && 
        <IntroPage pageState={pageState} setPageState={setPageState}></IntroPage>}
        
      {pageState == PAGE_STATE['machine'] && 
        <MachinePage pageState={pageState} setPageState={setPageState}
                    memorabilia={memorabilia} setMemorabilia={setMemorabilia}></MachinePage>}
        
      {pageState == PAGE_STATE['painting'] && 
        <PaintingPage pageState={pageState} setPageState={setPageState}></PaintingPage>}
    </>
  )
}

export default App
