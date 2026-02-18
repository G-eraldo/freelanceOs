<template>
  <div
    class="layout grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-screen bg-dashboard-bg text-dashboard-text font-sans">
    <!-- Sidebar (Desktop) -->
    <aside
      class="sidebar hidden lg:flex flex-col sticky top-0 h-screen bg-dashboard-surface border-r border-dashboard-border py-7">
      <div class="logo px-6 pb-7 border-b border-dashboard-border mb-5">
        <div
          class="logo-text font-mono text-[13px] color-dashboard-accent tracking-[0.15em] uppercase text-dashboard-accent">
          ⬡ FreelanceOS
        </div>
        <div class="logo-sub text-[11px] text-dashboard-muted mt-0.75 font-mono">
          // Dashboard v1.0
        </div>
      </div>

      <nav class="nav px-3 flex-1">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium text-dashboard-muted transition-all mb-0.5 hover:bg-dashboard-surface2 hover:text-dashboard-text"
          active-class="!bg-[rgba(79,255,176,0.1)] !text-dashboard-accent">
          <span class="icon w-4.5 text-center text-[16px]">{{ item.icon }}</span>
          {{ item.label }}
          <span v-if="item.id === 'maintenance' && hasMaintenanceNotif"
            class="notif w-1.75 h-1.75 rounded-full bg-dashboard-red ml-1 animate-pulse"></span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main p-8 lg:p-10 overflow-y-auto pb-24 lg:pb-10">
      <slot />
    </main>

    <!-- Mobile Bottom Nav -->
    <nav
      class="mobile-nav lg:hidden fixed bottom-0 left-0 right-0 bg-dashboard-surface border-t border-dashboard-border z-100 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
      <div class="mobile-nav-inner flex justify-around">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="mobile-nav-item flex flex-col items-center gap-0.5 px-3 py-1.5 text-dashboard-muted text-[10px] font-semibold font-mono uppercase tracking-[0.06em] transition-colors rounded-lg relative"
          active-class="!text-dashboard-accent">
          <span class="mni-icon text-[20px] leading-none">{{ item.icon }}</span>
          <span>{{ item.mobileLabel || item.label }}</span>
          <span v-if="item.id === 'maintenance' && hasMaintenanceNotif"
            class="mni-notif absolute top-1 right-2 w-1.75 h-1.75 rounded-full bg-dashboard-red animate-pulse"></span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
const navItems = [
  { id: 'dashboard', to: '/', label: 'Vue d\'ensemble', mobileLabel: 'Accueil', icon: '◈' },
  { id: 'projects', to: '/projects', label: 'Projets', mobileLabel: 'Projets', icon: '⬡' },
  { id: 'maintenance', to: '/maintenance', label: 'Maintenances', mobileLabel: 'Maint.', icon: '⊙' },
  { id: 'tax', to: '/tax', label: 'Calculateur Fiscal', mobileLabel: 'Fiscal', icon: '◎' },
]

// This will be replaced by actual logic from useProjects later
const hasMaintenanceNotif = ref(false)
</script>

<style scoped>
/* Any layout specific styles if needed, but trying to use Tailwind as much as possible */
</style>