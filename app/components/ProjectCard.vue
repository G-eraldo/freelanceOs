<template>
    <div
        class="project-card bg-dashboard-surface border border-dashboard-border rounded-xl p-5 relative overflow-hidden transition-all hover:border-dashboard-accent/30 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30 group">
        <div
            class="accent-line absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-dashboard-accent to-dashboard-accent2">
        </div>

        <div class="project-name font-bold text-base mb-1">{{ p.name }}</div>
        <div class="project-client text-[13px] text-dashboard-muted mb-3.5 flex items-center gap-1.5">
            <span class="text-[10px]">◈</span> {{ p.client }}
        </div>

        <div class="project-meta flex justify-between items-center mb-3">
            <div class="project-amount font-mono text-[18px] font-medium text-dashboard-accent">
                {{ formatCurrency(p.amount) }}
            </div>
            <Badge :variant="getStatus(p.steps).key">{{ getStatus(p.steps).label }}</Badge>
        </div>

        <Pipeline :steps="p.steps" class="mb-3" />

        <div class="doc-links flex flex-wrap gap-2 mb-3.5">
            <a v-if="p.devisId" :href="`/api/attachments/${p.devisId}`" target="_blank"
                class="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded border border-dashboard-accent/30 text-dashboard-accent bg-dashboard-accent/5 hover:bg-dashboard-accent/10 transition-colors">
                📄 Devis signé
            </a>
            <button v-else @click="$emit('edit', p)"
                class="px-2 py-1 text-[11px] rounded border border-dashboard-border text-dashboard-muted hover:border-dashboard-accent hover:text-dashboard-accent transition-colors">
                📄 + Devis
            </button>

            <a v-if="p.cgvId" :href="`/api/attachments/${p.cgvId}`" target="_blank"
                class="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded border border-dashboard-accent/30 text-dashboard-accent bg-dashboard-accent/5 hover:bg-dashboard-accent/10 transition-colors">
                📋 CGV/Contrat
            </a>
            <button v-else @click="$emit('edit', p)"
                class="px-2 py-1 text-[11px] rounded border border-dashboard-border text-dashboard-muted hover:border-dashboard-accent hover:text-dashboard-accent transition-colors">
                📋 + CGV
            </button>
        </div>

        <div v-if="p.tags?.length" class="project-tags flex flex-wrap gap-1.5 mt-3">
            <span v-for="t in p.tags.slice(0, 4)" :key="t"
                class="tag text-[11px] px-2 py-0.75 rounded bg-dashboard-surface2 text-dashboard-muted font-mono">
                {{ t }}
            </span>
        </div>

        <div class="mt-4 flex gap-2 pt-3 border-t border-dashboard-border/50">
            <button @click="$emit('edit', p)"
                class="flex-1 px-3 py-1.5 rounded border border-dashboard-border text-[12px] font-bold hover:bg-dashboard-surface2 transition-colors">
                ✏ Éditer
            </button>
            <button @click="$emit('delete', p.id)"
                class="px-3 py-1.5 rounded border border-dashboard-red/20 text-dashboard-red text-[12px] bg-dashboard-red/10 hover:bg-dashboard-red/20 transition-colors">
                ✕
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/composables/useProjects';

const props = defineProps<{
    p: Project
}>()

defineEmits(['edit', 'delete'])

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
