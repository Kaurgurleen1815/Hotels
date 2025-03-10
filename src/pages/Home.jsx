import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHotel, FaSearch } from "react-icons/fa";

const AMADEUS_API_KEY = "R8V2UmlpMuBxwjQVOov0BcyF8sqkXGtl";
const AMADEUS_API_SECRET = "SJ5xbuJsIVM2YDH4";
// Change the API_URL to:
const API_URL = "https://test.api.amadeus.com/v2/shopping/hotel-offers";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
        });
        const data = await response.json();
        return data.access_token;
      } catch (error) {
        console.error("Error fetching token:", error);
        setError("Failed to authenticate with Amadeus API");
        return null;
      }
    };

   
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await fetchToken();
        if (!token) return;

        const params = new URLSearchParams({
          cityCode: "BOM", // Now properly included in URLSearchParams
          checkInDate: "2025-04-01",
          adults: "1",
          roomQuantity: "1",
          currency: "USD",
          paymentPolicy: "NONE",
          includeClosed: "false",
          bestRateOnly: "true",
        });

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.errors?.[0]?.detail || "Failed to fetch hotels");
        }

        const data = await response.json();
        const hotelResults = data?.data || [];

        const formattedHotels = hotelResults.map((hotel) => ({
          id: hotel.hotel.hotelId,
          name: hotel.hotel.name,
          address: hotel.hotel.address?.lines?.join(", ") || "Address not available",
          rating: hotel.hotel.rating || 0,
          price: hotel.offers?.[0]?.price?.total ? `$${hotel.offers[0].price.total}` : "Price unavailable",
          image: "https://source.unsplash.com/300x200/?hotel",
          amenities: hotel.hotel.amenities?.slice(0, 4) || [],
        }));

        setHotels(formattedHotels);
        setFilteredHotels(formattedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError(error.message || "Failed to fetch hotel data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    setFilteredHotels(
      hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(search.toLowerCase()) ||
        hotel.address.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, hotels]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex justify-between items-center bg-white shadow-lg p-4 rounded-2xl mt-4"
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaHotel className="text-blue-500" /> Hotel Finder
        </h1>
      </motion.header>

      {error && <div className="mt-4 text-red-500">{error}</div>}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-6xl mt-10"
      >
        <img
          src="https://source.unsplash.com/1200x500/?luxury-hotel"
          alt="Hotel View"
          className="w-full h-80 object-cover rounded-2xl shadow-lg"
        />
      </motion.div>

      <div className="w-full max-w-6xl mt-8">
        <div className="relative flex items-center bg-white rounded-lg shadow-lg p-2">
          <input
            type="text"
            placeholder="Search hotels by name or location..."
            className="w-full p-4 border-0 rounded-lg focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <FaSearch className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
