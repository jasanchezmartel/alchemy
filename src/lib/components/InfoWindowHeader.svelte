<script>
    import { Info, X } from "lucide-svelte";
    import ElementIcon from "./ElementIcon.svelte";
    import { gameState } from "../store.svelte.js";

    let { element } = $props();
</script>

<div class="panel-header">
    {#if element}
        <div class="title-group" data-category={element.category}>
            <div class="header-icon-wrapper">
                <ElementIcon
                    name={element.icon}
                    size={32}
                    color="var(--cat-color, #8b5cf6)"
                    strokeWidth={2}
                />
            </div>
            <h3>{element.name}</h3>
        </div>
    {:else}
        <div class="title-group">
            <Info size={18} color="#8b5cf6" />
            <h3>Información</h3>
        </div>
    {/if}
    <button
        class="toggle-btn close"
        onclick={() => gameState.toggleInfoPanel()}
        aria-label="Ocultar información"
    >
        <X size={16} />
    </button>
</div>

<style>
    .panel-header {
        background: var(--panel-header-bg);
        padding: 18px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-dark);
    }

    .title-group {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        color: var(--text-light);
        letter-spacing: -0.5px;
    }

    .toggle-btn {
        background: var(--button-secondary-bg);
        border: 1px solid var(--button-secondary-border);
        color: var(--text-muted);
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius-sm);
        transition: all 0.2s;
    }

    .toggle-btn:hover {
        background: var(--button-danger-bg-hover);
        color: var(--button-danger-text-hover);
        border-color: var(--button-danger-border-hover);
        transform: rotate(90deg);
    }

    .title-group[data-category="Origen"] {
        --cat-color: var(--category-origin);
    }
    .title-group[data-category="Fenómenos"] {
        --cat-color: var(--category-phenomena);
    }
    .title-group[data-category="Materiales"] {
        --cat-color: var(--category-materials);
    }
    .title-group[data-category="Vida"] {
        --cat-color: var(--category-life);
    }
    .title-group[data-category="Tecnología"] {
        --cat-color: var(--category-technology);
    }
    .title-group[data-category="Espacio"] {
        --cat-color: var(--category-space);
    }
    .title-group[data-category="Objetos"] {
        --cat-color: var(--category-objects);
    }
    .title-group[data-category="Construcción"] {
        --cat-color: var(--category-construction);
    }
    .title-group[data-category="Conceptos"] {
        --cat-color: var(--category-concepts);
    }
    .title-group[data-category="Naturaleza"] {
        --cat-color: var(--category-nature);
    }

    .header-icon-wrapper {
        filter: drop-shadow(0 0 10px var(--cat-color, var(--accent-primary)));
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .panel-header {
            padding: 12px 16px;
        }
        h3 {
            font-size: 16px;
        }
        @media (orientation: landscape) and (max-height: 520px) {
            .panel-header {
                padding: 10px 16px;
            }
        }
    }
</style>
