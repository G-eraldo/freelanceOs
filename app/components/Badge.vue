<template>
    <span
        class="badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono whitespace-nowrap before:content-[''] before:w-1.25 before:h-1.25 before:rounded-full before:bg-current"
        :class="variantClasses">
        <slot />
    </span>
</template>

<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: 'sent' // sent, signed, deposit, done, maintenance-ok, maintenance-exp, maintenance-warn
    }
})

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'sent': return 'bg-[rgba(255,179,71,0.15)] text-dashboard-yellow'
        case 'signed': return 'bg-[rgba(167,139,250,0.15)] text-dashboard-purple'
        case 'deposit': return 'bg-[rgba(79,255,176,0.15)] text-dashboard-green'
        case 'done': return 'bg-[rgba(79,255,176,0.2)] text-dashboard-green'
        case 'maintenance-ok': return 'bg-[rgba(79,255,176,0.15)] text-dashboard-green'
        case 'maintenance-exp': return 'bg-[rgba(255,107,107,0.15)] text-dashboard-red'
        case 'maintenance-warn': return 'bg-[rgba(255,179,71,0.15)] text-dashboard-yellow'
        default: return 'bg-dashboard-surface2 text-dashboard-muted'
    }
})
</script>
