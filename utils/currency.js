// // const axios = require("axios");

// // const getExchangeRates = async (base = "INR") => {
// //   try {
// //     const apiKey = process.env.EXCHANGE_RATE_API_KEY;
// //     const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
// //     const { data } = await axios.get(url);

// //     if (data.result !== "success") {
// //       throw new Error("Failed to fetch exchange rates");
// //     }

// //     return data.conversion_rates; // object like { USD: 0.012, INR: 1, AED: 0.044 ... }
// //   } catch (err) {
// //     console.error("❌ Error fetching exchange rates:", err.message);
// //     // fallback if API fails
// //     return { INR: 1, USD: 83, AED: 22, CAD: 61, AUD: 54 };
// //   }
// // };

// // module.exports = { getExchangeRates };

// // utils/currency.js   ← ES MODULE (MUST BE .js extension)

// import axios from "axios";

// export const getExchangeRates = async (base = "INR") => {
//   try {
//     const apiKey = process.env.EXCHANGE_RATE_API_KEY;
//     if (!apiKey) throw new Error("Missing EXCHANGE_RATE_API_KEY");

//     const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
//     const { data } = await axios.get(url);

//     if (data.result !== "success") {
//       throw new Error(data["error-type"] || "API failed");
//     }

//     return data.conversion_rates; // { USD: 0.012, INR: 1, AED: 0.044, ... }
//   } catch (err) {
//     console.warn("Exchange rate API failed → using fallback rates");
//     // These are correct: foreign currency per 1 INR
//     return {
//       INR: 1,
//       USD: 1 / 83.5,
//       AED: 1 / 22.7,
//       CAD: 1 / 61.2,
//       AUD: 1 / 56.0,
//     };
//   }
// };

// // Optional: default export (not needed but safe)
// export default getExchangeRates;

//===========================================================

// backend/utils/currency.js
import axios from "axios";

const getExchangeRates = async (base = "INR") => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    
    if (!apiKey) {
      console.warn("❌ No exchange rate API key found, using fallback rates");
      return getFallbackRates(base);
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
    const { data } = await axios.get(url, { timeout: 5000 });

    if (data.result !== "success") {
      throw new Error("Failed to fetch exchange rates: " + data.error_type);
    }

    console.log(`✅ Exchange rates fetched successfully for base: ${base}`);
    return data.conversion_rates;
  } catch (err) {
    console.error("❌ Error fetching exchange rates:", err.message);
    return getFallbackRates(base);
  }
};

const getFallbackRates = (base = "INR") => {
  // Fallback rates (approximate values)
  const fallbackRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
    CAD: 0.016,
    AUD: 0.018,
    JPY: 1.78,
    SGD: 0.016,
    CHF: 0.0105,
    CNY: 0.086,
    SAR: 0.045,
    QAR: 0.044,
    KWD: 0.0037,
    BHD: 0.0045
  };

  // If base is not INR, convert rates
  if (base !== "INR" && fallbackRates[base]) {
    const baseRate = fallbackRates[base];
    const convertedRates = {};
    
    Object.keys(fallbackRates).forEach(currency => {
      convertedRates[currency] = fallbackRates[currency] / baseRate;
    });
    
    return convertedRates;
  }

  return fallbackRates;
};

// New function to convert specific amount
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates[toCurrency];
    
    if (!rate) {
      throw new Error(`Conversion rate not available for ${toCurrency}`);
    }
    
    return amount * rate;
  } catch (err) {
    console.error("Currency conversion error:", err);
    throw err;
  }
};

export { getExchangeRates, convertCurrency };