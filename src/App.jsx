import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserSearch from "./screens/UserSearch.jsx";
import RepoDetails from "./screens/RepoDetails.jsx";
import FollowersPage from "./screens/FollowersPage.jsx";
import RepositoryList from "./components/RepositoryList.jsx";

const App = () => {
  console.log(import.meta.env.VITE_API_BASE_URL);
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSearch />} />
        <Route path="/:login/:repoName" element={<RepoDetails />} />
        <Route path="/:login/followers" element={<FollowersPage />} />
        <Route path="/:login/repos" element={<RepositoryList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
