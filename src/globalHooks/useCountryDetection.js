import { useEffect, useState } from "react";

export function useCountryDetection() {
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function detectCountry() {
      try {
        const token = import.meta.env.VITE_IPINFO_TOKEN;

        const response = await fetch(
          `https://api.ipinfo.io/lite/me?token=${token}`,
        );

        if (!response.ok) {
          throw new Error("Failed to detect country");
        }

        const data = await response.json();

       
        setCountry(data.country_code);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    detectCountry();
  }, []);

  return {
    country,
    isLoading,
    error,
  };
}
