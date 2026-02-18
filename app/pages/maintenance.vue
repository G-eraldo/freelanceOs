<template>
    <div class="page-maintenance animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="page-header flex justify-between items-center mb-8">
            <h1 class="page-title text-2xl lg:text-3xl font-extrabold tracking-tight">
                Maintenances <span class="text-dashboard-accent">✦</span>
            </h1>
        </div>

        <div
            class="table-container bg-dashboard-surface border border-dashboard-border rounded-xl overflow-hidden mt-8">
            <div
                class="table-header px-5 py-4 border-b border-dashboard-border bg-dashboard-surface/50 backdrop-blur-sm">
                <div class="table-title font-bold text-[15px]">Contrats de maintenance annuelle</div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead class="bg-dashboard-surface2/30">
                        <tr>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Client</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Projet</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Montant/an</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Expiration</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                État</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Avancement</th>
                            <th
                                class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="maintProjects.length === 0">
                            <td colspan="7" class="px-5 py-14 text-center">
                                <div class="text-3xl mb-3">⊙</div>
                                <div class="text-dashboard-muted text-sm">Aucun contrat de maintenance</div>
                            </td>
                        </tr>
                        <tr v-for="p in maintProjects" :key="p.id"
                            class="group hover:bg-white/2 border-b border-dashboard-border/50 last:border-none transition-colors">
                            <td class="px-5 py-3.5 font-bold text-sm">{{ p.client }}</td>
                            <td class="px-5 py-3.5 text-dashboard-muted text-sm">{{ p.name }}</td>
                            <td class="px-5 py-3.5">
                                <span class="font-mono text-dashboard-accent text-sm">{{ formatCurrency(p.maintAmount)
                                    }}</span>
                            </td>
                            <td class="px-5 py-3.5">
                                <span class="font-mono text-sm">{{ getMaintStatus(p.maintDate).expiryStr }}</span>
                            </td>
                            <td class="px-5 py-3.5">
                                <Badge :variant="getMaintStatus(p.maintDate).badge">{{ getMaintStatus(p.maintDate).label
                                    }}</Badge>
                            </td>
                            <td class="px-5 py-3.5 min-w-30">
                                <div
                                    class="maintenance-bar w-full h-1.5 bg-dashboard-border rounded-full overflow-hidden">
                                    <div class="maintenance-fill h-full rounded-full transition-all duration-1000"
                                        :style="{ width: `${getMaintStatus(p.maintDate).pct}%`, backgroundColor: getMaintStatus(p.maintDate).color }">
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-3.5">
                                <button @click="openEditModal(p)"
                                    class="px-2 py-1 rounded border border-dashboard-border text-[11px] font-bold hover:bg-dashboard-surface2 transition-colors whitespace-nowrap">
                                    Renouveler
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Project Modal -->
        <ProjectModal v-model="isModalOpen" :project="editingProject" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
const { projects, loadProjects, updateProject } = useProjects()

const isModalOpen = ref(false)
const editingProject = ref<any>(null)

const maintProjects = computed(() => projects.value.filter(p => p.hasMaintenance))

const getMaintStatus = (maintDate: string) => {
    if (!maintDate) return { pct: 0, label: 'N/A', badge: 'sent', color: 'var(--dashboard-muted)', expiryStr: 'N/A' }

    const paid = new Date(maintDate)
    const expiry = new Date(paid)
    expiry.setFullYear(expiry.getFullYear() + 1)
    const now = new Date()
    const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / 86400000)

    let pct = Math.max(0, Math.min(100, (daysLeft / 365) * 100))
    let badge, color
    if (daysLeft < 0) {
        badge = 'maintenance-exp'
        color = 'var(--red-dashboard)'
    } else if (daysLeft <= 60) {
        badge = 'maintenance-warn'
        color = 'var(--yellow-dashboard)'
    } else {
        badge = 'maintenance-ok'
        color = 'var(--accent-dashboard)'
    }

    const label = daysLeft < 0 ? `Expiré il y a ${Math.abs(daysLeft)}j` : `${daysLeft}j restants`
    const expiryStr = expiry.toLocaleDateString('fr-FR')

    return { daysLeft, expiryStr, pct, badge, color, label }
}

const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' €'
}

const openEditModal = (p: any) => {
    editingProject.value = p
    isModalOpen.value = true
}

const handleSave = (data: any) => {
    updateProject(data.id, data)
    isModalOpen.value = false
}

onMounted(() => {
    loadProjects()
})
</script>
