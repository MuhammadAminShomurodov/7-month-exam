import { Link } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { IoLibrary } from "react-icons/io5";
import { FaSquarePlus } from "react-icons/fa6";
import like from "../../assets/images/favorite.svg";
import "./SidebarLeft.scss";

const SidebarLeft = () => {
  return (
    <div className="SidebarLeft">
      <div className="icons1">
        <Link to="/">
          <GoHomeFill /> <span>Home</span>
        </Link>
      </div>
      <div className="icons">
        <Link to="/search">
          <IoSearch /> <span>Search</span>
        </Link>
      </div>
      <div className="icons">
        <Link to="/library">
          <IoLibrary /> <span>Library</span>
        </Link>
      </div>
      <div className="create">
        <Link to="/create-playlist">
          <FaSquarePlus /> <span>Create Playlist</span>
        </Link>
      </div>
      <div className="like">
        <Link to="/likes">
          <img src={like} alt="Liked Songs" /> <span>Liked Songs</span>
        </Link>
      </div>
      <div className="sidebar-bottom">
        <p>Chill Mix</p>
        <p>Insta Hits</p>
        <p>Your Top Songs 2021</p>
        <p>Mellow Songs</p>
        <p>Anime Lofi & Chillhop Music</p>
        <p>BG Afro “Select” Vibes</p>
        <p>Afro “Select” Vibes</p>
        <p>Happy Hits!</p>
        <p>Deep Focus</p>
        <p>Instrumental Study</p>
        <p>OST Compilations</p>
        <p>Nostalgia for old souled mill...</p>
        <p>Mixed Feelings</p>
      </div>
    </div>
  );
};

export default SidebarLeft;
