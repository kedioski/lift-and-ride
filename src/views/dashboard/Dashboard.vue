<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col lg="3">
        <v-date-picker
          v-model="date"
          color="blue lighten-1"
        />
      </v-col>
      <v-col>
        <base-material-card
          color="primary"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Loads
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="formatedItems"
              :item-class="row_classes"
            >
              <template v-slot:top>
                <v-toolbar
                  flat
                  color="white"
                >
                  <v-dialog
                    v-model="dialog"
                    max-width="500px"
                  >
                    <v-card>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.startLocation"
                                label="Start Location"
                                prepend-inner-icon="mdi-map-marker"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.endLocation"
                                label="End Location"
                                prepend-inner-icon="mdi-map-marker"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.distance"
                                label="Distance"
                                prefix="miles"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.price"
                                label="Price"
                                prefix="$"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.weight"
                                label="Weight"
                                prefix="kg"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedItem.fuel"
                                label="Fuel"
                                prefix="l"
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-menu
                                v-model="menuStart"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="editedItem.startDate"
                                    label="Start date"
                                    readonly
                                    v-on="on"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="editedItem.startDate"
                                  label="Start date"
                                  @input="menuStart = false"
                                />
                              </v-menu>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-menu
                                v-model="menuEnd"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="editedItem.endDate"
                                    label="End date"
                                    readonly
                                    v-on="on"
                                  />
                                </template>
                                <v-date-picker
                                  v-model="editedItem.endDate"
                                  label="End date"
                                  @input="menuEnd = false"
                                />
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="close"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="save"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  v-if="item.status === 'EMPTY'"
                  class="mr-3"
                  title="Add load info"
                  @click="addLoadInfo(item)"
                >
                  mdi-circle-double
                </v-icon>
                <v-icon
                  v-if="item.status !== 'EMPTY'"
                  class="mr-3"
                  title="Empty Load"
                  @click="emptyLoad(item)"
                >
                  mdi-reload
                </v-icon>
                <v-icon
                  v-if="item.status === 'EMPTY' || item.status === 'COVERED'"
                  class="mr-3"
                  title="On Vacation"
                  @click="onVacation(item)"
                >
                  mdi-alpha-v-box-outline
                </v-icon>
                <v-icon
                  v-if="item.status !== 'BROKEN'"
                  class="mr-3"
                  title="Broke Down"
                  @click="brokeDown(item)"
                >
                  mdi-close-thick
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { db } from '../../main'

  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        dialog: false,
        editedIndex: -1,
        menuStart: false,
        menuEnd: false,
        defaultItem: {
          driverId: '',
          startLocation: '',
          endLocation: '',
          distance: '',
          price: '',
          weight: '',
          fuel: '',
          startDate: '',
          endDate: '',
          status: '',
        },
        editedItem: {
          driverId: '',
          startLocation: '',
          endLocation: '',
          distance: '',
          price: '',
          weight: '',
          fuel: '',
          startDate: '',
          endDate: '',
          status: '',
        },
        date: new Date().toISOString().substr(0, 10),
        drivers: [],
        headers: [
          {
            sortable: false,
            text: 'Driver name',
            value: 'driver.name',
          },
          {
            sortable: false,
            text: 'Start location',
            value: 'startLocation',
          },
          {
            sortable: false,
            text: 'End location',
            value: 'endLocation',
          },
          {
            sortable: false,
            text: 'Start date',
            value: 'startDate',
          },
          {
            sortable: false,
            text: 'End date',
            value: 'endDate',
          },
          {
            sortable: false,
            text: 'Actions',
            value: 'actions',
          },
        ],
        items: [],
      }
    },

    computed: {
      formatedItems () {
        for (var i = 0; i < this.items.length; i++) {
          const { name, surname } = this.getDriverName(this.items[i].driverId)
          this.$set(this.items[i], 'driver', { name: name + ' ' + surname })
        }
        return JSON.parse(JSON.stringify(this.items))
      },
    },

    firestore () {
      return {
        drivers: db.collection('drivers').orderBy('name'),
      }
    },

    watch: {
      date (val) {
        db.collection('loads').where('startDate', '==', this.date).get().then(querySnapshot => {
          this.items = querySnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } })
        })
      },
    },

    beforeMount: function () {
      db.collection('loads').where('startDate', '==', this.date).get().then(querySnapshot => {
        this.items = querySnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } })
      })
    },

    methods: {
      getLatestData () {
        db.collection('loads').where('startDate', '==', this.date).get().then(querySnapshot => {
          this.items = querySnapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } })
        })
      },
      row_classes (item) {
        if (item.status === 'EMPTY') {
          return 'red'
        } else if (item.status === 'COVERED') {
          return 'green'
        } else if (item.status === 'VACATION') {
          return 'yellow'
        } else {
          return 'gray'
        }
      },
      onVacation (item) {
        this.editedIndex = item.id
        this.editedItem.driverId = item.driverId
        this.editedItem.startLocation = ''
        this.editedItem.endLocation = ''
        this.editedItem.startDate = item.startDate
        this.editedItem.endDate = ''
        this.editedItem.price = ''
        this.editedItem.distance = ''
        this.editedItem.fuel = ''
        this.editedItem.weight = ''
        this.editedItem.status = 'VACATION'
        this.updateLoad(item.id, this.editedItem)
      },
      emptyLoad (item) {
        this.editedIndex = item.id
        this.editedItem.driverId = item.driverId
        this.editedItem.startLocation = ''
        this.editedItem.endLocation = ''
        this.editedItem.startDate = item.startDate
        this.editedItem.endDate = ''
        this.editedItem.price = ''
        this.editedItem.distance = ''
        this.editedItem.fuel = ''
        this.editedItem.weight = ''
        this.editedItem.status = 'EMPTY'

        this.updateLoad(item.id, this.editedItem)
      },
      brokeDown (item) {
        this.editedIndex = item.id
        this.editedItem.driverId = item.driverId
        this.editedItem.startLocation = ''
        this.editedItem.endLocation = ''
        this.editedItem.startDate = item.startDate
        this.editedItem.endDate = ''
        this.editedItem.price = ''
        this.editedItem.distance = ''
        this.editedItem.fuel = ''
        this.editedItem.weight = ''
        this.editedItem.status = 'BROKEN'

        this.updateLoad(item.id, this.editedItem)
      },
      updateLoad (id, load) {
        db.collection('loads')
          .doc(id)
          .update(load)
          .then(() => {
            console.log('Load successfully updated!')
            this.getLatestData()
          })
          .catch((error) => {
            console.error('Load updating document: ', error)
          })
      },
      addLoadInfo (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      save () {
        this.editedItem.status = 'COVERED'
        this.$delete(this.editedItem, 'driver')
        this.updateLoad(this.editedIndex, this.editedItem)
        this.close()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      getDriverName (id) {
        return this.drivers.filter(function (elem) {
          if (elem.id === id) {
            const { name, surname } = elem
            return { name: name + ' ' + surname }
          }
        })[0]
      },
    },
  }
</script>
