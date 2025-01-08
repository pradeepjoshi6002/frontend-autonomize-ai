import { useEffect, useState } from "react";
import "./components.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const RepositoryList = ({ user }) => {
  const [repoList, setRepoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRepos, setPaginatedRepos] = useState([]);
  const [fetchedUser, setFetchedUser] = useState(null);

  const { username } = useParams();

  const reposPerPage = 9;

  const getUser = async () => {
    try {
      const { data } = await axios.get(`/api/users/${username}`);
      setFetchedUser(data);
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  const getRepos = async () => {
    try {
      const userLogin = user?.login || username; // Use user prop or username from params
      const { data } = await axios.get(`/api/users/${userLogin}/repos`);
      setRepoList(data);
      setPaginatedRepos(data.slice(0, reposPerPage)); // Initialize with the first page
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  useEffect(() => {
    if (!user && username) {
      getUser();
    }
  }, [user, username]);

  useEffect(() => {
    if (user || fetchedUser) {
      getRepos();
    }
  }, [user, fetchedUser]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;
    setPaginatedRepos(repoList.slice(startIndex, endIndex));
  }, [currentPage, repoList]);

  const totalPages = Math.ceil(repoList.length / reposPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayUser = user || fetchedUser; // Use either the prop or fetched data

  return (
    <div className="user_list_main">
      {displayUser ? (
        <>
          <h1>{displayUser.name}'s Repositories</h1>
          <p>{displayUser.bio}</p>
          <p>
            Followers: {displayUser.followers} | Following:{" "}
            {displayUser.following} | Repos: {repoList.length}
          </p>
          <button>
            <Link to={`/${displayUser.login}/followers`}>followers</Link>
          </button>
        </>
      ) : (
        <p>Loading user details...</p>
      )}
      <ul className="repo_list">
        {paginatedRepos.map((repo) => (
          <li key={repo.id} className="repo_card">
            <Link to={`/${displayUser?.login || username}/${repo.name}`}>
              <h2>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>{repo.name}</p>
                </a>
              </h2>
              <p>{repo.description || "No description available"}</p>
              <div className="repo_details">
                <p>Language: {repo.language || "Not specified"}</p>
                <p>Stars: ⭐ {repo.stargazers_count}</p>
                <p>Forks: 🍴 {repo.forks_count}</p>
                <p>Open Issues: 🐞 {repo.open_issues_count}</p>
                <p>
                  Last Updated: {new Date(repo.updated_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RepositoryList;
