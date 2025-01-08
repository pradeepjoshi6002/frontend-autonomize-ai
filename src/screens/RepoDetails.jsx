import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const RepoDetails = () => {
  const { username, repoName } = useParams();
  const [repository, setRepository] = useState({});

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await axios.get(`/api/repos/${username}/${repoName}`);
        setRepository(response.data);
      } catch (error) {
        console.error("Error fetching repository data:", error);
      }
    };

    fetchRepoData();
  }, []);

  return (
    <div className="repository-details">
      <h1>{repository.name}</h1>
      <p>{repository.description}</p>
      <p>
        Stars: {repository.stargazers_count} | Forks: {repository.forks_count}
      </p>
      <Link to={`/repositories/${username}`}>Back to Repositories</Link>
    </div>
  );
};

export default RepoDetails;
