import { IoIosPersonAdd } from "react-icons/io";
import "./SidebarRight.scss";
import { CgClose } from "react-icons/cg";
import userblue from "../../assets/images/userblue.svg";
import comment from "../../assets/images/comment.svg";

const SidebarRight = () => {
  return (
    <div className="SidebarRight">
      <div className="right">
        <p>Friend Activity</p>
        <div className="right-img">
          <IoIosPersonAdd />
          <CgClose />
        </div>
      </div>
      <div className="right-middle">
        <p>
          Let friends and followers on Spotify see what you’re listening to.
        </p>
      </div>
      <div className="right-middle2">
        <img src={userblue} alt="" />
        <img src={comment} alt="" />
      </div>
      <div className="right-middle2">
        <img src={userblue} alt="" />
        <img src={comment} alt="" />
      </div>
      <div className="right-middle2">
        <img src={userblue} alt="" />
        <img src={comment} alt="" />
      </div>
      <div className="right-bottom">
        <p>
          Go to Settings  Social and enable “Share my listening activity on
          Spotify.’ You can turn this off at any time.
        </p>
        <button>SETTINGS</button>
      </div>
    </div>
  );
};

export default SidebarRight;
