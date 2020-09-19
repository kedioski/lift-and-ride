<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Users"
      class="px-5 py-3 primary"
    >
      <v-data-table
        :headers="headers"
        :items="users"
        hide-default-footer
      />
    </base-material-card>
  </v-container>
</template>

<script>
  import { db } from '../../../main'

  export default {
    name: 'Users',
    data () {
      return {
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
            text: 'Username',
            value: 'username',
          },
        ],
        users: [],
      }
    },
    firestore () {
      return {
        users: db.collection('users').orderBy('name'),
      }
    },
  }
</script>
