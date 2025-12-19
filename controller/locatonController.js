import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const calculateDistanceAndEta = async (origin, destination) => {
  const api = process.env.ORS_KEY;
  const url = "https://api.openrouteservice.org/v2/matrix/driving-car";
  try {
    const response = await axios.post(
      url,
      {
        locations: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
        ],
        metrics: ["distance", "duration"],
        units: "km",
      },
      {
        headers: {
          Authorization: api,
          "Content-Type": "application/json",
        },
      }
    );

    const distanceKm = response.data.distances[0][1];
    const durationSec = response.durations[0][1];

    return {
      distance: `${distanceKm.toFixed(2)} km`,
      duration: `${Math.round(durationSec / 60).toFixed(2)} mins`,
    };
  } catch (error) {
    console.error("Error calculating distance and ETA");
    throw error;
  }
};

export const getRoute = async (req, res) => {
  const { start, end } = req.body;
  const api = process.env.ORS_KEY;
  const url =
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
  try {
    const response = await axios.post(
      url,
      {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      },
      {
        headers: {
          Authorization: api,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in getting route", error);
    res.status(501).json({ error: "Failed to get route" });
  }
};
