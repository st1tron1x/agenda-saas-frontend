// src/services/emailService.js
/**
 * Email Notification Service
 * Handles sending branded emails with appointment information
 * Integrates with Google SMTP and tenant branding settings
 */

import api from './api'

class EmailService {
  /**
   * Send appointment confirmation email
   * @param {Object} appointment - Appointment data
   * @param {Object} tenant - Tenant branding data
   */
  async sendAppointmentConfirmation(appointment, tenant) {
    try {
      const emailData = {
        to: appointment.client.email,
        subject: `Confirmación de Cita - ${tenant.business_name}`,
        template: 'appointment_confirmation',
        data: {
          client_name: appointment.client.name,
          service_name: appointment.service.name,
          staff_name: appointment.staff.name,
          appointment_date: this.formatDate(appointment.date),
          appointment_time: this.formatTime(appointment.time),
          duration: appointment.duration,
          price: appointment.price,
          address: tenant.address,
          phone: tenant.phone,
          business_name: tenant.business_name,
          logo_url: tenant.logo_url,
          primary_color: tenant.brand_color || '#6366F1',
          confirmation_url: this.getConfirmationUrl(appointment.id, 'accept'),
          reschedule_url: this.getConfirmationUrl(appointment.id, 'reschedule'),
          cancel_url: this.getConfirmationUrl(appointment.id, 'cancel'),
        },
      }

      const response = await api.post('/notifications/send-email', emailData)
      return response.data
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      throw error
    }
  }

  /**
   * Send appointment reminder email
   * @param {Object} appointment - Appointment data
   * @param {Object} tenant - Tenant branding data
   */
  async sendAppointmentReminder(appointment, tenant) {
    try {
      const emailData = {
        to: appointment.client.email,
        subject: `Recordatorio de Cita - ${tenant.business_name}`,
        template: 'appointment_reminder',
        data: {
          client_name: appointment.client.name,
          service_name: appointment.service.name,
          staff_name: appointment.staff.name,
          appointment_date: this.formatDate(appointment.date),
          appointment_time: this.formatTime(appointment.time),
          address: tenant.address,
          business_name: tenant.business_name,
          logo_url: tenant.logo_url,
          primary_color: tenant.brand_color || '#6366F1',
          phone: tenant.phone,
        },
      }

      const response = await api.post('/notifications/send-email', emailData)
      return response.data
    } catch (error) {
      console.error('Error sending reminder email:', error)
      throw error
    }
  }

  /**
   * Send appointment cancellation email
   * @param {Object} appointment - Appointment data
   * @param {Object} tenant - Tenant branding data
   * @param {string} reason - Cancellation reason
   */
  async sendAppointmentCancellation(appointment, tenant, reason = '') {
    try {
      const emailData = {
        to: appointment.client.email,
        subject: `Cita Cancelada - ${tenant.business_name}`,
        template: 'appointment_cancellation',
        data: {
          client_name: appointment.client.name,
          service_name: appointment.service.name,
          appointment_date: this.formatDate(appointment.date),
          appointment_time: this.formatTime(appointment.time),
          reason: reason,
          business_name: tenant.business_name,
          logo_url: tenant.logo_url,
          primary_color: tenant.brand_color || '#6366F1',
          phone: tenant.phone,
          rebooking_url: tenant.booking_url,
        },
      }

      const response = await api.post('/notifications/send-email', emailData)
      return response.data
    } catch (error) {
      console.error('Error sending cancellation email:', error)
      throw error
    }
  }

  /**
   * Send reschedule request to admin via WhatsApp
   * @param {Object} appointment - Appointment data
   * @param {string} adminPhone - Admin WhatsApp number
   */
  async sendRescheduleRequest(appointment, adminPhone) {
    try {
      const message = `🔄 Solicitud de Reprogramación\n\nCliente: ${appointment.client.name}\nServicio: ${appointment.service.name}\nFecha actual: ${this.formatDate(appointment.date)} ${this.formatTime(appointment.time)}\n\nEl cliente ha solicitado reprogramar su cita. Por favor contáctelo a: ${appointment.client.phone}`

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`

      // Log the request (in production, this would trigger actual WhatsApp notification)
      await api.post('/notifications/reschedule-request', {
        appointment_id: appointment.id,
        admin_phone: adminPhone,
        message: message,
        whatsapp_url: whatsappUrl,
      })

      return { success: true, whatsapp_url: whatsappUrl }
    } catch (error) {
      console.error('Error sending reschedule request:', error)
      throw error
    }
  }

  /**
   * Generate confirmation URL with action token
   * @param {number} appointmentId - Appointment ID
   * @param {string} action - Action type (accept, reschedule, cancel)
   */
  getConfirmationUrl(appointmentId, action) {
    const baseUrl = window.location.origin
    // In production, this should generate a secure token
    const token = btoa(`${appointmentId}:${action}:${Date.now()}`)
    return `${baseUrl}/appointment-action?token=${token}&action=${action}`
  }

  /**
   * Format date for display
   * @param {string} date - Date string
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Format time for display
   * @param {string} time - Time string
   */
  formatTime(time) {
    return time
  }

  /**
   * Test email configuration
   * @param {string} email - Test email address
   */
  async testEmailConfiguration(email) {
    try {
      const response = await api.post('/notifications/test-email', {
        to: email,
      })
      return response.data
    } catch (error) {
      console.error('Error testing email configuration:', error)
      throw error
    }
  }
}

export default new EmailService()