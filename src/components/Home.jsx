import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import { useFetch } from "../hook/useFetch";
import "./Home.scss";
import arrowLeft from "../assets/images/arrow-left.svg";
import arrowRight from "../assets/images/arrow-right.svg";
import MadeForYou from "./playlists/MadeForYou";
import RecentPlayed from "./playlists/RecentPlayed";
import SidebarLeft from "./siderbars/SidebarLeft";
import SidebarRight from "./siderbars/SidebarRight";
import JumpBackIn from "./playlists/JumpBackIn";
import UniquelyYours from "./playlists/UniquelyYours";

function Home() {
  const [token, setToken] = useState("");
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

  const [data] = useFetch(token ? "/featured-playlists" : null);
  const [typs] = useFetch(token ? "/categories/toplists/playlists" : null);
  const toplists = typs?.playlists?.items;
  const playlist = data?.playlists?.items;

  return (
    <div className="Home">
      <SidebarLeft />
      {token ? (
        <div className="header">
          <div className="arrow">
            <img src={arrowLeft} alt="arrow left" />
            <img src={arrowRight} alt="arrow right" />
          </div>
          <h1>Good afternoon</h1>
          <div className="topplist">
            {toplists &&
              toplists.map((item) => (
                <div key={item.id} className="top">
                  <img src={item.images[0].url} alt={item.name} />
                  <p>{item.name}</p>
                </div>
              ))}
          </div>
          <div className="playlist">
            <div className="playlist-text">
              <h2>Your top mixes</h2>
              <p onClick={() => setShowAll(!showAll)}>
                {showAll ? "SHOW LESS" : "SEE ALL"}
              </p>
            </div>
            <div className="all-playlists">
              {playlist &&
                (showAll ? playlist : playlist.slice(0, 4)).map((item) => (
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
          <div className="made-for-you">
            <MadeForYou />
          </div>
          <div className="recently-played">
            <RecentPlayed />
          </div>
          <div className="jump-back-in">
            <JumpBackIn/>
          </div>
          <div className="uniquely-yours">
            <UniquelyYours/>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <SidebarRight />
    </div>
  );
}

export default Home;
