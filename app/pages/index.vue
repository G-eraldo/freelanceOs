<template>
    <div class="page-dashboard animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="page-header flex flex-wrap justify-between items-center mb-8 gap-3">
            <div>
                <h1 class="page-title text-2xl lg:text-3xl font-extrabold tracking-tight">
                    Vue d'ensemble <span class="text-dashboard-accent">✦</span>
                </h1>
                <div class="text-dashboard-muted text-[13px] mt-1 font-mono uppercase">
                    {{ today }}
                </div>
            </div>
            <button @click="isModalOpen = true; editingProject = null"
                class="px-5 py-2.5 bg-dashboard-accent text-dashboard-bg rounded-lg text-sm font-bold hover:bg-[#6fffbe] -translate-y-px transition-all shadow-lg shadow-dashboard-accent/10">
                + Nouveau projet
            </button>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Projets actifs" :value="activeProjectsCount" sub-label="en cours"
                accent-color="var(--accent-dashboard)" />
            <StatCard label="CA Total" :value="formatCurrency(totalCA)" sub-label="devis signés"
                accent-color="var(--purple-dashboard)" />
            <StatCard label="En attente" :value="formatCurrency(pendingCA)" sub-label="devis envoyés"
                accent-color="var(--yellow-dashboard)" />
            <StatCard label="Maintenances" :value="maintenanceExpiringCount" sub-label="expirent bientôt"
                accent-color="var(--red-dashboard)" />
        </div>

        <!-- Projects Table -->
        <ProjectTable :projects="projects" @add="isModalOpen = true; editingProject = null" @edit="openEditModal"
            @delete="deleteProject" />

        <!-- Project Modal -->
        <ProjectModal v-model="isModalOpen" :project="editingProject" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
const {
    projects,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    activeProjectsCount,
    totalCA,
    pendingCA,
    maintenanceExpiringCount
} = useProjects()

const isModalOpen = ref(false)
const editingProject = ref<any>(null)

const today = computed(() => {
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date())
})

const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' €'
}

const openEditModal = (p: any) => {
    editingProject.value = p
    isModalOpen.value = true
}

const handleSave = (data: any) => {
    if (data.id) {
        updateProject(data.id, data)
    } else {
        addProject(data)
    }
    isModalOpen.value = false
}

onMounted(() => {
    loadProjects()
})
</script>