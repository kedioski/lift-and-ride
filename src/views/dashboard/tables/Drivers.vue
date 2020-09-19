<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Drivers"
      class="px-5 py-3 primary"
    >
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        :item-class="row_classes"
        hide-default-footer
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
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New driver
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.surname"
                          label="Surname"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="12"
                      >
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.phone"
                          label="Phone number"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.truckNumber"
                          label="truck number"
                          required
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
            v-if="item.status == 0"
            small
            title="Edit"
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="item.status == 0"
            small
            title="Delete"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import { db } from '../../../main'
  import moment from 'moment'

  export default {
    name: 'Drivers',
    data () {
      return {
        dialog: false,
        editedIndex: -1,
        menuStart: false,
        menuEnd: false,
        editedItem: {
          name: '',
          surname: '',
          email: '',
          phone: '',
          truckNumber: '',
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
          status: 0,
        },
        defaultItem: {
          name: '',
          surname: '',
          email: '',
          phone: '',
          truckNumber: '',
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
          status: 0,
        },
        headers: [
          {
            sortable: false,
            text: 'Name',
            value: 'name',
          },
          {
            sortable: false,
            text: 'Surname',
            value: 'surname',
          },
          {
            sortable: false,
            text: 'E-mail',
            value: 'email',
          },
          {
            sortable: false,
            text: 'Phone number',
            value: 'phone',
          },
          {
            sortable: false,
            text: 'Truck number',
            value: 'truckNumber',
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
      formTitle () {
        return this.editedIndex === -1 ? 'New driver' : 'Edit driver info'
      },
      dateChangeEnabled () {
        return this.editedIndex === -1
      },
    },

    methods: {
      row_classes (item) {
        if (item.status === 0) {
          return 'gray'
        } else {
          return 'yellow'
        }
      },
      editItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.$confirm('Are you sure you want to delete this driver?').then(() => {
          this.deleteDriverTours(item)
          this.deleteDriver(item)
        })
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex !== -1) {
          this.updateDriver(this.editedIndex, this.editedItem)
        } else {
          this.createNewDriver(this.editedItem)
        }
        this.close()
      },
      createNewDriver (driver) {
        db.collection('drivers')
          .add(driver)
          .then((createdDriver) => {
            const savedDriver = this.items.filter(function (elem) {
              if (elem.id === createdDriver.id) {
                return elem
              }
            })[0]
            this.createNewLoads(savedDriver)
          })
          .catch((error) => {
            console.error('Driver writing document: ', error)
          })
      },
      updateDriver (id, driver) {
        db.collection('drivers')
          .doc(id)
          .update(driver)
          .then(() => {
            console.log('Driver successfully updated!')
          })
          .catch((error) => {
            console.error('Driver updating document: ', error)
          })
      },
      createNewLoads (driver) {
        var currentDate = moment(driver.startDate)
        const stopDate = moment(driver.endDate)
        while (currentDate <= stopDate) {
          const formatedDate = moment(currentDate).format('YYYY-MM-DD')
          const load = {
            startDate: formatedDate,
            endDate: '',
            driverId: driver.id,
            startLocation: '',
            endLocation: '',
            distance: '',
            price: '',
            weight: '',
            fuel: '',
            status: 'EMPTY',
          }

          db.collection('loads')
            .add(load)
            .then(() => {
              console.log('Load successfully written!')
            })
            .catch((error) => {
              console.error('Load writing document: ', error)
            })

          currentDate = moment(currentDate).add(1, 'days')
        }
      },
      deleteDriver (driver) {
        const archivedDriver = { ...driver, status: 1 }
        db.collection('drivers')
          .doc(driver.id)
          .update(archivedDriver)
          .then(() => {
            console.log('Driver successfully archived!')
          })
          .catch((error) => {
            console.error('Archived driver document: ', error)
          })
      },
      deleteDriverTours (driver) {
        const currentDate = new Date().toISOString().substr(0, 10)
        db.collection('loads').where('driverId', '==', driver.id).where('startDate', '>=', currentDate).get().then(querySnapshot => {
          const loadsDelete = querySnapshot.docs
          const batch = db.batch()
          loadsDelete.forEach(doc => {
            batch.delete(doc.ref)
          })
          batch.commit()
        })
      },
    },
    firestore () {
      return {
        items: db.collection('drivers').orderBy('name'),
      }
    },
  }
</script>
