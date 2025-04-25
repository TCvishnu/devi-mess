import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

type RouteKey = "" | "fees" | "settings";

const routes: { key: RouteKey; icon: string }[] = [
  { key: "settings", icon: "ic:round-settings" },
  { key: "", icon: "material-symbols:dashboard-rounded" },
  { key: "fees", icon: "mingcute:bill-fill" },
];

const NavBar: FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: RouteKey) => {
    if (route === "") {
      return !(path.endsWith("settings") || path.endsWith("fees"));
    }
    return path.endsWith(`/${route}`);
  };

  return (
    <div className="bg-white w-full h-16 mt-4 rounded-md flex justify-evenly items-center">
      {routes.map(({ key, icon }) => (
        <Link to={key} key={key}>
          <Icon
            icon={icon}
            className={`size-10 ${
              isActive(key) ? "text-accent" : "text-primary"
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default NavBar;
