<template>
  <Menu />
  <RouterView />

  <!-- Alerta / Modal Personalizado Global -->
  <Transition name="fade-scale">
    <div v-if="alertaVisible" class="custom-modal-overlay" @click.self="cerrarAlerta">
      <div class="custom-modal-card animate-card" :class="alertaTipo">
        <div class="custom-modal-header">
          <h5 class="m-0">{{ alertaTitulo }}</h5>
          <button class="btn-close-custom" @click="cerrarAlerta">&times;</button>
        </div>
        <div class="custom-modal-body">
          <p class="m-0">{{ alertaMensaje }}</p>
        </div>
        <div class="custom-modal-footer">
          <button class="btn btn-custom-alert" @click="cerrarAlerta">Aceptar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Menu from './components/Menu.vue'
import {
  alertaVisible,
  alertaTitulo,
  alertaMensaje,
  alertaTipo,
  cerrarAlerta
} from './services/alertService'
</script>