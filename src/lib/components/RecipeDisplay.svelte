<script>
    import { Plus, FlaskConical } from "lucide-svelte";
    import ElementIcon from "./ElementIcon.svelte";

    let { parents = [] } = $props();
</script>

<div class="section">
    <h4>Origen / Receta</h4>
    <div class="parents-container">
        {#if parents.length > 0}
            {#each parents as parent, i}
                <div class="parent-chip" data-category={parent.category}>
                    <div class="chip-icon-wrapper">
                        <ElementIcon
                            name={parent.icon}
                            size={18}
                            color="var(--cat-color, #8b5cf6)"
                            strokeWidth={2}
                        />
                    </div>
                    <span class="chip-name">{parent.name}</span>
                </div>
                {#if i < parents.length - 1}
                    <div class="operator-circle">
                        <Plus size={10} strokeWidth={3} />
                    </div>
                {/if}
            {/each}
        {:else}
            <div class="base-tag-premium">
                <FlaskConical size={14} />
                <span>Elemento Primordial</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .section h4 {
        margin: 0 0 14px 0;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: var(--text-faded);
        font-weight: 900;
    }

    .parents-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }

    .parent-chip[data-category="Origen"] {
        --cat-color: var(--category-origin);
    }
    .parent-chip[data-category="Fenómenos"] {
        --cat-color: var(--category-phenomena);
    }
    .parent-chip[data-category="Materiales"] {
        --cat-color: var(--category-materials);
    }
    .parent-chip[data-category="Vida"] {
        --cat-color: var(--category-life);
    }
    .parent-chip[data-category="Tecnología"] {
        --cat-color: var(--category-technology);
    }
    .parent-chip[data-category="Espacio"] {
        --cat-color: var(--category-space);
    }
    .parent-chip[data-category="Objetos"] {
        --cat-color: var(--category-objects);
    }
    .parent-chip[data-category="Construcción"] {
        --cat-color: var(--category-construction);
    }
    .parent-chip[data-category="Conceptos"] {
        --cat-color: var(--category-concepts);
    }
    .parent-chip[data-category="Naturaleza"] {
        --cat-color: var(--category-nature);
    }

    .chip-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 0 5px var(--cat-color, var(--accent-primary)));
    }

    .parent-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--chip-bg);
        padding: 8px 14px;
        border-radius: var(--border-radius-md);
        border: 1px solid var(--chip-border);
        transition: all 0.2s;
    }

    .parent-chip:hover {
        background: var(--chip-bg-hover);
        border-color: var(--chip-border-hover);
        transform: translateY(-2px);
    }

    .chip-name {
        font-size: 13px;
        color: var(--text-light);
        font-weight: 600;
    }

    .operator-circle {
        width: 20px;
        height: 20px;
        background: var(--operator-circle-bg);
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-faded-dark);
    }

    .base-tag-premium {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #a78bfa;
        font-weight: 600;
        padding: 10px 16px;
        background: rgba(167, 139, 250, 0.08);
        border-radius: 14px;
        border: 1px dashed rgba(167, 139, 250, 0.3);
    }

    @media (max-width: 768px) {
        .section h4 {
            margin-bottom: 8px;
            font-size: 10px;
        }
        .chip-name {
            font-size: 12px;
        }
        .parent-chip {
            padding: 2px 8px;
        }
        @media (orientation: landscape) and (max-height: 520px) {
            .section h4 {
                margin-bottom: 6px;
                font-size: 9px;
            }
            .parent-chip {
                padding: 4px 10px;
            }
            .chip-name {
                font-size: 11px;
            }
        }
    }
</style>
