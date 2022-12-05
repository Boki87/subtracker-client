import { useEffect, useState } from "react";

async function fetchCurrency() {
  try {
    const res = await fetch(`https://api.exchangerate.host/symbols`);
    const resData = await res.json();
    if (!resData.success) throw Error("Could not fetch currencies");

    let arr = Object.keys(resData.symbols).map((c) => ({
      short: c,
      long: `(${c})${resData.symbols[c].description}`,
    }));
    return arr;
  } catch (e) {
    return [];
  }
}

function useCurrency() {
  const [currencies, setCurrencies] = useState<any[]>([]);

  async function fetchWrapper() {
    let symbols = await fetchCurrency();
    setCurrencies(symbols);
  }

  useEffect(() => {
    fetchWrapper();
  }, []);

  return currencies;
}

export default useCurrency;
