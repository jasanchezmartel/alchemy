<script>
    import { gameState } from "./store.svelte.js";
    import { fly, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { Info } from "lucide-svelte";
    import InfoWindowHeader from "./components/InfoWindowHeader.svelte";
    import InfoStats from "./components/InfoStats.svelte";
    import RecipeDisplay from "./components/RecipeDisplay.svelte";
</script>

<div class="info-panel-wrapper">
    {#if gameState.infoPanel.isOpen}
        <!-- Panel Expandido -->
        <div
            class="info-panel"
            transition:fly={{ x: 300, duration: 400, easing: cubicOut }}
        >
            <InfoWindowHeader element={gameState.infoPanel.element} />

            <div class="panel-content">
                {#if gameState.infoPanel.element}
                    <InfoStats
                        complexity={gameState.infoPanel.complexity}
                        combinationsLeft={gameState.infoPanel.combinationsLeft}
                    />

                    <div class="divider"></div>

                    <RecipeDisplay parents={gameState.infoPanel.parents} />
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
            max-width: 300px;
            right: 0;
            top: 0;
            border-radius: 18px;
        }

        .panel-content {
            padding: 16px;
            max-height: 50vh;
        }

        .divider {
            margin: 12px 0;
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
            .panel-content {
                max-height: 55vh;
                padding: 12px 16px;
            }
            .divider {
                margin: 10px 0;
            }
        }
    }
</style>
