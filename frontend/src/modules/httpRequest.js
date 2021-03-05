export default function fetchData() {
    return fetch.apply(null, arguments).then(response => {
        if (!response.ok) {
            // create error object and reject if not a 2xx response code
            let err = new Error("HTTP status code: " + response.status);
            err.response = response;
            err.status = response.status;
            err.statusText = response.statusText;
            throw err
        }
        return response;
    })
}