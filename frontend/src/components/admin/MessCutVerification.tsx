import dayjs from "dayjs";
import { readUnverifiedCuts } from "@services/messcutService";
import { useEffect, useState } from "react";
import { MesscutWithUser } from "@type/user";

const LIMIT = 20 as const;

const formatDate = (dateObj: Date) =>
  dayjs(dateObj).format("DD-MM-YYYY | dddd");

const formatCutType = (cutType: string) => {
  const type = cutType.split("_")[0].toLowerCase();
  return type[0].toLocaleUpperCase() + type.slice(1);
};

const MessCutVerification = () => {
  const [page, setPage] = useState<number>(1);
  const [unverifiedCuts, setUnverifiedCuts] = useState<MesscutWithUser[]>([]);
  const [noUsersLeft, setNoUsersLeft] = useState<boolean>(true);

  const fetchUnVerifiedCuts = async () => {
    const result = await readUnverifiedCuts(page, LIMIT);

    if (result.status === 200) {
      setUnverifiedCuts((prev) => {
        const ids = new Set(prev.map((cut) => cut.id));
        const newCuts = result.result.cuts.filter(
          (cut: MesscutWithUser) => !ids.has(cut.id)
        );
        return [...prev, ...newCuts];
      });

      setNoUsersLeft(result.result.totalPages === page);
    }
  };

  useEffect(() => {
    fetchUnVerifiedCuts();
  }, [page]);

  return (
    <div className="bg-white text-primary mt-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {unverifiedCuts.map((unverifiedCut, index) => (
          <div
            key={index}
            className="rounded-sm border border-primary/10 shadow-sm hover:shadow-md transition duration-200 p-5 flex justify-between items-start"
          >
            <div className=" space-y-1">
              <div className="text-xl font-semibold text-primary">
                {unverifiedCut.user.name}
              </div>
              <div className="text-sm mt-1">
                {unverifiedCut.user.phoneNumber}
              </div>
              <div className="text-sm">
                <span className="text-primary font-medium">
                  {formatCutType(unverifiedCut.cutType)} cut
                </span>
              </div>
              <div className="text-sm text-primary/70">
                {formatDate(unverifiedCut.date)}
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center h-full">
              <button className="px-3 py-1 text-sm border border-primary rounded hover:bg-primary hover:text-white transition">
                Verify
              </button>
              <button className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">
                Cancel
              </button>
            </div>
          </div>
        ))}

        {unverifiedCuts.length === 0 && (
          <span className="w-full text-center my-4 text-sm font-medium">
            All cuts verified
          </span>
        )}
        {noUsersLeft ? (
          <span className="w-full text-center my-4 text-sm font-medium">
            ---------
          </span>
        ) : (
          <button
            className="w-full text-center my-4 text-sm font-medium"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default MessCutVerification;
