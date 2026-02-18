<template>
    <div class="table-container bg-dashboard-surface border border-dashboard-border rounded-xl overflow-hidden mt-8">
        <div
            class="table-header px-5 py-4 border-b border-dashboard-border flex justify-between items-center bg-dashboard-surface/50 backdrop-blur-sm">
            <div class="table-title font-bold text-[15px]">Tous les projets</div>
            <div class="flex gap-2">
                <select v-model="filter"
                    class="bg-dashboard-bg border border-dashboard-border rounded px-2.5 py-1.5 text-xs text-dashboard-text outline-none focus:border-dashboard-accent">
                    <option value="">Tous les statuts</option>
                    <option value="sent">Devis envoyé</option>
                    <option value="signed">Devis signé</option>
                    <option value="deposit">Acompte versé</option>
                    <option value="done">Terminé</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead class="bg-dashboard-surface2/30">
                    <tr>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Client / Projet</th>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Montant</th>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Statut</th>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Pipeline</th>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Documents</th>
                        <th
                            class="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-dashboard-muted font-mono border-b border-dashboard-border">
                            Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredProjects.length === 0">
                        <td colspan="6" class="px-5 py-14 text-center">
                            <div class="text-3xl mb-3">◈</div>
                            <div class="text-dashboard-muted text-sm">
                                Aucun projet trouvé —
                                <button @click="$emit('add')"
                                    class="text-dashboard-accent font-medium hover:underline">Créer le premier</button>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="p in filteredProjects" :key="p.id"
                        class="group hover:bg-white/2 border-b border-dashboard-border/50 last:border-none transition-colors">
                        <td class="px-5 py-3.5">
                            <div class="font-bold text-sm">{{ p.client }}</div>
                            <div class="text-dashboard-muted text-[12px] mt-0.5">{{ p.name }}</div>
                        </td>
                        <td class="px-5 py-3.5">
                            <span class="font-mono text-dashboard-accent text-sm">{{ formatCurrency(p.amount) }}</span>
                        </td>
                        <td class="px-5 py-3.5">
                            <Badge :variant="getStatus(p.steps).key">{{ getStatus(p.steps).label }}</Badge>
                        </td>
                        <td class="px-5 py-3.5">
                            <Pipeline :steps="p.steps" />
                        </td>
                        <td class="px-5 py-3.5">
                            <div class="flex gap-1.5">
                                <a v-if="p.devisId" :href="`/api/attachments/${p.devisId}`" target="_blank"
                                    class="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded border border-dashboard-accent/30 text-dashboard-accent bg-dashboard-accent/5 hover:bg-dashboard-accent/10 transition-colors">
                                    📄 Devis
                                </a>
                                <span v-else
                                    class="px-2 py-1 text-[11px] rounded border border-dashboard-border text-dashboard-muted opacity-50">📄
                                    Devis</span>

                                <a v-if="p.cgvId" :href="`/api/attachments/${p.cgvId}`" target="_blank"
                                    class="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded border border-dashboard-accent/30 text-dashboard-accent bg-dashboard-accent/5 hover:bg-dashboard-accent/10 transition-colors">
                                    📋 CGV
                                </a>
                                <span v-else
                                    class="px-2 py-1 text-[11px] rounded border border-dashboard-border text-dashboard-muted opacity-50">📋
                                    CGV</span>
                            </div>
                        </td>
                        <td class="px-5 py-3.5">
                            <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="$emit('edit', p)"
                                    class="px-2 py-1 rounded border border-dashboard-border text-[11px] font-bold hover:bg-dashboard-surface2 transition-colors">
                                    ✏ Éditer
                                </button>
                                <button @click="$emit('delete', p.id)"
                                    class="px-2 py-1 rounded border border-dashboard-red/20 text-dashboard-red text-[11px] bg-dashboard-red/10 hover:bg-dashboard-red/20 transition-colors">
                                    ✕
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/composables/useProjects';

const props = defineProps<{
    projects: Project[]
}>()

const emit = defineEmits(['add', 'edit', 'delete'])

const filter = ref('')

const filteredProjects = computed(() => {
    if (!filter.value) return props.projects
    return props.projects.filter(p => getStatus(p.steps).key === filter.value)
})

const getStatus = (steps: Project['steps']) => {
    if (steps.done) return { key: 'done', label: 'Terminé' }
    if (steps.deposit) return { key: 'deposit', label: 'Acompte versé' }
    if (steps.signed) return { key: 'signed', label: 'Devis signé' }
    if (steps.sent) return { key: 'sent', label: 'Devis envoyé' }
    return { key: 'none', label: 'Non démarré' }
}

const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' €'
}
</script>
