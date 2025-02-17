import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserTags, resetTags } from "../../redux/tags";
import { useModal } from "../../context/Modal";
import TagsModal from "../TagsModal/TagsModal";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";
import CreateTaskModal from "../CreateTaskModal/CreateTaskModal";
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const tags = useSelector((state) => state.tags.tags);
  const [searchTag, setSearchTag] = useState("");
  const [showTags, setShowTags] = useState(false);
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchCurrentUserTags());
    } else {
      dispatch(resetTags());
    }
  }, [dispatch, sessionUser]);

  const handleTagSearch = (tagName) => {
    const params = new URLSearchParams(window.location.search);
    const existingTags = new Set(params.getAll("tag"));

    if (!existingTags.has(tagName)) {
      existingTags.add(tagName);
    }

    params.delete("tag");
    existingTags.forEach((tag) => params.append("tag", tag));

    navigate(`/notes?${params.toString()}`);
  };

  const filterItems = (list, searchTerm) => {
    if (!list || typeof list !== "object") return [];
    const arrayList = Array.isArray(list) ? list : Object.values(list);

    return arrayList.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <nav className="sidebar">
      {/* User Profile Section */}
      <div className="profile-section">
        {sessionUser ? (
          <div className="logged-in-container">
            <ProfileButton className="nav-profile-button" />
            <div className="user-info">
              <p className="user-info-text">
                {sessionUser.username.length > 15
                  ? `${sessionUser.username.slice(0, 15)}...`
                  : sessionUser.username}
              </p>
              <p className="user-info-text">
                {sessionUser.email.length > 15
                  ? `${sessionUser.email.slice(0, 15)}...`
                  : sessionUser.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="non-logged-buttons-container">
            <OpenModalButton
              buttonText="Log In"
              className="non-logged-button"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              className="non-logged-button"
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>

      {sessionUser ? (
        <>
          {/* Navigation Buttons */}
          <div className="nav-button-box">
            <button className="new-notebook-button nav-button-height">
              + New Notebook
            </button>
            <div className="nav-small-button-box">
              <OpenModalButton
                buttonText="+ New Task"
                className="new-task-button nav-small-button nav-button-height"
                modalComponent={<CreateTaskModal />}
              />
              <button
                className="new-note-button nav-small-button nav-button-height"
                onClick={() => navigate(`/notes/new`)}
              >
                + New Note
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="nav-link-box">
            <ul className="nav-links">
              <li>
                <NavLink to="/" className="nav-item">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/notes" className="nav-item">
                  Notes
                </NavLink>
              </li>
              <li>
                <NavLink to="/tasks" className="nav-item">
                  Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/notebooks" className="nav-item">
                  Notebooks
                </NavLink>
              </li>

              {/* Tags Dropdown */}
              <li className="nav-item-container">
                <NavLink
                  to="#"
                  className="nav-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalContent(<TagsModal />);
                  }}
                >
                  Tags
                </NavLink>
                <button
                  onClick={() => setShowTags(!showTags)}
                  className="dropdown-button"
                >
                  ▼
                </button>

                {showTags && (
                  <div className="dropdown-content">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Search Tags..."
                      value={searchTag}
                      onChange={(e) => setSearchTag(e.target.value)}
                    />
                    <ul className="dropdown-list">
                      {filterItems(tags, searchTag).map((tag, index) => (
                        <li
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleTagSearch(tag.name)}
                        >
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </>
      ) : (
        <p>
          Please signup or login <br /> for the full experience!
        </p>
      )}
    </nav>
  );
}

export default Navigation;
