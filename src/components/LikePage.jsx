import { useEffect, useState } from "react";
import "./LikePage.scss";
import SidebarLeft from "./siderbars/SidebarLeft";
import SidebarRight from "./siderbars/SidebarRight";
import arrowLeft from "../assets/images/arrow-left.svg";
import arrowRight from "../assets/images/arrow-right.svg";
import likeBlue from "../assets/images/like-blue.svg";
import heartIcon from "../assets/images/heart-empty.svg";
import heartFilledIcon from "../assets/images/heart-filled.svg";
import playIcon from "../assets/images/play.svg";
import pauseIcon from "../assets/images/pause.svg";
import Footer from "./Footer";

const LikePage = () => {
  const [likedTracks, setLikedTracks] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedLikedTracks =
      JSON.parse(localStorage.getItem("likedTracks")) || [];
    setLikedTracks(savedLikedTracks);
    if (savedLikedTracks.length > 0) {
      setCurrentTrackIndex(0); // Set the first track as the current track
    }
  }, []);

  useEffect(() => {
    if (currentTrackIndex !== null && likedTracks.length > 0) {
      const audioElement = document.getElementById(
        `audio-${currentTrackIndex}`
      );
      if (audioElement) {
        setCurrentAudio(audioElement);
        if (isPlaying) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const handlePlayPause = (audioElement, index) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      setIsPlaying(false);
    }

    if (audioElement.paused) {
      audioElement.play();
      setCurrentAudio(audioElement);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    } else {
      audioElement.pause();
      setCurrentAudio(null);
      setCurrentTrackIndex(null);
      setIsPlaying(false);
    }
  };

  const toggleLike = (trackId) => {
    const updatedLikedTracks = likedTracks.filter(
      (track) => track.id !== trackId
    );
    localStorage.setItem("likedTracks", JSON.stringify(updatedLikedTracks));
    setLikedTracks(updatedLikedTracks);
  };

  const isTrackLiked = (trackId) => {
    return likedTracks.some((track) => track.id === trackId);
  };

  const handlePlayPauseFooter = () => {
    if (likedTracks.length === 0) return;

    const audioElement =
      document.getElementById(`audio-${currentTrackIndex}`) ||
      document.createElement("audio");

    if (currentTrackIndex === null && likedTracks.length > 0) {
      handlePlayPause(document.getElementById(`audio-0`), 0);
    } else if (audioElement) {
      handlePlayPause(audioElement, currentTrackIndex);
    }
  };

  const handleNext = () => {
    if (
      currentTrackIndex !== null &&
      currentTrackIndex < likedTracks.length - 1
    ) {
      handlePlayPause(
        document.getElementById(`audio-${currentTrackIndex + 1}`),
        currentTrackIndex + 1
      );
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      handlePlayPause(
        document.getElementById(`audio-${currentTrackIndex - 1}`),
        currentTrackIndex - 1
      );
    }
  };

  return (
    <div className="like_big">
      <div className="like_page">
        <SidebarLeft />
        <div className="like_all">
          <div className="arrow">
            <img src={arrowLeft} alt="arrow left" />
            <img src={arrowRight} alt="arrow right" />
          </div>
          <div className="like_header">
            <img src={likeBlue} alt="Like Icon" />
            <div className="like_header_text">
              <p>PUBLIC PLAYLIST</p>
              <h2>Liked Tracks</h2>
            </div>
          </div>
          <div className="like_body">
            {likedTracks.length === 0 ? (
              <p className="no">No liked tracks yet.</p>
            ) : (
              <ul className="liked_tracks_list">
                {likedTracks.map((track, index) => (
                  <li key={index} className="track_item">
                    <div className="track_index">{index + 1}</div>
                    <div className="track_img">
                      <img src={track.album.images[0].url} alt={track.name} />
                    </div>
                    <div className="track_info">
                      <p className="track_name">{track.name}</p>
                      <p className="track_artist">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                    <div className="track_album">{track.album.name}</div>
                    <div
                      className="track_favorite"
                      onClick={() => toggleLike(track.id)}
                    >
                      <img
                        src={
                          isTrackLiked(track.id) ? heartFilledIcon : heartIcon
                        }
                        alt="favorite"
                      />
                    </div>
                    <div className="track_duration">
                      {Math.floor(track.duration_ms / 60000)}:
                      {Math.floor((track.duration_ms % 60000) / 1000)
                        .toFixed(0)
                        .padStart(2, "0")}
                    </div>
                    <button
                      className="play_pause_button"
                      onClick={() =>
                        handlePlayPause(
                          document.getElementById(`audio-${index}`),
                          index
                        )
                      }
                    >
                      <img
                        src={
                          isPlaying && currentTrackIndex === index
                            ? pauseIcon
                            : playIcon
                        }
                        alt={
                          isPlaying && currentTrackIndex === index
                            ? "Pause"
                            : "Play"
                        }
                      />
                    </button>
                    <audio
                      id={`audio-${index}`}
                      className="track_audio"
                      src={track.preview_url}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <SidebarRight />
      </div>
      <Footer
        currentTrack={likedTracks[currentTrackIndex]}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPauseFooter}
        onNext={handleNext}
        onPrevious={handlePrevious}
        className="footer"
      />
    </div>
  );
};

export default LikePage;
