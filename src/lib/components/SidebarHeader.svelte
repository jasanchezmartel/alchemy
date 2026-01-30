<script>
    import { gameState } from "../store.svelte.js";
</script>

<header class="sidebar-header">
    <div class="header-top">
        <h2>Alquimia</h2>
    </div>
    <p class="element-count">
        {gameState.discoveredElements.length} descubiertos
    </p>
</header>

<style>
    .sidebar-header {
        padding-bottom: 2rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--glass-border);
        text-align: center;
    }

    .header-top {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        gap: 12px;
        position: relative;
    }

    .sidebar-header h2 {
        font-size: 2rem;
        margin: 0;
        background: linear-gradient(
            135deg,
            #fff 0%,
            var(--accent-primary) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .element-count {
        margin-top: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        @media (orientation: landscape) and (max-height: 520px) {
            .sidebar-header {
                padding-bottom: 1rem;
                margin-bottom: 1rem;
            }
            .sidebar-header h2 {
                font-size: 1.5rem;
            }
        }
    }
</style>
