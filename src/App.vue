<template>
  <div id="app">
    <div v-if="responseTime">
      {{ responseTime }} totalMilliseconds
    </div>
    <div v-else>
      <LoadingIcon />
    </div>
  </div>
</template>

<script>
import LoadingIcon from "@/components/LoadingIcon";

export default {
  name: "App",
  components: {
    LoadingIcon
  },
  data() {
    return {
      dealerDetails: {},
      dealerIds: [],
      responseTime: "",
    };
  },
  methods: {
    getDealerName(datasetId, dealerId) {
      return fetch(`https://api.coxauto-interview.com/api/${datasetId}/dealers/${dealerId}`)
        .then(response => response.json())
        .then(data => this.dealerDetails[dealerId].name = data.name)
        .catch(err => {
          // do something with the error
          console.error(`Error: ${err}`)
        });
    },
    postResponse(datasetId, body) {
      const xhr = new XMLHttpRequest();
      const url = `https://api.coxauto-interview.com/api/${datasetId}/answer`;

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const json = JSON.parse(xhr.responseText);
          this.responseTime = json.totalMilliseconds;
        }
      };

      const data = JSON.stringify({ dealers: body });
      xhr.send(data);
    },
    getDetails(datasetId, vehicleId) {
      return fetch(`https://api.coxauto-interview.com/api/${datasetId}/vehicles/${vehicleId}`)
        .then(response => response.json())
        .then(data => {
          const { vehicleId, year, make, model, dealerId } = data;
          const vehicleData = { vehicleId, year, make, model };

          // haven't seen this dealer before
          if (!this.dealerDetails[dealerId]) {
            this.dealerIds.push(dealerId);
            this.dealerDetails[dealerId] = { vehicles: [vehicleData] };
            // initiate call to retrieve dealer name
            return this.getDealerName(datasetId, dealerId);
          } 
          else {
            this.dealerDetails[dealerId].vehicles = [
              ...this.dealerDetails[dealerId].vehicles,
              vehicleData,
            ];
            return;
          }
        })
        .catch(err => {
          // do something with the error
          console.error(`Error: ${err}`)
        });
    },
    getDatasetId() {
      return fetch("https://api.coxauto-interview.com/api/datasetId")
        .then(response => response.json())
        .then(data => data.datasetId)
        .catch(err => {
          // do something with the error
          console.error(`Error: ${err}`)
        });
    },
    getVehicleIds(datasetId) {
      return fetch(`https://api.coxauto-interview.com/api/${datasetId}/vehicles`)
        .then(response => response.json())
        .then(data => data)
        .catch(err => {
          // do something with the error
          console.error(`Error: ${err}`)
        });
    }
  },
  async mounted() {
    const datasetId = await this.getDatasetId();

    // gets the vehicle ids
    const vehicles = await this.getVehicleIds(datasetId);

    // gets all vehicle data, makes call for dealer name if needed
    const promises = vehicles.vehicleIds.map((vehicleId) => {
      return this.getDetails(datasetId, vehicleId);
    });

    Promise.all(promises).then(_ => {
      const dealers = this.dealerIds.map((dealerId) => {
        return {
          dealerId,
          name: this.dealerDetails[dealerId].name,
          vehicles: this.dealerDetails[dealerId].vehicles,
        };
      });

      this.postResponse(datasetId, dealers);
      return dealers;
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
