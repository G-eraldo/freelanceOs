<!-- eslint-disable vue/first-attribute-linebreak -->
<script setup>
import { toast } from 'vue-sonner'

const { credentials, loading, loadCredentials, addCredential, deleteCredential, revealField } = useCredentials()

const showModal = ref(false)
const revealedFields = ref({})

const newCred = ref({
    label: '',
    category: 'service',
    clientName: '',
    fields: [{ key: '', value: '', isSecret: false }]
})

onMounted(() => loadCredentials())

const addField = () => {
    newCred.value.fields.push({ key: '', value: '', isSecret: false })
}

const removeField = (index) => {
    newCred.value.fields.splice(index, 1)
    toast.success('Champ supprimé !')
}

const save = async () => {
    await addCredential(newCred.value)
    showModal.value = false
    newCred.value = { label: '', category: 'service', clientName: '', fields: [{ key: '', value: '', isSecret: false }] }
    toast.success('Credential ajouté !')
}

const reveal = async (fieldId) => {
    if (revealedFields.value[fieldId]) {
        revealedFields.value[fieldId] = null
        return
    }
    try {
        const value = await revealField(fieldId)
        revealedFields.value[fieldId] = value
    } catch (e) {
        console.error('[Vault] Error in reveal:', e)
        toast.error('Erreur lors de la récupération de la clé')
    }
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copié !')
}
</script>

<template>
    <div class="p-6 max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-white">Vault <span class="text-emerald-400">✦</span></h1>
                <p class="text-xs text-zinc-500 uppercase tracking-widest mt-1">Credentials chiffrés</p>
            </div>
            <button
                class="bg-emerald-400 text-black font-semibold px-4 py-2 rounded-xl text-sm hover:bg-emerald-300 transition"
                @click="showModal = true">
                + Nouveau
            </button>
        </div>

        <div v-if="loading" class="text-zinc-500 text-sm">Chargement...</div>

        <div v-else class="space-y-4">
            <div v-for="cred in credentials" :key="cred.id" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-white font-semibold">{{ cred.label }}</h2>
                        <div class="flex gap-2 mt-1">
                            <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{{ cred.category
                                }}</span>
                            <span v-if="cred.clientName"
                                class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{{ cred.clientName
                                }}</span>
                        </div>
                    </div>
                    <button class="text-zinc-600 hover:text-red-400 transition text-xs"
                        @click="deleteCredential(cred.id)">Supprimer</button>
                </div>

                <div class="space-y-2">
                    <div v-for="field in cred.fields" :key="field.id"
                        class="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-2">
                        <span class="text-zinc-400 text-xs w-28 shrink-0">{{ field.key }}</span>
                        <span class="text-white text-sm font-mono flex-1">
                            {{ field.isSecret ? (revealedFields[field.id] ?? '••••••••') : field.value }}
                        </span>
                        <div class="flex gap-2">
                            <button v-if="field.isSecret"
                                class="text-zinc-500 hover:text-emerald-400 transition text-xs"
                                @click="reveal(field.id)">
                                {{ revealedFields[field.id] ? 'Masquer' : 'Voir' }}
                            </button>
                            <button class="text-zinc-500 hover:text-emerald-400 transition text-xs"
                                @click="copyToClipboard(revealedFields[field.id] ?? field.value)">
                                Copier
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="credentials.length === 0" class="text-center text-zinc-600 py-12 text-sm">
                Aucun credential — <button class="text-emerald-400" @click="showModal = true">Créer le premier</button>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
                <h2 class="text-white font-semibold mb-5">Nouveau credential</h2>

                <div class="space-y-4">
                    <div>
                        <label class="text-zinc-500 text-xs uppercase tracking-widest">Label</label>
                        <input v-model="newCred.label" placeholder="Cloudinary, OVH, Resend..."
                            class="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 mt-1 text-sm outline-none">
                    </div>

                    <div>
                        <label class="text-zinc-500 text-xs uppercase tracking-widest">Catégorie</label>
                        <select v-model="newCred.category"
                            class="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 mt-1 text-sm outline-none">
                            <option value="service">Mon service</option>
                            <option value="client">Client</option>
                        </select>
                    </div>

                    <div v-if="newCred.category === 'client'">
                        <label class="text-zinc-500 text-xs uppercase tracking-widest">Nom du client</label>
                        <input v-model="newCred.clientName" placeholder="ML Motors..."
                            class="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 mt-1 text-sm outline-none">
                    </div>

                    <div>
                        <label class="text-zinc-500 text-xs uppercase tracking-widest mb-2 block">Champs</label>
                        <div v-for="(field, i) in newCred.fields" :key="i" class="flex gap-2 mb-2 items-center">
                            <input v-model="field.key" placeholder="Login, API Key..."
                                class="bg-zinc-800 text-white rounded-xl px-3 py-2 text-sm outline-none w-32">
                            <input v-model="field.value" :type="field.isSecret ? 'password' : 'text'"
                                placeholder="Valeur..."
                                class="bg-zinc-800 text-white rounded-xl px-3 py-2 text-sm outline-none flex-1">
                            <button :class="field.isSecret ? 'text-emerald-400' : 'text-zinc-600'"
                                class="text-xs transition" @click="field.isSecret = !field.isSecret">🔒</button>
                            <button class="text-zinc-600 hover:text-red-400 text-xs transition"
                                @click="removeField(i)">✕</button>
                        </div>
                        <button class="text-emerald-400 text-xs mt-1" @click="addField">+ Ajouter un champ</button>
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <button class="flex-1 bg-zinc-800 text-white rounded-xl py-2 text-sm"
                        @click="showModal = false">Annuler</button>
                    <button class="flex-1 bg-emerald-400 text-black font-semibold rounded-xl py-2 text-sm"
                        @click="save">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
</template>