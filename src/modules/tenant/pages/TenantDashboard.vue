<template>
  <v-container fluid class="pa-6">
    <DashboardHeader />

    <DashboardStats class="mt-4" />

    <v-row class="mt-4">
      <v-col cols="12" md="9">
        <CalendarView />
      </v-col>

      <v-col cols="12" md="3">
        <TodaySummary />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import DashboardHeader from '../components/DashboardHeader.vue'
import DashboardStats from '../components/DashboardStats.vue'
import CalendarView from '../components/CalendarView.vue'
import TodaySummary from '../components/TodaySummary.vue'
</script>