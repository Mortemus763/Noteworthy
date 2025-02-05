import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul className="nav-example">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
