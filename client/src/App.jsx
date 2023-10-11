import { BrowserRouter,Routes,Route } from "react-router-dom"
import About from "./pages/about";
import Signin from "./pages/signin";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Header from "./component/Header";

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
<Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/about" element={<About/>} />
  <Route path="/sign-in" element={<Signin/>} />
  <Route path="/sign-up" element={<Signup/>} />
  <Route path="/profile" element={<Profile/>} />
</Routes>
    </BrowserRouter>
  )
}
