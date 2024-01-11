import { Fragment, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RoutesPath from './routes/RoutesPath'

function App() {
  return (
    <Fragment>   
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<RoutesPath />} />
      </Routes>
    </BrowserRouter>
  </Fragment>
  )
}

export default App
