var dealerDetails = {};
var dealerIds = [];


/**
 * get the entire response and map it accordingly
 */
async function getResponse() {
    var start = performance.now();

    var datasetId = await getDatasetId();

    // gives us the vehicle ids
    var vehicles = await getVehicleIds(datasetId);

    // gets all vehicle data, makes call for dealer name if needed
    const promises = vehicles.vehicleIds.map(vehicleId => {
        return getDetails(datasetId, vehicleId)
    });

    Promise.all(promises)
        .then(data => {
            const dealers = dealerIds.map(dealerId => {
                return {
                    dealerId,
                    name: dealerDetails[dealerId].name,
                    vehicles: dealerDetails[dealerId].vehicles
                }
            })

            var end = performance.now();

            console.log('the final ', dealers, end - start)
            postResponse(dealers)
            return dealers;
        })

}

function getVehicleIds(datasetId) {
    return fetch(`http://api.coxauto-interview.com/api/${datasetId}/vehicles`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
}

/**
 * gets datasetid
 * @return Promise
 */
function getDatasetId() {
    return fetch("http://api.coxauto-interview.com/api/datasetId")
        .then(response => response.json())
        .then(data => {
            console.log(`the datasetId: ${data.datasetId}`)
            return data.datasetId;
        });
}

/**
 * get vehicle details
 * initiate call to grab dealer name
 * @param datasetId 
 * @param vehicleId 
 */
function getDetails(datasetId, vehicleId) {
    return fetch(`http://api.coxauto-interview.com/api/${datasetId}/vehicles/${vehicleId}`)
        .then(response => response.json())
        .then(data => {
            // vehicle details
            const {
                vehicleId, year, make, model, dealerId
            } = data;
            var vehicleData = { vehicleId, year, make, model };

            // put all the vehicles under the dealerid
            if (!dealerDetails[dealerId]) {
                dealerIds.push(dealerId);
                dealerDetails[dealerId] = { vehicles: [vehicleData] }
                // initiate call to retrieve dealer name
                console.log('trying to get the name')
                return getDealerName(datasetId, dealerId)
            } else {
                dealerDetails[dealerId].vehicles = [...dealerDetails[dealerId].vehicles, vehicleData]
                return
            }
        })
}

function getDealerName(datasetId, dealerId) {
    return fetch(`http://api.coxauto-interview.com/api/${datasetId}/dealers/${dealerId}`)
        .then(response => response.json())
        .then(data => {
            dealerDetails[dealerId].name = data.name
            return
        })
}

getResponse()



function postResponse(body) {
    var xhr = new XMLHttpRequest();
    var url = `http://api.coxauto-interview.com/api/${datasetId}/answer`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    var data = JSON.stringify({"answer": body });
    console.log('what is the data? ', data)
    xhr.send(data);
}