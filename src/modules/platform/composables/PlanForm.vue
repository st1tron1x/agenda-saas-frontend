<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? 'Editar Plan' : 'Nuevo Plan' }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="plan-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre del Plan *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Ej: Plan Pro"
            />
          </div>

          <div class="form-group">
            <label for="status">Estado *</label>
            <select id="status" v-model="formData.status" required>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            placeholder="Describe el plan..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Precio *</label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div class="form-group">
            <label for="period">Período *</label>
            <select id="period" v-model="formData.period" required>
              <option value="mes">Mensual</option>
              <option value="año">Anual</option>
              <option value="día">Diario</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.featured"
            />
            Plan destacado
          </label>
        </div>

        <div class="form-group">
          <label>Características</label>
          <div class="features-list">
            <div
              v-for="(feature, index) in formData.features"
              :key="index"
              class="feature-item"
            >
              <input
                v-model="formData.features[index]"
                type="text"
                placeholder="Característica..."
              />
              <button
                type="button"
                @click="removeFeature(index)"
                class="btn-remove"
              >
                &times;
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addFeature"
            class="btn-add-feature"
          >
            + Agregar característica
          </button>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-submit">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Plan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'PlanForm',
  props: {
    plan: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      description: '',
      price: 0,
      period: 'mes',
      status: 'active',
      featured: false,
      features: ['']
    })

    const isEditing = computed(() => !!props.plan)

    // Inicializar formulario si estamos editando
    watch(() => props.plan, (newPlan) => {
      if (newPlan) {
        formData.value = {
          ...newPlan,
          features: [...newPlan.features]
        }
      }
    }, { immediate: true })

    const addFeature = () => {
      formData.value.features.push('')
    }

    const removeFeature = (index) => {
      formData.value.features.splice(index, 1)
    }

    const handleSubmit = () => {
      // Filtrar características vacías
      const cleanedData = {
        ...formData.value,
        features: formData.value.features.filter(f => f.trim() !== '')
      }

      emit('save', cleanedData)
    }

    return {
      formData,
      isEditing,
      addFeature,
      removeFeature,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #2c3e50;
}

.plan-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal !important;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.feature-item {
  display: flex;
  gap: 8px;
}

.feature-item input {
  flex: 1;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #c82333;
}

.btn-add-feature {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px dashed #6c757d;
  border-radius: 6px;
  color: #495057;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-add-feature:hover {
  background: #e9ecef;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel,
.btn-submit {
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-submit {
  background: #667eea;
  border: none;
  color: white;
}

.btn-submit:hover {
  background: #5568d3;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>