import "./Footer.scss";
import {
  FaHeart,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaRandom,
  FaRedo,
} from "react-icons/fa";
import playIcon from "../assets/images/play.svg";
import pauseIcon from "../assets/images/pause.svg";

const Footer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="footer">
      <div className="footer__left">
        {currentTrack && (
          <>
            <img
              className="footer__albumLogo"
              src={
                currentTrack.album.images[0].url ||
                "https://via.placeholder.com/60"
              }
              alt="Album"
            />
            <div className="footer__songInfo">
              <h4>{currentTrack.name}</h4>
              <p>
                {currentTrack.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <FaHeart className="footer__icon" />
          </>
        )}
      </div>

      <div className="footer__center">
        <FaRandom className="footer__icon" />
        <FaStepBackward className="footer__icon" onClick={onPrevious} />
        <button className="footer__playPauseButton" onClick={onPlayPause}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            alt={isPlaying ? "Pause" : "Play"}
          />
        </button>
        <FaStepForward className="footer__icon" onClick={onNext} />
        <FaRedo className="footer__icon" />
        <div className="footer__progress">
          <p>2:39</p>
          <input
            type="range"
            min="0"
            max="100"
            className="footer__progressBar"
          />
          <p>4:22</p>
        </div>
      </div>

      <div className="footer__right">
        <FaVolumeUp className="footer__icon" />
        <input type="range" min="0" max="100" className="footer__volumeBar" />
      </div>
    </div>
  );
};

export default Footer;
