import Body from "./Body";
import { Route, Routes } from 'react-router-dom'
import PageNotFound from "./pages/PageNotFound"
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Premium from "./pages/Premium";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Body />} >
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/premium" element={<Premium />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App;