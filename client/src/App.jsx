import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./pages/about";
import Signin from "./pages/signin";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Header from "./component/Header";
import PrivateRout from "./component/privateRout";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route  element={<PrivateRout />} >
        <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
