import { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

const PageNotFound: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 text-gray-800 px-6 relative overflow-x-hidden">
      <h1 className="text-7xl font-extrabold text-primary mb-3">404!</h1>
      <p className="text-2xl text-center max-w-lg mb-2 font-semibold text-primary">
        Oops! Ee page illa tto
      </p>
      <p className="text-base text-center max-w-md mb-6 text-gray-700">
        Santhoshettan ee page aakan paranjilarn
      </p>
      <Link
        to="/user/1"
        className="bg-primary text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
      >
        - Back to Dashboard -
      </Link>

      <div className="absolute flex items-center gap-2 bottom-20 text-primary z-10 ">
        <div className="rounded-full size-1 bg-primary animate-ping" />
        <div className="rounded-full size-2 bg-primary animate-ping delay-75" />
        <div className="rounded-full size-3 bg-primary animate-ping delay-300" />
        <Icon icon="fe:paper-plane" className=" size-10 text0-primary" />
      </div>

      {Array.from({ length: 15 }).map((_, i) => {
        const left = 100 + Math.random() * 100;
        const top = Math.random() * 100;
        const width = 1 + Math.random() * 2;

        return (
          <div
            key={`sparkle-${i}`}
            className="absolute h-[2px] bg-primary opacity-30 animate-moving-line z-0"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}rem`,
            }}
          />
        );
      })}
      {Array.from({ length: 15 }).map((_, i) => {
        const left = 100 + Math.random() * 100;
        const top = Math.random() * 100;
        const width = 1 + Math.random() * 2;

        return (
          <div
            key={`sparkle-${i + 15}`}
            className="absolute h-[2px] bg-primary opacity-30 animate-moving-line2 z-0"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}rem`,
            }}
          />
        );
      })}
    </div>
  );
};

export default PageNotFound;
