import Body from "./Body";
import { Route, Routes } from 'react-router-dom'
import PageNotFound from "./pages/PageNotFound"
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Body />} >
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App;