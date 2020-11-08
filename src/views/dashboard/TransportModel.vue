<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="width250" />
            <th />
            <th class="width50" />
            <th class="width250" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            <td class="alignCenter">
              <v-text-field
                v-for="item in editedItem.endLocations"
                :key="item.id"
                v-model="item.endLocationName"
                required
                class="inline"
              />
            </td>
            <td>
              <v-btn
                color="primary"
                dark
                text
                @click="addNewLocation"
              >
                +
              </v-btn>
            </td>
            <td />
          </tr>
          <tr>
            <td>
              <v-text-field
                v-model="editedItem.startLocation"
                label="Start Location"
                required
              />
            </td>
            <td class="alignCenter">
              <v-text-field
                v-for="item in editedItem.endLocations"
                :key="item.id"
                v-model="item.capacity"
                type="number"
                label="Capacity"
                required
                class="inline"
              />
            </td>
            <td />
            <td>
              <v-text-field
                v-model="editedItem.truckCapacity"
                type="number"
                label="Max truck capacity"
                required
              />
            </td>
          </tr>
          <tr>
            <td />
            <td class="alignCenter">
              <v-text-field
                v-for="item in editedItem.endLocations"
                :key="item.id"
                v-model="item.maxCapacity"
                type="number"
                label="Min capacity"
                required
                class="inline"
              />
            </td>
            <td />
            <td />
          </tr>
          <tr>
            <td />
            <td class="alignCenter">
              <v-text-field
                v-for="item in editedItem.endLocations"
                :key="item.id"
                v-model="item.price"
                type="number"
                label="Price per unit"
                required
                class="inline"
              />
            </td>
            <td />
            <td />
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div
      align="center"
      justify="center"
    >
      <v-btn
        color="primary"
        dark
        text
        @click="calculate"
      >
        Calculate
      </v-btn>
      <v-btn
        color="primary"
        dark
        text
        @click="reset"
      >
        Reset
      </v-btn>
    </div>
    <div
      v-show="isCalculated"
      class="result"
    >
      <h2>Result:</h2>
      <h4
        v-for="item in editedItem.endLocations"
        :key="item.id"
      >
        Price for delivery to {{ item.endLocationName }} is {{ item.capacity * item.price }} $
      </h4>
      <h4>Total is {{ calculateTotal }} $ </h4>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TransportModel',

    data () {
      return {
        result: false,
        editedItem: {
          startLocation: '',
          truckCapacity: '',
          endLocations: [
            {
              id: 'x0',
              endLocationName: '',
              capacity: 0,
              maxCapacity: 0,
              price: 0,
            },
            {
              id: 'x1',
              endLocationName: '',
              capacity: 0,
              maxCapacity: 0,
              price: 0,
            },
          ],
        },
      }
    },
    computed: {
      isCalculated () {
        return this.result
      },
      calculateTotal () {
        var sum = 0
        this.getLocations.forEach((location) => {
          sum += location.capacity * location.price
        })
        return sum
      },
      getLocations () {
        return this.editedItem.endLocations
      },
    },
    methods: {
      calculate () {
        var results = []
        var costs = []
        this.getLocations.forEach((location) => {
          results.push(Number(location.maxCapacity))
        })
        this.getLocations.forEach((location) => {
          costs.push(Number(location.price))
        })
        let calculateResult = true
        while (calculateResult) {
          var sum = results.reduce(function (a, b) { return a + b }, 0)
          if (sum > Number(this.editedItem.truckCapacity)) {
            calculateResult = false
          } else {
            const indexOfMaxValue = costs.indexOf(Math.max(...costs))
            results[indexOfMaxValue] = results[indexOfMaxValue] + 1
          }
        }
        results.forEach((r, index) => {
          this.editedItem.endLocations[index].capacity = r
        })
        this.result = true
      },
      reset () {
        this.result = false
        this.editedItem = {
          startLocation: '',
          truckCapacity: '',
          endLocations: [
            {
              id: 'x0',
              endLocationName: '',
              capacity: 0,
              maxCapacity: 0,
              price: 0,
            },
            {
              id: 'x1',
              endLocationName: '',
              capacity: 0,
              maxCapacity: 0,
              price: 0,
            },
          ],
        }
      },
      addNewLocation () {
        const newLocation = {
          id: 'x' + this.editedItem.endLocations.length,
          endLocationName: '',
          capacity: 0,
          maxCapacity: 0,
          price: 0,
        }
        this.editedItem.endLocations.push(newLocation)
      },
    },
  }
</script>

<style scoped>
  .width250 {
    width: 250px;
  }
  .width50 {
    width: 50px;
  }
  .inline {
    display: inline-block;
    margin-right: 50px;
    align-self: center;
  }
  .result {
    margin-left: 50px;
  }
  .alignCenter {
    text-align: center;
  }
</style>
