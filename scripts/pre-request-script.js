pm.sendRequest({
    url: "https://localhost:5001/token",
    method: 'GET',
    header: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
},
    (err, res) => {
        pm.globals.set("bearerToken", res.json().token)
        console.log(res.json());
});