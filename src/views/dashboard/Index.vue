<template>
  <v-app v-if="!hasCookie">
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <dashboard-core-settings />
  </v-app>
  <v-app v-else>
    <log-in />
  </v-app>
</template>

<script>
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
      LogIn: () => import('../../views/dashboard/LogIn'),
    },

    data: () => ({
      expandOnHover: false,
      hasCookie: false,
    }),

    beforeMount: function () {
      console.log(this.hasCookie)
    },
  }
</script>
