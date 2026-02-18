<template>
    <div v-if="modelValue"
        class="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-sm z-1000 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)">
        <div
            class="modal bg-dashboard-surface border border-dashboard-border rounded-2xl p-8 w-150 max-w-full max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-250">
            <div class="modal-title text-xl font-extrabold mb-6">
                {{ project?.id ? 'Modifier le projet' : 'Nouveau projet' }}
            </div>

            <div class="form-grid grid gap-4">
                <div class="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Nom
                            du client</label>
                        <input v-model="form.client" type="text" placeholder="SARL Dupont..." class="input">
                    </div>
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Nom
                            du projet</label>
                        <input v-model="form.name" type="text" placeholder="Site vitrine, App..." class="input">
                    </div>
                </div>

                <div class="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Montant
                            HT</label>
                        <div class="relative">
                            <input v-model.number="form.amount" type="number" placeholder="0" class="input pr-9">
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted font-mono">€</span>
                        </div>
                    </div>
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Date
                            de création</label>
                        <input v-model="form.date" type="date" class="input">
                    </div>
                </div>

                <div class="form-group flex flex-col gap-1.5">
                    <label
                        class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Technologies
                        / Tags</label>
                    <input v-model="tagsInput" type="text"
                        placeholder="React, WordPress, Laravel... (séparés par virgule)" class="input">
                </div>

                <div class="form-group flex flex-col gap-1.5">
                    <label
                        class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Statut
                        pipeline</label>
                    <div class="steps-checklist grid grid-cols-2 gap-2.5">
                        <button v-for="step in stepList" :key="step.key" @click="toggleStep(step.key)"
                            class="step-check flex items-center gap-2 bg-dashboard-bg border border-dashboard-border rounded-lg px-3.5 py-2.5 transition-all text-[13px] hover:border-dashboard-accent"
                            :class="{ 'border-dashboard-accent bg-dashboard-accent/5 text-dashboard-accent': form.steps[step.key] }">
                            <div class="check-icon w-4 h-4 rounded border-[1.5px] border-dashboard-border flex items-center justify-center text-[10px] shrink-0 transition-all"
                                :class="{ 'bg-dashboard-accent border-dashboard-accent text-dashboard-bg': form.steps[step.key] }">
                                {{ form.steps[step.key] ? '✓' : '' }}
                            </div>
                            {{ step.label }}
                        </button>
                    </div>
                </div>

                <div class="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Devis
                            (PDF)</label>
                        <div class="flex gap-2">
                            <input type="file" ref="devisFile" accept="application/pdf" class="hidden"
                                @change="e => onFileChange(e, 'devis')">
                            <button @click="devisFile?.click()"
                                class="input flex items-center justify-between text-left overflow-hidden">
                                <span class="truncate">{{ devisFileName || 'Choisir un PDF...' }}</span>
                                <span v-if="form.devisId" class="text-dashboard-accent shrink-0">✓</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">CGV/Contrat
                            (PDF)</label>
                        <div class="flex gap-2">
                            <input type="file" ref="cgvFile" accept="application/pdf" class="hidden"
                                @change="e => onFileChange(e, 'cgv')">
                            <button @click="cgvFile?.click()"
                                class="input flex items-center justify-between text-left overflow-hidden">
                                <span class="truncate">{{ cgvFileName || 'Choisir un PDF...' }}</span>
                                <span v-if="form.cgvId" class="text-dashboard-accent shrink-0">✓</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group flex flex-col gap-1.5">
                    <label
                        class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Maintenance
                        annuelle ?</label>
                    <select v-model="form.hasMaintenance" class="input">
                        <option :value="false">Non</option>
                        <option :value="true">Oui</option>
                    </select>
                </div>

                <div v-if="form.hasMaintenance"
                    class="form-row grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Montant
                            maintenance /an</label>
                        <div class="relative">
                            <input v-model.number="form.maintAmount" type="number" placeholder="0" class="input pr-9">
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-muted font-mono">€</span>
                        </div>
                    </div>
                    <div class="form-group flex flex-col gap-1.5">
                        <label
                            class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Date
                            dernier paiement</label>
                        <input v-model="form.maintDate" type="date" class="input">
                    </div>
                </div>

                <div class="form-group flex flex-col gap-1.5">
                    <label
                        class="text-[12px] font-semibold text-dashboard-muted uppercase tracking-[0.08em] font-mono">Notes</label>
                    <textarea v-model="form.notes" placeholder="Infos supplémentaires..."
                        class="input min-h-20 resize-y"></textarea>
                </div>
            </div>

            <div class="modal-actions flex gap-3 justify-end mt-6 pt-5 border-t border-dashboard-border">
                <button @click="$emit('update:modelValue', false)"
                    class="px-4 py-2 border border-dashboard-border rounded-lg text-sm font-semibold hover:bg-dashboard-surface2 transition-colors">
                    Annuler
                </button>
                <button @click="handleSave"
                    class="px-4 py-2 bg-dashboard-accent text-dashboard-bg rounded-lg text-sm font-bold hover:bg-[#6fffbe] -translate-y-px transition-all">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Project } from '~/composables/useProjects';

const props = defineProps<{
    modelValue: boolean
    project?: Project | null
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const form = ref({
    id: '',
    client: '',
    name: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    tags: [] as string[],
    devisId: '',
    cgvId: '',
    hasMaintenance: false,
    maintAmount: 0,
    maintDate: '',
    notes: '',
    steps: { sent: false, signed: false, deposit: false, done: false }
})

const devisFileName = ref('')
const cgvFileName = ref('')
const devisFile = ref<HTMLInputElement | null>(null)
const cgvFile = ref<HTMLInputElement | null>(null)

const tagsInput = ref('')

const stepList = [
    { key: 'sent' as const, label: 'Devis envoyé' },
    { key: 'signed' as const, label: 'Devis signé' },
    { key: 'deposit' as const, label: 'Acompte versé' },
    { key: 'done' as const, label: 'Projet terminé' }
]

watch(() => props.project, (newP) => {
    if (newP) {
        form.value = JSON.parse(JSON.stringify(newP))
        tagsInput.value = newP.tags.join(', ')
        devisFileName.value = newP.devisId ? 'Devis existant (PDF)' : ''
        cgvFileName.value = newP.cgvId ? 'CGV existante (PDF)' : ''
    } else {
        form.value = {
            id: '',
            client: '',
            name: '',
            amount: 0,
            date: new Date().toISOString().slice(0, 10),
            tags: [],
            devisId: '',
            cgvId: '',
            hasMaintenance: false,
            maintAmount: 0,
            maintDate: '',
            notes: '',
            steps: { sent: false, signed: false, deposit: false, done: false }
        }
        tagsInput.value = ''
        devisFileName.value = ''
        cgvFileName.value = ''
    }
}, { immediate: true })

const onFileChange = async (event: Event, type: 'devis' | 'cgv') => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    if (type === 'devis') devisFileName.value = file.name
    else cgvFileName.value = file.name

    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await $fetch<{ id: string }>('/api/upload', {
            method: 'POST',
            body: formData
        })
        if (type === 'devis') form.value.devisId = res.id
        else form.value.cgvId = res.id
    } catch (error) {
        alert("Erreur lors de l'envoi du fichier.")
    }
}

const toggleStep = (step: keyof typeof form.value.steps) => {
    form.value.steps[step] = !form.value.steps[step]
    // Cascade logic
    if (step === 'signed' && form.value.steps.signed) form.value.steps.sent = true
    if (step === 'deposit' && form.value.steps.deposit) { form.value.steps.sent = true; form.value.steps.signed = true }
    if (step === 'done' && form.value.steps.done) { form.value.steps.sent = true; form.value.steps.signed = true; form.value.steps.deposit = true }

    if (step === 'sent' && !form.value.steps.sent) { form.value.steps.signed = false; form.value.steps.deposit = false; form.value.steps.done = false }
    if (step === 'signed' && !form.value.steps.signed) { form.value.steps.deposit = false; form.value.steps.done = false }
    if (step === 'deposit' && !form.value.steps.deposit) { form.value.steps.done = false }
}

const handleSave = () => {
    if (!form.value.client || !form.value.name) {
        alert('Renseigne au moins le client et le nom du projet.')
        return
    }
    form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    emit('save', { ...form.value })
}
</script>

<style scoped></style>
