import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import axios from "axios";
import { Icon, LatLng } from "leaflet";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Navbar from "../../components/navbar";
import { DNA } from "react-loader-spinner";
import isIP from "validator/lib/isIP";

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface IPData {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
}

export const Route = createFileRoute("/geo")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [coords, setCoords] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchedCoords, setSearchedCoords] = useState<IPData | null>(null);
  const { refetchUser, user } = Route.useRouteContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [getIPAdds, setIPAdds] = useState<any>([]);
  const [selectedIPs, setSelectedIPs] = useState<Set<string>>(new Set());

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

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/ip/${searchTerm}`
      );
      setErrMessage("");
      setSearchedCoords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIPAdds = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/ip/getIP`,
        {
          params: { user_id: user[0].user_id },
        }
      );
      setIPAdds(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckbox = (ip: string) => {
    setSelectedIPs((prev) => {
      const updated = new Set(prev);
      updated.has(ip) ? updated.delete(ip) : updated.add(ip);
      return updated;
    });
  };

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

  const handleReset = () => {
    setSearchedCoords(null);
    setSearchTerm("");
    setErrMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchUserIPGeolocation = async () => {

      try {
        const userIP = user[0].userIP?.split(',')[0].trim()  

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}api/ip/${userIP}`
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

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}api/auth/logout`,
        {},
        { withCredentials: true }
      );
      await refetchUser();
      router.navigate({ to: "/" });
    } catch (error) {
      console.error(error);
    }
  };

  const activeIPRef = useRef<string | null>(null);
  const isDeselecting = useRef(false);

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

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/ip/${ip}`
      );
      setErrMessage("");
      setSearchedCoords(data);
      activeIPRef.current = ip;
    } catch (error) {
      console.error(error);
    }
  };

  const displayData = searchedCoords ?? coords;
  const lat = displayData?.lat ?? 0;
  const lon = displayData?.lon ?? 0;
  const position = new LatLng(lat, lon);

  if (loading)
    return (
      <DNA
        visible={true}
        height="500"
        width="500"
        ariaLabel="dna-loading"
        wrapperStyle={{ margin: "auto", marginTop: 120 }}
        wrapperClass="dna-wrapper"
      />
    );

    console.log(displayData)

  return (
    <>
      <Navbar handleLogout={handleLogout} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:h-166.5 bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90% justify-center items-center p-4 lg:p-0">

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

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">IP Address</p>
              <h1 className="text-lg font-bold text-black mt-1 break-all">
                {displayData?.query ?? "0.0.0.0"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Latitude</p>
              <h1 className="text-lg font-bold text-black mt-1">{lat}</h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Longitude</p>
              <h1 className="text-lg font-bold text-black mt-1">{lon}</h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Country</p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.country ?? "N/A"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">City</p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.city ?? "N/A"}
              </h1>
            </div>

            <div className="flex-1 min-w-[120px] bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Zip Code</p>
              <h1 className="text-lg font-bold text-black mt-1">
                {displayData?.zip ?? "N/A"}
              </h1>
            </div>
          </div>

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
                  <h3 className="font-bold text-lg">Are you sure you want to delete this?</h3>
                  <p className="py-4">Click the button below to delete</p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn ml-5" onClick={handleDelete}>Yes</button>
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
                <p className="text-sm text-center text-gray-400 py-4">No IP history found.</p>
              )}
            </div>
          </div>
        </section>

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
          <Marker position={position} icon={defaultIcon}>
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