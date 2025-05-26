import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

const PageNotFound: FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-gray-800 px-6 relative">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-center max-w-md mb-6">
        Sorry, the page you are looking for could not be found.
      </p>
      <Link
        //dynamic routing based on user role
        to="/user/1"
        className="bg-primary text-white px-5 py-2 rounded-md  "
      >
        Visit Dashboard
      </Link>

      <div className="absolute flex items-center gap-1 bottom-1/6 text-primary z-10">
        <div className="rounded-full size-[3px] bg-primary animate-ping" />
        <div className="rounded-full size-[6px] bg-primary animate-ping delay-500" />
        <div className="rounded-full size-[10px] bg-primary animate-ping delay-1000" />
        <Icon
          icon="heroicons:paper-airplane-20-solid"
          className="size-16 text-primary"
        />
      </div>
      {Array.from({ length: 20 }).map((_, i) => {
        const right = Math.random() * 90 - 120;
        const bottom = Math.floor(10 + Math.random() * 20);
        const width = 1 + Math.random() * 2;

        return (
          <div
            key={i}
            className="absolute h-[2px] bg-primary z-0 animate-moving-line"
            style={{
              right: `${right}%`,
              bottom: `${bottom}%`,
              width: `${width}rem`,
            }}
          />
        );
      })}
      {Array.from({ length: 20 }).map((_, i) => {
        const right = Math.random() * 90 - 180;
        const bottom = Math.floor(10 + Math.random() * 20);
        const width = 1 + Math.random() * 2;

        return (
          <div
            key={i}
            className="absolute h-[2px] bg-primary z-0 animate-moving-line2"
            style={{
              right: `${right}%`,
              bottom: `${bottom}%`,
              width: `${width}rem`,
            }}
          />
        );
      })}
    </div>
  );
};

export default PageNotFound;
