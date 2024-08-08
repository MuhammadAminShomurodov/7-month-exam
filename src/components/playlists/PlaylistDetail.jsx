import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlaylistDetail.scss";
import SidebarLeft from "../siderbars/SidebarLeft";
import SidebarRight from "../siderbars/SidebarRight";
import arrowLeft from "../../assets/images/arrow-left.svg";
import arrowRight from "../../assets/images/arrow-right.svg";
import heartIcon from "../../assets/images/heart-empty.svg";
import heartFilledIcon from "../../assets/images/heart-filled.svg";
import playIcon from "../../assets/images/play.svg";
import pauseIcon from "../../assets/images/pause.svg";
import Footer from "../Footer";
import { Pagination } from "antd";
import "antd/dist/reset.css";

const TRACKS_PER_PAGE = 10;

const PlaylistDetail = ({ token, onLike, likedTracks = [] }) => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [localLikedTracks, setLocalLikedTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchPlaylistDetail = async () => {
        try {
          const res = await fetch(
            `https://api.spotify.com/v1/playlists/${id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch playlist details");
          }
          const data = await res.json();
          setPlaylist(data);

          // Initialize localLikedTracks with the current liked state
          setLocalLikedTracks(
            data.tracks.items.map((item) => ({
              id: item.track.id,
              liked: likedTracks.some((track) => track.id === item.track.id),
            }))
          );
        } catch (error) {
          console.log("Error fetching playlist details: ", error);
        }
      };
      fetchPlaylistDetail();
    }
  }, [id, token, likedTracks]);

  useEffect(() => {
    // Initialize localLikedTracks from localStorage
    const storedLikedTracks =
      JSON.parse(localStorage.getItem("likedTracks")) || [];
    setLocalLikedTracks((prevState) =>
      prevState.map((track) => ({
        ...track,
        liked: storedLikedTracks.some(
          (likedTrack) => likedTrack.id === track.id
        ),
      }))
    );
  }, []);

  useEffect(() => {
    if (currentTrackIndex !== null && playlist) {
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
  }, [currentTrackIndex, isPlaying, playlist]);

  const handlePlayPause = (audioElement, index) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      setIsPlaying(null);
    }

    if (audioElement.paused) {
      audioElement.play();
      setCurrentAudio(audioElement);
      setCurrentTrackIndex(index);
      setIsPlaying(index);
    } else {
      audioElement.pause();
      setCurrentAudio(null);
      setCurrentTrackIndex(null);
      setIsPlaying(null);
    }
  };

  const toggleLike = (trackItem) => {
    const trackId = trackItem.track.id;
    const isLiked = localLikedTracks.some(
      (track) => track.id === trackId && track.liked
    );

    const updatedLikedTracks = isLiked
      ? localLikedTracks.map((track) =>
          track.id === trackId ? { ...track, liked: false } : track
        )
      : localLikedTracks.map((track) =>
          track.id === trackId ? { ...track, liked: true } : track
        );

    setLocalLikedTracks(updatedLikedTracks);

    // Update the likedTracks array in localStorage
    const currentLikedTracks =
      JSON.parse(localStorage.getItem("likedTracks")) || [];
    const trackIndex = currentLikedTracks.findIndex(
      (track) => track.id === trackId
    );

    if (isLiked) {
      if (trackIndex !== -1) {
        currentLikedTracks.splice(trackIndex, 1); // Remove track
      }
    } else {
      if (trackIndex === -1) {
        currentLikedTracks.push(trackItem.track); // Add track
      }
    }

    localStorage.setItem("likedTracks", JSON.stringify(currentLikedTracks));

    // Optionally, you can call onLike to update the parent state
    onLike(trackItem.track);
  };

  const isTrackLiked = (trackId) => {
    return localLikedTracks.some(
      (track) => track.id === trackId && track.liked
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePlayPauseFooter = () => {
    if (playlist) {
      if (currentTrackIndex === null) {
        // Play the first track if no track is currently playing
        const firstTrackIndex = 0;
        const firstAudioElement = document.getElementById(
          `audio-${firstTrackIndex}`
        );
        handlePlayPause(firstAudioElement, firstTrackIndex);
      } else {
        // Toggle play/pause for the currently playing track
        const audioElement = document.getElementById(
          `audio-${currentTrackIndex}`
        );
        handlePlayPause(audioElement, currentTrackIndex);
      }
    }
  };

  const handleNext = () => {
    if (
      currentTrackIndex !== null &&
      currentTrackIndex < playlist.tracks.items.length - 1
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

  if (!playlist) return <div>Loading...</div>;

  const totalTracks = playlist.tracks.items.length;
  const totalPages = Math.ceil(totalTracks / TRACKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRACKS_PER_PAGE;
  const currentTracks = playlist.tracks.items.slice(
    startIndex,
    startIndex + TRACKS_PER_PAGE
  );

  return (
    <div className="playlist_big">
      <div className="playlist_details_all">
        <SidebarLeft />
        <div className="playlist_d_header">
          <div className="arrow">
            <img src={arrowLeft} alt="arrow left" />
            <img src={arrowRight} alt="arrow right" />
          </div>
          <div className="playlist_d_api">
            <img src={playlist.images[0].url} alt={playlist.name} />
            <div className="playlist_d_text">
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
            </div>
          </div>
          <div className="playlist_tracks">
            <h3>Tracks</h3>
            {currentTracks.length === 0 ? (
              <p>No tracks available.</p>
            ) : (
              <>
                <ul>
                  {currentTracks.map((trackItem, index) => (
                    <li key={index} className="track_item">
                      <div className="track_index">
                        {startIndex + index + 1}
                      </div>
                      <div className="track_img">
                        <img
                          src={trackItem.track.album.images[0].url}
                          alt="album cover"
                        />
                      </div>
                      <div className="track_info">
                        <p className="track_name">{trackItem.track.name}</p>
                        <p className="track_artist">
                          {trackItem.track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="track_album">
                        {trackItem.track.album.name}
                      </div>
                      <div
                        className="track_favorite"
                        onClick={() => toggleLike(trackItem)}
                      >
                        <img
                          src={
                            isTrackLiked(trackItem.track.id)
                              ? heartFilledIcon
                              : heartIcon
                          }
                          alt="favorite"
                        />
                      </div>
                      <div className="track_duration">
                        {Math.floor(trackItem.track.duration_ms / 60000)}:
                        {Math.floor(
                          (trackItem.track.duration_ms % 60000) / 1000
                        )
                          .toFixed(0)
                          .padStart(2, "0")}
                      </div>
                      <button
                        className="play_pause_button"
                        onClick={() =>
                          handlePlayPause(
                            document.getElementById(
                              `audio-${startIndex + index}`
                            ),
                            startIndex + index
                          )
                        }
                      >
                        <img
                          src={
                            isPlaying === startIndex + index
                              ? pauseIcon
                              : playIcon
                          }
                          alt="play/pause"
                        />
                      </button>
                      <audio
                        id={`audio-${startIndex + index}`}
                        src={trackItem.track.preview_url}
                        preload="none"
                      ></audio>
                    </li>
                  ))}
                </ul>
                <Pagination
                  current={currentPage}
                  total={totalTracks}
                  pageSize={TRACKS_PER_PAGE}
                  onChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
        <SidebarRight />
      </div>
      <Footer
        isPlaying={isPlaying !== null}
        onPlayPause={handlePlayPauseFooter}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default PlaylistDetail;
