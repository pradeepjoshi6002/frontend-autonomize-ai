import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserSearch from "./screens/UserSearch.jsx";
import RepoDetails from "./screens/RepoDetails.jsx";
import FollowersPage from "./screens/FollowersPage.jsx";
import RepositoryList from "./components/RepositoryList.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSearch />} />
        <Route path="/:username/:repoName" element={<RepoDetails />} />
        <Route path="/:username/followers" element={<FollowersPage />} />
        <Route path="/:username/repos" element={<RepositoryList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
