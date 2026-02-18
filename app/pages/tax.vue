<template>
    <div class="page-tax animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="page-header mb-8">
            <h1 class="page-title text-2xl lg:text-3xl font-extrabold tracking-tight">
                Calculateur Fiscal <span class="text-dashboard-accent">✦</span>
            </h1>
        </div>

        <div class="tax-container grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Input Card -->
            <div class="tax-card bg-dashboard-surface border border-dashboard-border rounded-xl p-6">
                <div class="tax-card-title text-[15px] font-bold mb-5 flex items-center gap-2">
                    📊 Simulateur Micro-Entreprise
                </div>

                <div class="form-grid flex flex-col gap-4">
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">
                            Chiffre d'affaires mensuel
                        </label>
                        <div class="relative">
                            <input v-model.number="amount" type="number" placeholder="0" class="input pr-9">
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted font-mono">€</span>
                        </div>
                    </div>

                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Micro-entrepreneur
                            (BIC Service)</label>
                        <div
                            class="text-[13px] text-dashboard-text bg-dashboard-bg border border-dashboard-border rounded-lg px-3.5 py-2.5 opacity-80 select-none">
                            Prestations de services — 22% + 2,2% (VFL)
                        </div>
                    </div>
                </div>

                <div class="seuil-container mt-6">
                    <div class="flex justify-between mb-1.5">
                        <span
                            class="text-[12px] font-bold uppercase tracking-wider text-dashboard-muted font-mono">Seuil
                            micro-entreprise</span>
                        <span class="text-[12px] font-mono text-dashboard-muted">
                            {{ formatCurrency(annualCA) }} / {{ formatCurrency(seuil) }}
                        </span>
                    </div>
                    <div class="seuil-bar h-2 bg-dashboard-border rounded-full overflow-hidden">
                        <div class="seuil-fill h-full rounded-full transition-all duration-500" :class="seuilClass"
                            :style="{ width: `${seuilProgress}%` }"></div>
                    </div>
                    <div class="text-[11px] text-dashboard-muted mt-2">
                        {{ seuilMsg }}
                    </div>
                </div>
            </div>

            <!-- Result Card -->
            <div class="flex flex-col gap-6">
                <div class="tax-card bg-dashboard-surface border border-dashboard-border rounded-xl p-6">
                    <div class="tax-card-title text-[15px] font-bold mb-5 flex items-center gap-2">
                        💰 Résultat de simulation
                    </div>

                    <div class="tax-result bg-dashboard-bg border border-dashboard-border rounded-xl p-4 flex flex-col">
                        <div class="tax-row flex justify-between py-2 text-sm border-b border-dashboard-border/50">
                            <span class="text-dashboard-muted">CA brut /mois</span>
                            <span>{{ formatCurrency(amount) }}</span>
                        </div>
                        <div class="tax-row flex justify-between py-2 text-sm border-b border-dashboard-border/50">
                            <span class="text-dashboard-muted">Cotisations sociales (22%)</span>
                            <span class="text-dashboard-red">- {{ formatCurrency(cotisations / 12) }}</span>
                        </div>
                        <div class="tax-row flex justify-between py-2 text-sm border-b border-dashboard-border/50">
                            <span class="text-dashboard-muted">Versement libératoire (2.2%)</span>
                            <span class="text-dashboard-red">- {{ formatCurrency(vflAmount / 12) }}</span>
                        </div>
                        <div class="tax-row flex justify-between py-3 text-base font-bold">
                            <span>Net estimé /mois</span>
                            <span class="text-dashboard-accent">{{ formatCurrency(net) }}</span>
                        </div>
                        <div class="tax-row flex justify-between py-2 text-sm border-t border-dashboard-border/50">
                            <span class="text-dashboard-muted">Net /an</span>
                            <span class="text-dashboard-purple">{{ formatCurrency(netAnnual) }}</span>
                        </div>
                    </div>
                </div>

                <div class="tax-card bg-dashboard-surface border border-dashboard-border rounded-xl p-6">
                    <div class="tax-card-title text-[15px] font-bold mb-5 flex items-center gap-2">
                        🎯 Tarifs conseillés
                    </div>
                    <div
                        class="tax-result bg-dashboard-bg border border-dashboard-border rounded-xl p-4 flex flex-col gap-3">
                        <div class="tax-row flex justify-between text-sm">
                            <span class="text-dashboard-muted">TJM conseillé (80% dispo)</span>
                            <span class="text-dashboard-accent font-bold">{{ Math.round(tjm) }} €/j</span>
                        </div>
                        <div class="tax-row flex justify-between text-sm">
                            <span class="text-dashboard-muted">Taux horaire (7h/j)</span>
                            <span class="text-dashboard-accent font-bold">{{ Math.round(tjm / 7) }} €/h</span>
                        </div>
                        <div class="tax-row flex justify-between text-sm">
                            <span class="text-dashboard-muted">Tarif mensuel forfait</span>
                            <span class="text-dashboard-purple font-bold">{{ formatCurrency(amount) }}
                                /mois</span>
                        </div>
                    </div>
                    <div class="text-[11px] text-dashboard-muted mt-3 font-mono leading-relaxed">
                        * Basé sur 220 j/an, 80% facturables = ~176 j<br>
                        * Versement libératoire de l'impôt inclus d'office
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTax } from '~/composables/useTax';

const {
    amount,
    annualCA,
    cotisations,
    vflAmount,
    net,
    netAnnual,
    seuil,
    seuilProgress,
    tjm
} = useTax()

const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0) + ' €'
}

const seuilClass = computed(() => {
    if (seuilProgress.value >= 100) return 'bg-dashboard-red'
    if (seuilProgress.value >= 80) return 'bg-dashboard-yellow'
    return 'bg-dashboard-accent'
})

const seuilMsg = computed(() => {
    if (seuilProgress.value >= 100) return '⚠ Seuil dépassé — passage au régime réel obligatoire'
    if (seuilProgress.value >= 80) return `⚡ Attention : ${Math.round(100 - seuilProgress.value)}% avant le seuil`
    return `${Math.round(100 - seuilProgress.value)}% de marge avant le seuil`
})
</script>

<style scoped>
@reference "../assets/css/main.css";

.input {
    @apply bg-dashboard-bg border border-dashboard-border rounded-lg px-3.5 py-2.5 text-dashboard-text text-[14px] outline-none transition-all focus:border-dashboard-accent focus:ring-4 focus:ring-dashboard-accent/10;
}
</style>
