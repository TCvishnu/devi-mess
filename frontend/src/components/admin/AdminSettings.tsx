import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function AdminSettings() {
  const today = dayjs();
  return (
    <div className="w-full min-h-screen py-6 ">
      <div className="rounded-2xl space-y-8 w-full">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Hostel Rent
          </h2>
          <input
            type="number"
            placeholder="Enter rent amount"
            className="w-full p-3 border rounded-md shadow-sm outline-none"
          />
        </section>
        <section>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Electricity Charges (Per Floor)
            </h2>
            <span className=" font-semibold text-sm">
              - {today.subtract(1, "month").format("MMM")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "Devi Veed Top",
              "Rockland Arcade Top",
              "Rockland Arcade Ground",
            ].map((floor) => (
              <div key={floor}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {floor} Floor
                </label>
                <input
                  type="number"
                  placeholder={`${floor} Floor `}
                  className="w-full p-3 border rounded-md shadow-sm outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              WiFi Charges (Per Floor)
            </h2>
            <span className=" font-semibold text-sm">
              - {today.subtract(1, "month").format("MMM")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "Devi Veed Top",
              "Rockland Arcade Top",
              "Rockland Arcade Ground",
            ].map((floor) => (
              <div key={floor}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {floor} Floor
                </label>
                <input
                  type="number"
                  placeholder={`${floor} Floor`}
                  className="w-full p-3 border rounded-md shadow-sm focus:outline-none outline-none text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Meal Rates</h2>
          {["Morning", "Afternoon", "Evening"].map((meal) => (
            <div key={meal} className="mb-6">
              <h3 className="text-lg font-medium mb-2">{meal} Meal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Male", "Female"].map((gender) => (
                  <div key={gender}>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      {gender}
                    </label>
                    <input
                      type="number"
                      placeholder={`${meal} - ${gender}`}
                      className="w-full p-3 border rounded-md shadow-sm outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <button className="w-full mb-4 py-3 bg-primary text-white rounded-md shadow-md ">
          Save Settings
        </button>
      </div>
    </div>
  );
}
