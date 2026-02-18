<template>
    <div class="page-projects animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="page-header flex justify-between items-center mb-8">
            <h1 class="page-title text-2xl lg:text-3xl font-extrabold tracking-tight">
                Projets <span class="text-dashboard-accent">✦</span>
            </h1>
            <button @click="isModalOpen = true; editingProject = null"
                class="px-5 py-2.5 bg-dashboard-accent text-dashboard-bg rounded-lg text-sm font-bold hover:bg-[#6fffbe] -translate-y-px transition-all">
                + Nouveau projet
            </button>
        </div>

        <div v-if="projects.length === 0" class="empty col-span-full py-20 text-center text-dashboard-muted">
            <div class="text-5xl mb-3">⬡</div>
            <div class="text-base text-dashboard-muted">Aucun projet pour l'instant</div>
        </div>

        <div v-else class="projects-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <ProjectCard v-for="p in projects" :key="p.id" :p="p" @edit="openEditModal" @delete="deleteProject" />
        </div>

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
    deleteProject
} = useProjects()

const isModalOpen = ref(false)
const editingProject = ref<any>(null)

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
