import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import PlaylistDetail from "./components/playlists/PlaylistDetail";
import LikePage from "./components/LikePage";
import { useState } from "react";

function App() {
  const [token] = useState(localStorage.getItem("access_token"));
  const [likedTracks, setLikedTracks] = useState([]);

  const handleLike = (track) => {
    if (!likedTracks.some((t) => t.id === track.id)) {
      setLikedTracks([...likedTracks, track]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/playlist/:id"
          element={<PlaylistDetail token={token} onLike={handleLike} />}
        />
        <Route path="/likes" element={<LikePage likedTracks={likedTracks} />} />
      </Routes>
    </Router>
  );
}

export default App;
