<script>
    import ElementIcon from "./ElementIcon.svelte";

    let { dragPreview } = $props();
</script>

{#if dragPreview.element}
    <div
        class="drag-preview"
        style="left: {dragPreview.x}px; top: {dragPreview.y}px;"
    >
        <div
            class="preview-icon-wrapper"
            data-category={dragPreview.element.category}
        >
            <ElementIcon
                name={dragPreview.element.icon}
                size={32}
                color="var(--cat-color, #8b5cf6)"
                strokeWidth={2.5}
            />
        </div>
        <span class="name">{dragPreview.element.name}</span>
    </div>
{/if}

<style>
    .drag-preview {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        transform: translate(-50%, -50%);
    }

    .preview-icon-wrapper {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .drag-preview .name {
        background: var(--bg-secondary);
        padding: 4px 12px;
        border-radius: var(--border-radius-sm);
        font-size: 0.875rem;
        font-weight: 600;
        border: 1px solid var(--glass-border);
    }

    /* Category Colors for Preview */
    .preview-icon-wrapper[data-category="Origen"] {
        --cat-color: #f87171;
    }
    .preview-icon-wrapper[data-category="Fenómenos"] {
        --cat-color: #60a5fa;
    }
    .preview-icon-wrapper[data-category="Materiales"] {
        --cat-color: #a8a29e;
    }
    .preview-icon-wrapper[data-category="Vida"] {
        --cat-color: #4ade80;
    }
    .preview-icon-wrapper[data-category="Tecnología"] {
        --cat-color: #22d3ee;
    }
    .preview-icon-wrapper[data-category="Espacio"] {
        --cat-color: #c084fc;
    }
    .preview-icon-wrapper[data-category="Objetos"] {
        --cat-color: #fbbf24;
    }
    .preview-icon-wrapper[data-category="Construcción"] {
        --cat-color: #fb923c;
    }
    .preview-icon-wrapper[data-category="Conceptos"] {
        --cat-color: #818cf8;
    }
    .preview-icon-wrapper[data-category="Naturaleza"] {
        --cat-color: #34d399;
    }

    .preview-icon-wrapper {
        border-color: var(--cat-color, var(--accent-primary));
        box-shadow: 0 0 15px var(--cat-color, var(--accent-primary));
    }
</style>
