<script>
    import { gameState } from "./store.svelte.js";
    import { fly, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { Info, X, Sparkles, Plus, FlaskConical } from "lucide-svelte";
    import ElementIcon from "./components/ElementIcon.svelte";

    // En Svelte 5 ya no necesitamos prop-types ni export let si no recibimos nada.
    // Accedemos directamente a gameState que es reactivo vía runes.
</script>

<div class="info-panel-wrapper">
    {#if gameState.infoPanel.isOpen}
        <!-- Panel Expandido -->
        <div
            class="info-panel"
            transition:fly={{ x: 300, duration: 400, easing: cubicOut }}
        >
            <div class="panel-header">
                {#if gameState.infoPanel.element}
                    <div
                        class="title-group"
                        data-category={gameState.infoPanel.element.category}
                    >
                        <div class="header-icon-wrapper">
                            <ElementIcon
                                name={gameState.infoPanel.element.icon}
                                size={32}
                                color="var(--cat-color, #8b5cf6)"
                                strokeWidth={2}
                            />
                        </div>
                        <h3>{gameState.infoPanel.element.name}</h3>
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

            <div class="panel-content">
                {#if gameState.infoPanel.element}
                    <div class="section">
                        <h4>Nivel de Alquimia</h4>
                        <div class="complexity-container">
                            <div
                                class="complexity-badge"
                                style="--tier: {gameState.infoPanel.complexity}"
                            >
                                <Sparkles
                                    size={14}
                                    fill={gameState.infoPanel.complexity > 0
                                        ? "#fbbf24"
                                        : "currentColor"}
                                />
                                <span
                                    >Tier {gameState.infoPanel.complexity}</span
                                >
                            </div>
                            <p class="complexity-desc">
                                {#if gameState.infoPanel.complexity === 0}
                                    Elemento fundamental de la naturaleza.
                                {:else}
                                    Requiere {gameState.infoPanel.complexity} niveles
                                    de transmutación.
                                {/if}
                            </p>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="section">
                        <h4>Origen / Receta</h4>
                        <div class="parents-container">
                            {#if gameState.infoPanel.parents.length > 0}
                                {#each gameState.infoPanel.parents as parent, i}
                                    <div
                                        class="parent-chip"
                                        data-category={parent.category}
                                    >
                                        <div class="chip-icon-wrapper">
                                            <ElementIcon
                                                name={parent.icon}
                                                size={18}
                                                color="var(--cat-color, #8b5cf6)"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span class="chip-name"
                                            >{parent.name}</span
                                        >
                                    </div>
                                    {#if i < gameState.infoPanel.parents.length - 1}
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

                    <div class="divider"></div>

                    <div class="section">
                        <h4>Posibilidades</h4>
                        <div class="stats">
                            <span class="highlight"
                                >{gameState.infoPanel.combinationsLeft}</span
                            >
                            <span class="label"
                                >combinaciones por descubrir</span
                            >
                        </div>
                    </div>
                {:else}
                    <div class="empty-state">
                        <div class="empty-icon-container">
                            <Info size={32} />
                        </div>
                        <p>
                            Selecciona un elemento para ver su nivel de
                            complejidad y receta.
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <!-- Pestaña Colapsada -->
        <button
            class="collapsed-tab"
            onclick={() => gameState.toggleInfoPanel()}
            in:fade={{ delay: 200, duration: 200 }}
            out:fade={{ duration: 100 }}
            aria-label="Ver información"
        >
            <Info size={24} strokeWidth={2.5} />
        </button>
    {/if}
</div>

<style>
    .info-panel-wrapper {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: "Inter", sans-serif;
        pointer-events: none;
    }

    .info-panel-wrapper > * {
        pointer-events: auto;
    }

    /* Collapsed State */
    .collapsed-tab {
        background: var(--accent-primary);
        border: 2px solid var(--border-light);
        color: white;
        width: 52px;
        height: 52px;
        border-radius: var(--border-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: absolute;
        right: 0;
        top: 0;
    }

    .collapsed-tab:hover {
        background: var(--accent-primary-hover);
        transform: scale(1.1) rotate(-8deg);
    }

    /* Expanded Panel */
    .info-panel {
        width: 300px;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: var(--card-shadow);
        position: absolute;
        right: 0;
        top: 0;
    }

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

    .panel-content {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
    }

    /* Minimalist Scrollbar for InfoPanel */
    .panel-content::-webkit-scrollbar {
        width: 4px;
    }
    .panel-content::-webkit-scrollbar-track {
        background: transparent;
    }
    .panel-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    .panel-content::-webkit-scrollbar-thumb:hover {
        background: var(--accent-primary);
    }

    .section h4 {
        margin: 0 0 14px 0;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: var(--text-faded);
        font-weight: 900;
    }

    /* Complexity Styles */
    .complexity-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .complexity-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: var(--badge-warning-bg);
        border: 1px solid var(--badge-warning-border);
        border-radius: var(--border-radius-full);
        color: var(--badge-warning-text);
        font-size: 14px;
        font-weight: 700;
        width: fit-content;
    }

    .complexity-desc {
        margin: 0;
        font-size: 12px;
        color: var(--text-faded-light);
        line-height: 1.4;
    }

    /* Parents Styles */
    .parents-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
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

    .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        margin: 20px 0;
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .highlight {
        font-size: 36px;
        font-weight: 900;
        color: #8b5cf6;
        line-height: 1;
        text-shadow: 0 0 25px rgba(139, 92, 246, 0.5);
    }

    .label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 500;
        padding-left: 2px;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 40px 0;
    }

    .empty-icon-container {
        width: 64px;
        height: 64px;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8b5cf6;
    }

    .empty-state p {
        margin: 0;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.4);
        line-height: 1.6;
        text-align: center;
        max-width: 200px;
    }
    @media (max-width: 768px) {
        .info-panel-wrapper {
            top: 10px;
            right: 10px;
        }

        .collapsed-tab {
            width: 40px;
            height: 40px;
            border-radius: 10px;
        }

        .info-panel {
            width: calc(100vw - 20px);
            max-width: 300px; /* Reduced from 380px */
            right: 0;
            top: 0;
            border-radius: 18px;
        }

        .panel-header {
            padding: 12px 16px; /* Reduced from 18px 20px */
        }

        h3 {
            font-size: 16px;
        }

        .panel-content {
            padding: 16px; /* Reduced from 20px/24px */
            max-height: 50vh; /* Reduced from 60vh */
        }

        .section h4 {
            margin-bottom: 8px; /* Reduced from 14px */
            font-size: 10px;
        }

        .divider {
            margin: 12px 0; /* Reduced from 20px */
        }

        .complexity-badge {
            padding: 4px 10px;
            font-size: 12px;
        }

        .complexity-desc {
            font-size: 11px;
        }

        .highlight {
            font-size: 28px; /* Reduced from 32px */
        }

        .label {
            font-size: 12px;
        }

        .parent-chip {
            padding: 2px 8px; /* Assuming it was larger */
        }

        .chip-name {
            font-size: 12px;
        }

        @media (orientation: landscape) and (max-height: 520px) {
            .info-panel {
                width: 320px;
                max-width: 50vw;
                max-height: 85vh;
                top: 0;
                right: 0;
                border-radius: var(--border-radius-lg);
            }
            .panel-header {
                padding: 10px 16px;
            }
            .panel-content {
                max-height: 55vh;
                padding: 12px 16px;
            }
            .section h4 {
                margin-bottom: 6px;
                font-size: 9px;
            }
            .divider {
                margin: 10px 0;
            }
            .highlight {
                font-size: 24px;
            }
            .complexity-badge {
                padding: 4px 10px;
                font-size: 12px;
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
