import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./JumpBackIn.scss"; 

const JumpBackIn = () => {
  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(
                `${import.meta.env.VITE_CLIENT_ID}:${
                  import.meta.env.VITE_CLIENT_SECRET
                }`
              ),
          },
          body: "grant_type=client_credentials",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch token");
        }
        const auth = await res.json();
        const token = `${auth.token_type} ${auth.access_token}`;
        localStorage.setItem("access_token", token);
        setToken(token);
      } catch (error) {
        console.log("Error fetching token: ", error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchPlaylists = async () => {
        try {
          const res = await fetch(
            "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch playlists");
          }
          const data = await res.json();
          setPlaylists(data.playlists.items);
        } catch (error) {
          console.log("Error fetching playlists: ", error);
        }
      };
      fetchPlaylists();
    }
  }, [token]);

  return (
    <div className="jump-back-in">
      <div className="jump-text">
        <h2>Jump Back In</h2>
        <p onClick={() => setShowAll(!showAll)}>
          {showAll ? "SHOW LESS" : "SEE ALL"}
        </p>
      </div>
      <div className="jump-back-in-playlists">
        {playlists.slice(0, showAll ? playlists.length : 4).map((item) => (
          <Link key={item.id} to={`/playlist/${item.id}`}>
            <div className="playlist-item">
              <img src={item.images[0].url} alt={item.name} />
              <p className="item-name">{item.name}</p>
              <p className="item-description">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JumpBackIn;
