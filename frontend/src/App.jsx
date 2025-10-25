import Body from "./Body";
import { Route, Routes } from 'react-router-dom'
import PageNotFound from "./pages/PageNotFound"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Body />} >
          <Route path="/login" element={<></>}/>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App;