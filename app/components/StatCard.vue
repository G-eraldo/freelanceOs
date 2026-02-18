<template>
    <div
        class="stat-card bg-dashboard-surface border border-dashboard-border rounded-xl p-5 relative overflow-hidden group">
        <div class="accent-line absolute top-0 left-0 right-0 h-0.5" :style="{ backgroundColor: accentColor }"></div>
        <div class="stat-label text-[11px] uppercase tracking-[0.12em] text-dashboard-muted font-mono mb-2">
            {{ label }}
        </div>
        <div
            class="stat-value text-[28px] font-extrabold tracking-tight group-hover:text-dashboard-accent transition-colors">
            {{ value }}
        </div>
        <div class="stat-sub text-[12px] text-dashboard-muted mt-1">
            {{ subLabel }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number],
    subLabel: String,
    accentColor: {
        type: String,
        default: 'var(--accent-dashboard)'
    }
})
</script>
