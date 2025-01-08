import RepositoryList from "../components/RepositoryList";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "../store/userSlice";
import "./usersearch.css";
import { useDispatch, useSelector } from "react-redux";

const UserSearch = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const user = useSelector((state) => state.user.cache[login]?.details);

  const handleSearch = () => {
    if (login !== "") {
      dispatch(fetchUserDetails(login));
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User details fetched:", user);
    }
  }, [user]);

  return (
    <div className="search_container">
      <h1>GitHub User Search</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <button className="search_btn" onClick={handleSearch} disabled={!login}>
        Search
      </button>
      {user && <RepositoryList login={login} />}
    </div>
  );
};

export default UserSearch;
