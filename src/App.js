import { Provider } from "react-redux";
import "./App.css";
import Head from "./components/Head";
import Body from "./components/Body";
import store from "./utils/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WatchPage from "./components/WatchPage";
import MainContainer from "./components/MainContainer";
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="">
          <Head />
          <Body>
            <Routes>
              <Route path="/" element={<MainContainer />} />
              <Route path="/watch" element={<WatchPage />} />
              <Route path="/results" element={<SearchResults />} />
            </Routes>
          </Body>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
