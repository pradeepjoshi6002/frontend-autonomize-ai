import { useState } from "react";
import RepositoryList from "../components/RepositoryList";
import axios from "axios";

import "./screens.css";

const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const handleSearch = () => {
    if (username) {
      getUsers();
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get(`/api/users/${username}`);
      // https://api.github.com/users/mralexgray
      console.log(data);
      setUser(data);
    } catch (err) {
      console.log({ errpr: err.message });
    }
  };

  return (
    <div className="search_container">
      <h1>GitHub User Search</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {user && <RepositoryList user={user} />}
    </div>
  );
};

export default UserSearch;
