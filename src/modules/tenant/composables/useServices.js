export function useServices() {
  const services = ref([])

  function getServiceName(id) {
    return services.value.find(s => s.id === id)?.name || 'Servicio eliminado'
  }

  return { services, getServiceName }
}