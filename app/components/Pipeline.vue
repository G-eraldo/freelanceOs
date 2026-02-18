<template>
    <div class="pipeline flex gap-1 items-center" :title="title">
        <div v-for="i in 4" :key="i" class="step w-7 h-1.5 rounded-sm transition-colors" :class="[
            i <= activeSteps ? 'bg-dashboard-accent' : 'bg-dashboard-border'
        ]"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    steps: {
        type: Object,
        required: true
    }
})

const activeSteps = computed(() => {
    if (props.steps.done) return 4
    if (props.steps.deposit) return 3
    if (props.steps.signed) return 2
    if (props.steps.sent) return 1
    return 0
})

const title = "Envoyé → Signé → Acompte → Terminé"
</script>
