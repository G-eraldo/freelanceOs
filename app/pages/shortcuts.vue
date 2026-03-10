<template>
    <div class="page-shortcuts animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="page-header flex justify-between items-center mb-8">
            <h1 class="page-title text-2xl lg:text-3xl font-extrabold tracking-tight">
                Raccourcis <span class="text-dashboard-accent">✦</span>
            </h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(group, gIndex) in shortcutGroups" :key="group.title"
                class="shortcut-group bg-dashboard-surface border border-dashboard-border rounded-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                :style="{ animationDelay: `${gIndex * 0.1}s` }">
                <div class="group-header px-5 py-3 border-b border-dashboard-border bg-dashboard-surface2/30">
                    <h2 class="text-[11px] uppercase tracking-wider text-dashboard-muted font-mono font-bold">
                        {{ group.title }}
                    </h2>
                </div>

                <div class="group-content p-2 flex flex-col gap-1">
                    <div v-for="shortcut in group.shortcuts" :key="shortcut.label"
                        class="shortcut-item group flex items-center justify-between p-3 rounded-lg hover:bg-dashboard-surface2/50 transition-colors cursor-default">
                        <span class="text-sm text-dashboard-text group-hover:text-dashboard-accent transition-colors">
                            {{ shortcut.label }}
                        </span>

                        <div class="flex items-center gap-1.5">
                            <template v-for="(key, kIndex) in shortcut.keys" :key="kIndex">
                                <kbd
                                    class="inline-flex items-center justify-center h-7 min-w-7 px-2 bg-dashboard-surface2 border border-dashboard-border border-b-2 border-b-black/20 rounded text-[11px] font-mono font-bold text-dashboard-text shadow-sm">
                                    {{ key }}
                                </kbd>
                                <span v-if="kIndex < shortcut.keys.length - 1"
                                    class="text-[10px] text-dashboard-muted opacity-50">+</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const shortcutGroups = [
    {
        title: 'Applications',
        shortcuts: [
            { label: 'Ghostty', keys: ['⌥', 'G'], color: 'var(--dashboard-purple)' },
        ],
    },
    {
        title: 'Clipboard History',
        shortcuts: [
            { label: 'Clipboard History', keys: ['⌘', 'H'], color: 'var(--dashboard-accent)' },
        ],
    },
    {
        title: 'Navigation & Recherche',
        shortcuts: [
            { label: 'Search Files', keys: ['⌥', 'F'], color: 'var(--dashboard-red)' },
        ],
    },
    {
        title: 'Système',
        shortcuts: [
            { label: 'Empty Trash', keys: ['⌥', 'C'], color: 'var(--dashboard-purple)' },
            { label: 'Screenshot', keys: ['⌘', 'D'], color: 'var(--dashboard-purple)' },
            { label: 'FullScreenshot', keys: ['⌘', 'G'], color: 'var(--dashboard-purple)' },
        ]
    },
    {
        title: 'Window Management',
        shortcuts: [
            { label: 'Left Half', keys: ['⌘', '←'], color: 'var(--dashboard-purple)' },
            { label: 'Maximize', keys: ['⌘', '↑'], color: 'var(--dashboard-accent)' },
            { label: 'Reasonable Size', keys: ['⌘', '↓'], color: 'var(--dashboard-purple)' },
            { label: 'Right Half', keys: ['⌘', '→'], color: 'var(--dashboard-purple)' },
        ],
    },
];
</script>

<style scoped>
/* Focus on the "Syne" font feel for headers if possible, otherwise bold/italic works */
.page-title {
    letter-spacing: -0.02em;
}

kbd {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
</style>
