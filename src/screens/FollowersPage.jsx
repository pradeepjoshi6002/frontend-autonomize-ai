import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./followersPage.css";

const FollowersPage = () => {
  const [followersList, setFollowersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { username } = useParams();

  const followersPerPage = 12;

  useEffect(() => {
    const fetchFollowersData = async () => {
      try {
        const response = await axios.get(`/api/users/${username}/followers`);
        setFollowersList(response.data);
      } catch (error) {
        console.error("Error fetching followers data:", error);
      }
    };

    fetchFollowersData();
  }, [username]);

  const totalPages = Math.ceil(followersList.length / followersPerPage);

  const currentFollowers = followersList.slice(
    (currentPage - 1) * followersPerPage,
    currentPage * followersPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="followers_page">
      <h1>{username}&apos;s Followers</h1>
      <ul className="followers_list">
        {currentFollowers.map((follower, indx) => (
          <li key={indx} className="follower_card">
            <Link to={`/${username}/repos`}>
              <img
                src={follower.avatar_url}
                alt={`${follower.login}'s avatar`}
                className="follower_img"
              />
              <p className="follower_login">{follower.login}</p>
              <p className="follower_type">{follower.type}</p>
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

export default FollowersPage;
