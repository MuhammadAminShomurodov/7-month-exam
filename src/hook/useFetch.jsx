import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!endpoint) return;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://api.spotify.com/v1/browse${endpoint}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [endpoint]);

  return [data, loading, error];
};
