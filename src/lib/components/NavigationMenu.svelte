<script>
    // Svelte 5 props
    let { currentView = "elements", onnavigate } = $props();

    function navigate(view) {
        if (onnavigate) onnavigate(view);
    }
</script>

<nav class="main-menu">
    <button
        class="menu-item"
        class:active={currentView === "info"}
        onclick={() => navigate("info")}
    >
        Información
    </button>
    <button
        class="menu-item"
        class:active={currentView === "elements"}
        onclick={() => navigate("elements")}
    >
        Elementos
    </button>
    <button
        class="menu-item"
        class:active={currentView === "tree"}
        onclick={() => navigate("tree")}
    >
        Árbol de descubrimientos
    </button>
    <button
        class="menu-item"
        class:active={currentView === "hints"}
        onclick={() => navigate("hints")}
    >
        Pistas
    </button>
    <button
        class="menu-item"
        class:active={currentView === "achievements"}
        onclick={() => navigate("achievements")}
    >
        Logros
    </button>
</nav>

<style>
    .main-menu {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px 10px;
        animation: menuFadeIn 0.4s ease-out;
    }

    @keyframes menuFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .menu-item {
        background: transparent;
        border: 1px solid transparent;
        color: var(--text-secondary);
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 14px 20px;
        width: 100%;
        text-align: center;
        border-radius: var(--border-radius-md);
    }

    .menu-item:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--glass-border);
        transform: translateX(5px);
    }

    .menu-item.active {
        color: white;
        background: linear-gradient(
            135deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
        );
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
    }
    @media (orientation: landscape) and (max-height: 520px) {
        .main-menu {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding: 10px;
        }

        .menu-item {
            padding: 10px;
            font-size: 0.85rem;
        }
    }
</style>
