<script setup>
import { toast } from 'vue-sonner'

const { credentials, loading, loadCredentials, addCredential, deleteCredential, revealField } = useCredentials()
const { projects, loadProjects } = useProjects()

const showModal = ref(false)
const revealedFields = ref({})
const searchQuery = ref('')
const selectedClient = ref('all')
const selectedCategory = ref('all')

const newCred = ref({
    label: '',
    category: 'service',
    clientName: '',
    fields: [{ key: '', value: '', isSecret: false }]
})

onMounted(() => {
    loadCredentials()
    loadProjects()
})

const uniqueClients = computed(() => {
    const credClients = credentials.value
        .map(c => c.clientName)
        .filter(name => !!name)
    const projClients = projects.value
        .map(p => p.client)
        .filter(name => !!name)
    return [...new Set([...credClients, ...projClients])].sort((a, b) => a.localeCompare(b))
})

const filteredCredentials = computed(() => {
    return credentials.value.filter(cred => {
        const matchesSearch = cred.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (cred.clientName && cred.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()))

        const matchesClient = selectedClient.value === 'all' || cred.clientName === selectedClient.value

        const matchesCategory = selectedCategory.value === 'all' || cred.category === selectedCategory.value

        return matchesSearch && matchesClient && matchesCategory
    })
})

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
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-white">
                    Vault <span class="text-emerald-400">✦</span>
                </h1>
                <p class="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    Credentials chiffrés
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button
                    class="bg-emerald-400 text-black font-semibold px-4 py-2 rounded-xl text-sm hover:bg-emerald-300 transition whitespace-nowrap"
                    @click="showModal = true">
                    + Nouveau
                </button>
            </div>
        </div>

        <!-- Filters Bar -->
        <div class="flex flex-col md:flex-row gap-4 mb-8">
            <div class="relative flex-1">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
                <input v-model="searchQuery" type="text" placeholder="Rechercher un service ou un client..."
                    class="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-400/50 transition-colors">
            </div>

            <div class="flex gap-2">
                <select v-model="selectedCategory"
                    class="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer focus:border-emerald-400/50 transition-colors min-w-[140px]">
                    <option value="all">Toutes catégories</option>
                    <option value="service">Mon service</option>
                    <option value="client">Client</option>
                </select>

                <select v-model="selectedClient"
                    class="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer focus:border-emerald-400/50 transition-colors min-w-[150px]">
                    <option value="all">Tous les clients</option>
                    <option v-for="client in uniqueClients" :key="client" :value="client">
                        {{ client }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="text-zinc-500 text-sm py-12 text-center">
            <div class="animate-pulse inline-block">Chargement du coffre-fort...</div>
        </div>

        <div v-else class="space-y-4">
            <div v-for="cred in filteredCredentials" :key="cred.id"
                class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2 class="text-white font-semibold">{{ cred.label }}</h2>
                        <div class="flex gap-2 mt-1">
                            <span
                                class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 uppercase font-bold tracking-wider">
                                {{ cred.category }}
                            </span>
                            <span v-if="cred.clientName"
                                class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 uppercase font-bold tracking-wider border border-emerald-400/20">
                                {{ cred.clientName }}
                            </span>
                        </div>
                    </div>
                    <button class="text-zinc-600 hover:text-red-400 transition text-xs font-medium"
                        @click="deleteCredential(cred.id)">
                        Supprimer
                    </button>
                </div>

                <div class="space-y-2">
                    <div v-for="field in cred.fields" :key="field.id"
                        class="flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-2.5 group hover:bg-zinc-800 transition-colors">
                        <span class="text-zinc-500 text-[11px] font-bold uppercase tracking-wider w-28 shrink-0">
                            {{ field.key }}
                        </span>
                        <span class="text-white text-sm font-mono flex-1 truncate">
                            {{ field.isSecret ? (revealedFields[field.id] ?? '••••••••') : field.value }}
                        </span>
                        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button v-if="field.isSecret"
                                class="text-zinc-400 hover:text-emerald-400 transition text-xs font-bold"
                                @click="reveal(field.id)">
                                {{ revealedFields[field.id] ? 'MASQUER' : 'VOIR' }}
                            </button>
                            <button class="text-zinc-400 hover:text-emerald-400 transition text-xs font-bold"
                                @click="copyToClipboard(revealedFields[field.id] ?? field.value)">
                                COPIER
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredCredentials.length === 0"
                class="text-center text-zinc-500 py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                <div class="text-2xl mb-2">🔍</div>
                <div v-if="credentials.length === 0" class="text-sm">
                    Aucun credential — <button class="text-emerald-400 font-bold" @click="showModal = true">
                        Créer le premier
                    </button>
                </div>
                <div v-else class="text-sm">
                    Aucun résultat pour cette recherche.
                    <button class="text-emerald-400 font-bold ml-1"
                        @click="searchQuery = ''; selectedClient = 'all'; selectedCategory = 'all'">
                        Tout afficher
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal"
            class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span class="text-emerald-400">⊕</span> Nouveau credential
                </h2>

                <div class="space-y-4">
                    <div>
                        <label class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">Label</label>
                        <input v-model="newCred.label" placeholder="Cloudinary, OVH, Resend..."
                            class="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-400/50 text-white rounded-xl px-4 py-2.5 mt-1 text-sm outline-none transition-colors">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">
                                Catégorie
                            </label>
                            <select v-model="newCred.category"
                                class="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-400/50 text-white rounded-xl px-4 py-2.5 mt-1 cursor-pointer text-sm outline-none transition-colors">
                                <option value="service">Mon service</option>
                                <option value="client">Client</option>
                            </select>
                        </div>

                        <div v-if="newCred.category === 'client'">
                            <label class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">
                                Nom du client
                            </label>
                            <select v-model="newCred.clientName"
                                class="w-full bg-zinc-800 border border-zinc-700 focus:border-emerald-400/50 text-white rounded-xl px-4 py-2.5 mt-1 cursor-pointer text-sm outline-none transition-colors">
                                <option value="" disabled>Sélectionner un client...</option>
                                <option v-for="client in uniqueClients" :key="client" :value="client">
                                    {{ client }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-1">
                                Champs
                            </label>
                            <button
                                class="text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:text-emerald-300"
                                @click="addField">
                                + Ajouter
                            </button>
                        </div>
                        <div class="max-h-48 overflow-y-auto pr-1 space-y-2">
                            <div v-for="(field, j) in newCred.fields" :key="j" class="flex gap-2 items-center group">
                                <input v-model="field.key" placeholder="Key"
                                    class="bg-zinc-800 border border-zinc-700 focus:border-emerald-400/50 text-white rounded-xl px-3 py-2 text-sm outline-none w-28 transition-colors">
                                <input v-model="field.value" :type="field.isSecret ? 'password' : 'text'"
                                    placeholder="Valeur"
                                    class="bg-zinc-800 border border-zinc-700 focus:border-emerald-400/50 text-white rounded-xl px-3 py-2 text-sm outline-none flex-1 transition-colors">
                                <button
                                    :class="field.isSecret ? 'bg-emerald-400 text-black border-emerald-400' : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'"
                                    class="w-8 h-8 rounded-lg border flex items-center justify-center transition-all shrink-0"
                                    :title="field.isSecret ? 'Secret' : 'Public'"
                                    @click="field.isSecret = !field.isSecret">
                                    {{ field.isSecret ? '🔒' : '🔓' }}
                                </button>
                                <button
                                    class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                                    @click="removeField(j)">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mt-8">
                    <button
                        class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl py-2.5 text-sm transition-colors"
                        @click="showModal = false">
                        Annuler
                    </button>
                    <button
                        class="flex-1 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-xl py-2.5 text-sm transition-colors shadow-lg shadow-emerald-400/10"
                        @click="save">
                        Enregistrer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>