import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import axios from "axios";
import { LatLng } from "leaflet";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/navbar";
import { DNA } from "react-loader-spinner";
import isIP from "validator/lib/isIP";

// Interface for IP geolocation data returned from IP-API
interface IPData {
  ip: string;
  type: string;           // "ipv4" or "ipv6"
  network: {
    cidr: string;
    autonomous_system: {
      asn: number;
      name: string;
      organization: string;
    };
  };
  location: {
    continent: string;
    country: string;       // "United States"
    country_code: string;  // "US"
    city: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    timezone: string;      // "America/Los_Angeles"
  };
}
// Helper component that recenters the map when coordinates change
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
}

// Route protection - redirects to home if user is not authenticated
export const Route = createFileRoute("/geo")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

// Main geolocation component for IP address tracking and visualization
function RouteComponent() {
  // State for user's default IP geolocation data
  const [coords, setCoords] = useState<IPData | null>(null);
  // Loading state for initial IP geolocation fetch
  const [loading, setLoading] = useState(true);
  // State for the searched IP geolocation data
  const [searchedCoords, setSearchedCoords] = useState<IPData | null>(null);
  const { refetchUser, user } = Route.useRouteContext();
  const router = useRouter();
  // Search input for IP address
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Error message for invalid IP input
  const [errMessage, setErrMessage] = useState<string>("");
  // List of IP addresses from user's history
  const [getIPAdds, setIPAdds] = useState<any>([]);
  // Set of selected IP IDs for bulk deletion
  const [selectedIPs, setSelectedIPs] = useState<Set<string>>(new Set());

  // Fetches geolocation data for a searched IP address and saves it to database
  const fetchIPGeolocation = async () => {
    try {
      if (!isIP(searchTerm)) {
        setErrMessage("Wrong IP Address, Please input the right one!");
        throw new Error("Wrong IP Format");
      }

      await axios.post(`${import.meta.env.VITE_API_URL}api/ip/saveIP`, {
        ip: searchTerm,
        user_id: user[0].user_id,
      });

      const { data } = await axios.get(`https://ip.guide/${searchTerm}`);
      setErrMessage("");
      setSearchedCoords(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Retrieves user's IP history from the database
  const fetchIPAdds = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/ip/getIP`, {
        params: {
          user_id: user[0].user_id,
        },
      });

      setIPAdds(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggles IP selection for bulk deletion
  const handleCheckbox = (ip: string) => {
    setSelectedIPs((prev) => {
      const updated = new Set(prev);
      updated.has(ip) ? updated.delete(ip) : updated.add(ip);
      return updated;
    });
  };

  // Deletes selected IPs from database and local state
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}api/ip/deleteIP`, {
        data: { ips: [...selectedIPs] },
      });
      setIPAdds(getIPAdds.filter((item: any) => !selectedIPs.has(item.id)));
      setSelectedIPs(new Set());
    } catch (error) {
      console.error(error);
    }
  };

  // Clears search input and searched coordinates
  const handleReset = () => {
    setSearchedCoords(null);
    setSearchTerm("");
    setErrMessage("");
  };

  // Updates search input value as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Initializes user's default IP geolocation and loads IP history
  useEffect(() => {
    const fetchUserIPGeolocation = async () => {
      try {
        const { data } = await axios.get(
          `https://ip.guide/${user[0].userIP}`,
        );
        setErrMessage("");
        setCoords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserIPGeolocation();
    fetchIPAdds();
  }, [searchedCoords]);

  // Handles user logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}api/auth/logout`,
        {},
        { withCredentials: true },
      );
      await refetchUser();
      router.navigate({ to: "/" });
    } catch (error) {
      console.error(error);
    }
  };
  
  // Ref to track the currently active/displayed IP from history
  const activeIPRef = useRef<string | null>(null);
  // Ref to prevent reselecting the same IP when toggling
  const isDeselecting = useRef(false);

  // Handles clicking on an IP from history - toggles display or fetches geolocation
  const handleReuse = async (ip: string) => {
    if (isDeselecting.current) {
      isDeselecting.current = false;
      return;
    }

    if (ip === activeIPRef.current) {
      isDeselecting.current = true;
      activeIPRef.current = null;
      setSearchedCoords(null);
      setSearchTerm("");
      setErrMessage("");
      return;
    }

    setSearchTerm(ip);
    try {
      if (!isIP(ip)) {
        setErrMessage("Wrong IP Address, Please input the right one!");
        throw new Error("Wrong IP Format");
      }

      const { data } = await axios.get(`https://ip.guide/${ip}`);
      setErrMessage("");
      setSearchedCoords(data);
      activeIPRef.current = ip;
    } catch (error) {
      console.error(error);
    }
  };

  // Determines which coordinates to display - searched IP takes precedence
  const displayData = searchedCoords ?? coords;
  const lat = displayData?.location.latitude ?? 0;
  const lon = displayData?.location.longitude ?? 0;
  const position = new LatLng(lat, lon);

  // Loading spinner displayed while fetching initial user IP data
  if (loading)
    return (
      <DNA
        visible={true}
        height="500"
        width="500"
        ariaLabel="dna-loading"
        wrapperStyle={{
          margin: "auto",
          marginTop: 120,
        }}
        wrapperClass="dna-wrapper"
      />
    );

  return (
    <>
      <Navbar handleLogout={handleLogout} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:h-166.5 bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90% justify-center items-center p-4 lg:p-0">
  
        {/* Left panel - Search controls and IP info */}
        <section className="bg-[#F5F5DC] w-full max-w-[600px] lg:w-150 h-auto lg:h-150 flex flex-col gap-4 p-4 sm:p-6 rounded-xl rounded-b-none lg:rounded-b-xl lg:rounded-r-none">
          <div className="flex flex-wrap items-center gap-2">
            {errMessage && (
              <h1 className="text-sm text-red-500 w-full">{errMessage}</h1>
            )}
            <input
              type="text"
              placeholder="Search IP Address..."
              value={searchTerm}
              onChange={handleChange}
              className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={fetchIPGeolocation}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-zinc-400"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-zinc-400"
            >
              Reset
            </button>
          </div>

          {/* Display cards showing IP and geolocation details */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                IP Address
              </p>
              <h1 className="text-lg font-bold text-black mt-1 break-all">
                {displayData?.ip ?? "0.0.0.0"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Latitude
              </p>
              <h1 className="text-lg font-bold text-black mt-1">{lat}</h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Longitude
              </p>
              <h1 className="text-lg font-bold text-black mt-1">{lon}</h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Country
              </p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.location.country ?? "N/A"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                City
              </p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.location.city ?? "N/A"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Zip Code
              </p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.location.postal_code ?? "N/A"}
              </h1>
            </div>
          </div>

          {/* IP History */}
          <div className="border rounded-lg w-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
              <span className="text-sm font-semibold">IP History</span>
              <button
                onClick={() => {
                  const dialog = document.getElementById("my_modal_4");
                  if (dialog instanceof HTMLDialogElement) dialog.showModal();
                }}
                disabled={selectedIPs.size === 0}
                className="btn btn-sm btn-error disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Selected
              </button>

              <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                  <h3 className="font-bold text-lg">
                    Are you sure you want to delete this?
                  </h3>
                  <p className="py-4">Click the button below to delete</p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button, it will close the modal */}
                      <button className="btn ml-5" onClick={handleDelete}>
                        Yes
                      </button>
                      <button className="btn">No</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>

            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2 p-3">
              {getIPAdds.map((item: any) => (
                <label
                  key={item.id}
                  onClick={() => handleReuse(item.ip)}
                  className="label cursor-pointer justify-start gap-3"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIPs.has(item.id)}
                    value={item.id}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckbox(item.id);
                    }}
                  />
                  <span className="label-text">{item.ip}</span>
                </label>
              ))}

              {getIPAdds.length === 0 && (
                <p className="text-sm text-center text-gray-400 py-4">
                  No IP history found.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Right panel - Interactive map displaying IP location */}
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full max-w-[600px] lg:w-150 h-[400px] lg:h-150 rounded-xl rounded-t-none lg:rounded-t-xl lg:rounded-l-none z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={lat} lng={lon} />
          <Marker position={position}>
            <Popup>
              Latitude: {lat} <br />
              Longitude: {lon}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}