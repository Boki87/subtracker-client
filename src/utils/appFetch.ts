const backendUrl =
  import.meta.env.MODE === "development" ? "http://localhost:3333/api/v1" : "";

async function appFetch(url: string, opts?: any):Promise<{success: boolean,data?:any }> {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "",
    },
  };

  const token = localStorage.getItem("subtracker-token");
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${backendUrl}${url}`, { ...options, ...opts })
    .then(async (response) => {
      const resData = await response.json();
      if (!resData.success) {
        return Promise.reject(resData.message || "Server error");
      }

      if (resData.token) {
        localStorage.setItem("subtracker-token", resData.token);
      }

      return Promise.resolve(resData);
    })
    .catch((e) => {
      //console.log(e);
      return Promise.reject(e)
    });
}

export default appFetch;
