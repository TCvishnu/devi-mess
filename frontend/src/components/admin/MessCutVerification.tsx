import dayjs from "dayjs";

const users = [
  {
    name: "Arjun Menon",
    phone: "9876543210",
    cutType: "Morning",
    date: "2025-08-03",
  },
  {
    name: "Lakshmi Nair",
    phone: "9123456789",
    cutType: "Evening",
    date: "2025-08-02",
  },
  {
    name: "Rahul Das",
    phone: "9998877665",
    cutType: "Night",
    date: "2025-08-01",
  },
  {
    name: "Sneha Suresh",
    phone: "8887766554",
    cutType: "Morning",
    date: "2025-07-31",
  },
];

const formatDate = (dateStr: string) =>
  dayjs(dateStr).format("DD-MM-YYYY | dddd");

const MessCutVerification = () => {
  return (
    <div className="bg-white text-primary mt-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="rounded-sm border border-primary/10 shadow-sm hover:shadow-md transition duration-200 p-5 flex justify-between items-start"
          >
            <div className=" space-y-1">
              <div className="text-xl font-semibold text-primary">
                {user.name}
              </div>
              <div className="text-sm mt-1">{user.phone}</div>
              <div className="text-sm">
                <span className="text-primary font-medium">
                  {user.cutType} cut
                </span>
              </div>
              <div className="text-sm text-primary/70">
                {formatDate(user.date)}
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
      </div>
    </div>
  );
};

export default MessCutVerification;
