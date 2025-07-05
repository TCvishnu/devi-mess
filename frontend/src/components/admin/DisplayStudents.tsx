import {
  FC,
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type { UserWithoutPassword } from "@type/user";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  getResidents,
  getMessStudents,
  searchStudentsByName,
} from "@services/verifiedUserService";

import StudentCard from "./StudentCard";
import { UserRole } from "@type/enums";

const LIMIT = 10 as const;

const DisplayStudents: FC = () => {
  const [displayResidents, setDisplayResidents] = useState<boolean>(true);
  const [magnifiedUsers, setMagnifiedUsers] = useState<Set<string>>(new Set());

  const [residents, setResidents] = useState<UserWithoutPassword[]>([]);
  const [messStudents, setMessStudents] = useState<UserWithoutPassword[]>([]);

  const [noMoreStudentsLeft, setNoMoreStudentsLeft] = useState<boolean>(false);

  const [residentsPage, setResidentsPage] = useState(1);
  const [messPage, setMessPage] = useState(1);

  const [hasMoreResidents, setHasMoreResidents] = useState(true);
  const [hasMoreMessStudents, setHasMoreMessStudents] = useState(true);
  // the above states monitor that more students are left to scroll before fetching next set of students

  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const hasFetchedInitial = useRef({ residents: false, mess: false });

  const [searchName, setSearchName] = useState<string>("");
  const [debouncedName, setDebouncedName] = useState<string>("");

  const [searchResults, setSearchResults] = useState<UserWithoutPassword[]>([]);

  const [deleteUserData, setDeleteUserData] =
    useState<UserWithoutPassword | null>(null);

  const toggleMagnifiedUsers = (userID: string) => {
    setMagnifiedUsers((prev) => {
      const updated = new Set(prev);
      if (updated.has(userID)) {
        updated.delete(userID);
      } else {
        updated.add(userID);
      }
      return updated;
    });
  };

  const showResidents = () => {
    if (displayResidents) return;

    setDisplayResidents(true);
    setMagnifiedUsers(new Set());
    setResidents([]);
    setResidentsPage(1);
    setHasMoreResidents(true);
    setNoMoreStudentsLeft(false);
    setSearchName("");
    setSearchResults([]);
    hasFetchedInitial.current.residents = false; // not yet fetched any residents
  };

  const showMessStudents = () => {
    if (!displayResidents) return;

    setDisplayResidents(false);
    setMagnifiedUsers(new Set());
    setMessStudents([]);
    setMessPage(1);
    setHasMoreMessStudents(true);
    setNoMoreStudentsLeft(false);
    setSearchName("");
    setSearchResults([]);
    hasFetchedInitial.current.mess = false;
  };

  const fetchResidents = useCallback(async () => {
    if (!displayResidents || !hasMoreResidents || loading) return;
    setLoading(true);
    try {
      const result = await getResidents(residentsPage, LIMIT);
      if (result.status === 200) {
        const newResidents = result.residents;
        setResidents((prev) => [...prev, ...newResidents]);
        setHasMoreResidents(newResidents.length === LIMIT); // if this length < LIMIT .. no more students left

        setNoMoreStudentsLeft(
          newResidents.length + residents.length === result.total
        ); // for message display at the bottom of the page
      }
    } catch (err) {
      console.error("Failed to fetch residents", err);
    } finally {
      setLoading(false);
    }
  }, [
    residentsPage,
    displayResidents,
    hasMoreResidents,
    loading,
    residents.length,
  ]);

  const fetchMessStudents = useCallback(async () => {
    if (displayResidents || !hasMoreMessStudents || loading) return;
    setLoading(true);
    try {
      const result = await getMessStudents(messPage, LIMIT);
      if (result.status === 200) {
        const newMess = result.messStudents;
        setMessStudents((prev) => [...prev, ...newMess]);
        setHasMoreMessStudents(newMess.length === LIMIT);
        setNoMoreStudentsLeft(
          newMess.length + messStudents.length === result.total
        );
      }
    } catch (err) {
      console.error("Failed to fetch mess students", err);
    } finally {
      setLoading(false);
    }
  }, [
    messPage,
    displayResidents,
    hasMoreMessStudents,
    loading,
    messStudents.length,
  ]);

  const lastStudentRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect(); // remove previous Last-Div

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (displayResidents) {
              setResidentsPage((prev) => prev + 1);
            } else {
              setMessPage((prev) => prev + 1);
            }
          }
        },
        { threshold: 1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, displayResidents]
  );

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const openUserDeletePopup = (user: UserWithoutPassword) => {
    setDeleteUserData(user);
  };

  const deleteUser = () => {};

  useEffect(() => {
    if (displayResidents && residentsPage > 1) {
      fetchResidents();
    }
  }, [residentsPage, displayResidents, fetchResidents]);

  useEffect(() => {
    if (!displayResidents && messPage > 1) {
      fetchMessStudents();
    }
  }, [messPage, displayResidents, fetchMessStudents]);

  useEffect(() => {
    if (displayResidents && !hasFetchedInitial.current.residents) {
      fetchResidents();
      hasFetchedInitial.current.residents = true;
    } else if (!displayResidents && !hasFetchedInitial.current.mess) {
      fetchMessStudents();
      hasFetchedInitial.current.mess = true;
    }
  }, [displayResidents, fetchMessStudents, fetchResidents]);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebouncedName(searchName);
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [searchName]);

  useEffect(() => {
    if (debouncedName.trim().length) {
      const fetchStudentsByName = async () => {
        const result = await searchStudentsByName(
          debouncedName,
          displayResidents ? UserRole.Resident : UserRole.Mess
        );
        if (result.status === 200) {
          setSearchResults(result.students);
          return;
        }
        setSearchResults([]);
      };

      fetchStudentsByName();
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  const currentList = debouncedName.length
    ? searchResults
    : displayResidents
    ? residents
    : messStudents;

  return (
    <div className="w-full flex flex-col gap-4 pt-6 h-full">
      <div className="w-full min-h-12 border border-gray-400 flex items-center rounded-sm gap-2 px-2">
        <Icon icon="uil:search" className="size-6 text-gray-500" />
        <div className="w-[1.5px] h-6 bg-gray-400" />
        <input
          value={searchName}
          onChange={changeName}
          className="h-full w-full outline-none text-sm font-medium placeholder:text-gray-300"
          placeholder="Search.."
        />
      </div>

      <div className="flex w-full justify-between">
        <button
          className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
            displayResidents ? "bg-accent text-white" : "border border-gray-400"
          }`}
          onClick={showResidents}
        >
          Residents
        </button>
        <button
          className={`w-32 h-10 font-semibold text-sm rounded-xs xs:w-40 ${
            !displayResidents
              ? "bg-accent text-white"
              : "border border-gray-400"
          }`}
          onClick={showMessStudents}
        >
          Mess
        </button>
      </div>

      <div className="w-full flex gap-2 flex-col pb-4">
        {currentList.map((user, index) => {
          const isExpanded = magnifiedUsers.has(user.id);
          const hasData = !!user.residentialData;
          const maxHeight = hasData ? "max-h-40" : "max-h-32";

          if (index === currentList.length - 1) {
            return (
              <div ref={lastStudentRef} key={user.id}>
                <StudentCard
                  user={user}
                  isExpanded={isExpanded}
                  maxHeight={maxHeight}
                  index={index}
                  onToggleExpand={toggleMagnifiedUsers}
                  onDelete={openUserDeletePopup}
                />
              </div>
            );
          }
          return (
            <StudentCard
              key={user.id}
              user={user}
              isExpanded={isExpanded}
              maxHeight={maxHeight}
              index={index}
              onDelete={openUserDeletePopup}
              onToggleExpand={toggleMagnifiedUsers}
            />
          );
        })}
        {loading && (
          <div className="w-full flex items-center justify-center">
            <div className=" size-8 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
        )}
        {debouncedName && searchResults.length === 0 && (
          <p className="text-center py-2 text-gray-500">
            No search results for {debouncedName}...
          </p>
        )}
        {noMoreStudentsLeft && !debouncedName && (
          <span className=" text-sm font-medium text-center w-full text-gray-600">
            No more students left
          </span>
        )}
      </div>
      {deleteUserData && (
        <div className="inset-0 fixed z-50 w-screen h-screen bg-blur flex items-center justify-center">
          <div className="bg-white rounded-md shadow-xl p-6 w-[90%] max-w-md text-center space-y-6">
            <div className="flex flex-col items-center">
              <Icon
                icon="si:warning-duotone"
                className=" size-12 text-accent"
              />
              <h2 className="text-xl font-semibold text-primary mt-4">
                Delete User?
              </h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-bold">
                  {deleteUserData.name +
                    " (" +
                    deleteUserData.phoneNumber +
                    ")"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {}}
                className="bg-accent text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setDeleteUserData(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayStudents;
