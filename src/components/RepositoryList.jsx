import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, fetchUserRepos } from "../store/userSlice";
import "./repository.css";

const RepositoryList = ({ login: propLogin }) => {
  const { login: paramLogin } = useParams();
  const login = propLogin || paramLogin;

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRepos, setPaginatedRepos] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.cache[login]?.details || {});
  const repos = useSelector((state) => state.user.cache[login]?.repos || []);

  useEffect(() => {
    if (!Object.keys(user).length && login) {
      dispatch(fetchUserDetails(login));
    }
    if (!repos.length && login) {
      dispatch(fetchUserRepos(login));
    }
  }, [dispatch, login]);

  const reposPerPage = 9;

  useEffect(() => {
    if (repos) {
      const startIndex = (currentPage - 1) * reposPerPage;
      const endIndex = startIndex + reposPerPage;
      setPaginatedRepos(repos.slice(startIndex, endIndex));
    }
  }, [currentPage, repos]);

  const totalPages = Math.ceil(repos.length / reposPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="user_list_main">
      {Object.keys(user).length ? (
        <div className="user_details">
          <h1>{user.name}&apos;s Repositories</h1>
          <p>{user.bio}</p>
          <p>
            Followers: {user.followers} | Following: {user.following} | Repos:{" "}
            {repos.length}
          </p>
          <button
            className="button"
            onClick={() => navigate({ pathname: `/${user.login}/followers` })}
          >
            Followers
          </button>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      {repos.length ? (
        <ul className="repo_list">
          {paginatedRepos.map((repo) => (
            <li key={repo.id} className="repo_card">
              <img src={user?.avatar_url} className="avatar_img" alt="" />
              <Link to={`/${user.login}/${repo.name}`}>
                <div className="details_text">
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
                    <p>Stars: ⭐ {repo.stargazers_count}</p>
                    <p>
                      Last Updated:{" "}
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading repositories...</p>
      )}
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
