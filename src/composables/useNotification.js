// src/composables/useNotification.js
import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  /**
   * Mostrar notificación
   * @param {Object} options - { type, title, message, duration }
   */
  function show({ type = 'info', title = '', message = '', duration = 3000 }) {
    const id = ++notificationId
    
    const notification = {
      id,
      type, // success, error, warning, info
      title,
      message,
      visible: true,
    }
    
    notifications.value.push(notification)
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }
  
  /**
   * Remover notificación
   */
  function remove(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  /**
   * Helpers específicos
   */
  const success = (message, title = 'Éxito') => {
    return show({ type: 'success', title, message })
  }
  
  const error = (message, title = 'Error') => {
    return show({ type: 'error', title, message, duration: 5000 })
  }
  
  const warning = (message, title = 'Advertencia') => {
    return show({ type: 'warning', title, message })
  }
  
  const info = (message, title = 'Información') => {
    return show({ type: 'info', title, message })
  }
  
  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}