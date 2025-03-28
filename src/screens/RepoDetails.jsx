import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepoDetails, fetchUserDetails } from "../store/userSlice";
import "./repoDetails.css";

const RepoDetails = () => {
  const { login, repoName } = useParams();
  const repoDetails = useSelector((state) =>
    state.user.cache[login]?.repos?.find((repo) => repo.name === repoName)
  );
  const user = useSelector((state) => state.user.cache[login]?.details);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(user).length && login) {
      dispatch(fetchUserDetails(login));
    }
    if (!repoDetails?.details && login && repoName) {
      dispatch(fetchRepoDetails({ login, repoName }));
    }
  }, [dispatch, login, repoDetails, repoName, user]);

  if (!repoDetails) {
    return <p>Loading repository details...</p>;
  }

  return (
    <div className="repository-details">
      <img src={user?.avatar_url} className="avatar_img_1" alt="" />
      <div>
        <h1>{repoDetails.name}</h1>
        <p>{repoDetails.description || "No description available."}</p>
        <p>
          Stars: {repoDetails.stargazers_count} | Forks:{" "}
          {repoDetails.forks_count}
        </p>
        {repoDetails?.details && (
          <div className="extra-details">
            <p>Language: {repoDetails.details.language || "N/A"}</p>
            <p>
              Topics:{" "}
              {repoDetails.details.topics?.length
                ? repoDetails.details.topics.join(", ")
                : "No topics available."}
            </p>
            <p>
              Last Updated: {new Date(repoDetails.updated_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetails;
