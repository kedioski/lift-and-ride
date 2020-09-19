<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col>
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
              v-model="startDateFilter"
              label="Start date"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="startDateFilter"
            @input="menuStart = false"
          />
        </v-menu>
        <br>
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
              v-model="endDateFilter"
              label="Start date"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="endDateFilter"
            @input="menuEnd = false"
          />
        </v-menu>
        <br>
        <div
          v-if="selected.length"
          class="my-2"
        >
          <v-btn
            color="primary"
            @click="exportPDF"
          >
            Report trosok
          </v-btn>
          <v-btn color="primary">
            Report prihod
          </v-btn>
          <v-btn color="primary">
            Report both
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <base-material-card
          color="primary"
          class="px-5 py-3 primary"
        >
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Tours
            </div>
          </template>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="formatedItems"
              :single-select="singleSelect"
              item-key="id"
              show-select
              class="elevation-1"
            >
              <template v-slot:top>
                <v-switch
                  v-model="singleSelect"
                  label="Disable select all"
                  class="pa-3"
                />
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
  import jsPDF from 'jspdf'
  import 'jspdf-autotable'

  export default {
    name: 'Finance',

    data () {
      return {
        singleSelect: false,
        selected: [],
        startDateFilter: new Date().toISOString().substr(0, 10),
        endDateFilter: new Date().toISOString().substr(0, 10),
        menuStart: false,
        menuEnd: false,
        dialog: false,
        editedIndex: -1,
        editedItem: {
          driverName: '',
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
        headers: [
          {
            sortable: false,
            text: 'Driver name',
            value: 'driver',
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
            text: 'Distance',
            value: 'distance',
          },
          {
            sortable: false,
            text: 'Price',
            value: 'price',
          },
          {
            sortable: false,
            text: 'Weight',
            value: 'weight',
          },
          {
            sortable: false,
            text: 'Fuel',
            value: 'fuel',
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
        ],
        items: [],
        drivers: [],
      }
    },

    computed: {
      formatedItems () {
        for (var i = 0; i < this.items.length; i++) {
          const { name, surname } = this.getDriverName(this.items[i].driverId)
          this.$set(this.items[i], 'driver', name + ' ' + surname)
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
      startDateFilter (val) {
        db.collection('loads').where('endDate', '>=', this.startDateFilter).where('endDate', '<=', this.endDateFilter).where('status', '==', 'COVERED').get().then(querySnapshot => {
          this.items = querySnapshot.docs.map(doc => doc.data())
        })
      },
      endDateFilter (val) {
        db.collection('loads').where('endDate', '>=', this.startDateFilter).where('endDate', '<=', this.endDateFilter).where('status', '==', 'COVERED').get().then(querySnapshot => {
          this.items = querySnapshot.docs.map(doc => doc.data())
        })
      },
    },

    methods: {
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
        this.editedIndex = this.items.indexOf(item)
        item.startLocation = ''
        item.endLocation = ''
        item.startDate = ''
        item.endDate = ''
        item.price = ''
        item.distance = ''
        item.fuel = ''
        item.weight = ''
        item.status = 'VACATION'
      },
      emptyTour (item) {
        this.editedIndex = this.items.indexOf(item)
        item.startLocation = ''
        item.endLocation = ''
        item.startDate = ''
        item.endDate = ''
        item.price = ''
        item.distance = ''
        item.fuel = ''
        item.weight = ''
        item.status = 'EMPTY'
      },
      brokeDown (item) {
        this.editedIndex = this.items.indexOf(item)
        item.startLocation = ''
        item.endLocation = ''
        item.startDate = ''
        item.endDate = ''
        item.price = ''
        item.distance = ''
        item.fuel = ''
        item.weight = ''
        item.status = 'BROKEN'
      },
      addTourInfo (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      save () {
        this.editedItem.status = 'COVERED'
        Object.assign(this.items[this.editedIndex], this.editedItem)
        this.close()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      exportPDF () {
        var vm = this
        var columns = [
          { title: 'Driver name', dataKey: 'driver' },
          { title: 'Start Location', dataKey: 'startLocation' },
          { title: 'End Location', dataKey: 'endLocation' },
          { title: 'Distance (miles)', dataKey: 'distance' },
          { title: 'Price ($)', dataKey: 'price' },
          { title: 'Weight (kg)', dataKey: 'weight' },
          { title: 'Fuel (l)', dataKey: 'fuel' },
          { title: 'Start Date', dataKey: 'startDate' },
          { title: 'End Date', dataKey: 'endDate' },
        ]
        /* eslint-disable new-cap */
        const doc = new jsPDF('l', 'pt')
        doc.text('Loads', 40, 40)
        doc.autoTable(columns, vm.selected, {
          margin: { top: 60 },
        })

        const finalY = doc.lastAutoTable.finalY
        doc.setFontSize(12)
        doc.text(40, finalY + 30, 'Total price: ' + this.totalPrice(vm.selected))
        doc.save('loads' + new Date() + '.pdf')
      },
      totalPrice (list) {
        var sum = 0
        list.forEach(e => {
          sum += Number(e.price)
        })
        return sum + ' $'
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
