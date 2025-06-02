import { FC, useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { RateMealType, UserRole } from "@type/enums";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuthContext } from "@contexts/AuthContext";
import { getMonthlyMessBill } from "@services/billService";
import { BillComponent } from "@type/bill";
import { labelRateMealKeys } from "@constants/rateMealKeys";
import { BillType } from "@type/enums";
import { residentialBillTypeLabel } from "@constants/label";

const residentialBillTypes = new Set([
  BillType.WIFI,
  BillType.ELECTRICITY,
  BillType.RENT,
]);

const UserFees: FC = () => {
  const { user } = useAuthContext();

  const [monthYear, setMonthYear] = useState<Dayjs>();
  const [messBillComponents, setMessBillComponents] = useState<
    BillComponent[] | null
  >(null);
  const [rentBillComponents, setRentBillComponents] = useState<
    BillComponent[] | null
  >(null);

  const [noBillsYet, setNoBillsYet] = useState<boolean>(false);

  const getBillingMonthAndYear = () => {
    const now = new Date();

    const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return {
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  };

  const fetchPrevMonthMessBill = async () => {
    if (!user || !user.id) {
      return;
    }
    const { month, year } = getBillingMonthAndYear();
    setMonthYear(dayjs(new Date(year, month, 1)));

    const result = await getMonthlyMessBill(month, year, user.id);

    if (!result.status) {
      return;
    }

    const { status, bill } = result;

    if (status === 404) {
      setNoBillsYet(true);
      return;
    }
    setMessBillComponents(
      bill.billComponents.filter(
        (component: BillComponent) => !residentialBillTypes.has(component.type)
      )
    );

    setRentBillComponents(
      bill.billComponents.filter((component: BillComponent) =>
        residentialBillTypes.has(component.type)
      )
    );

    console.log(
      bill.billComponents
        .filter((component: BillComponent) =>
          residentialBillTypes.has(component.type)
        )
        .map((component: BillComponent) => ({
          type: component.type,
          amount: component.amount,
        }))
    );
  };

  useEffect(() => {
    fetchPrevMonthMessBill();
  }, []);

  if (noBillsYet) {
    return (
      <div className="py-8 w-full flex flex-col items-center justify-center gap-3 h-full text-center">
        <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="mdi:invoice-text-remove-outline" className="size-10" />
        </div>
        <h2 className="text-xl font-semibold text-primary">No Bills Yet</h2>
        <p className="text-sm text-gray-500">
          Your monthly bills will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 w-full flex flex-col gap-4">
      {messBillComponents && (
        <div
          className="w-full border border-gray-300 rounded-lg p-6 shadow-sm 
        flex flex-col justify-start"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Icon icon="icon-park-outline:calendar" className=" size-6 " />
              Mess Fees
            </h2>
            <span className="text-primary font-semibold">
              {monthYear?.format("MMMM, YYYY")}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2 border-b pb-2">
            <span>Total Days</span>
            <span>{monthYear?.daysInMonth()} days</span>
          </div>

          <div className="flex justify-between text-base font-medium text-gray-700 my-2">
            <span>Days Attended</span>
            <span>
              {messBillComponents.reduce(
                (acc, component) =>
                  component.totalDays > acc ? component.totalDays : acc,
                0
              )}{" "}
              days
            </span>
          </div>

          <div className="flex justify-between items-center mt-4 text-lg font-semibold text-primary">
            <span className="flex items-center gap-1">Final Fees</span>
            <span className="text-accent font-black flex items-center">
              <Icon icon="mdi:currency-inr" className=" size-5 " />
              {messBillComponents.reduce(
                (acc, component) => acc + component.amount,
                0
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-4 border-b"></div>
          <div className="w-full mt-4 flex flex-col gap-1 font-medium text-gray-500">
            {messBillComponents.map((component: BillComponent) => (
              <div className="w-full flex justify-between" key={component.id}>
                <span>
                  {labelRateMealKeys[component.type as unknown as RateMealType]}{" "}
                  count
                </span>
                <span>{component.totalDays}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === UserRole.Resident && rentBillComponents && (
        <div
          className="w-full border border-gray-300 rounded-lg p-6 shadow-sm 
        flex flex-col justify-start"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Icon icon="healthicons:home-outline" className="size-8" />
              Hostel Fees
            </h2>
            <span className="text-primary font-semibold">
              {monthYear?.format("MMMM, YYYY")}
            </span>
          </div>

          {rentBillComponents.map((component: BillComponent) => (
            <div
              className=" w-full flex justify-between text-gray-500"
              key={component.id}
            >
              <span>{residentialBillTypeLabel[component.type]}</span>
              <span>{component.amount > 0 ? component.amount : "--"}</span>
            </div>
          ))}
          <div className="w-full border-b border-b-gray-600 mt-4" />

          <div className="flex justify-between items-center mt-4 text-lg font-semibold text-primary">
            <span className="flex items-center gap-1">Final Fees</span>
            <span className="text-accent font-black flex items-center">
              <Icon icon="mdi:currency-inr" className=" size-5 " />
              {rentBillComponents.reduce(
                (acc, component) => acc + component.amount,
                0
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFees;
