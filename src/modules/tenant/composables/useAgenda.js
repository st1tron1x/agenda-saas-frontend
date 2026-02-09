import { ref, computed } from 'vue'

const appointments = ref([])

export function useAgenda() {
  const totalToday = computed(() =>
    appointments.value.filter(a => a.date === today()).length
  )

  const byStatus = computed(() => {
    return appointments.value.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    }, {})
  })

  return {
    appointments,
    totalToday,
    byStatus,
  }
}

function today() {
  return new Date().toISOString().split('T')[0]
}