<script>
    import { gameState } from "./store.svelte.js";
    import NavigationMenu from "./components/NavigationMenu.svelte";
    import ElementsList from "./components/ElementsList.svelte";
    import { ChevronLeft, ChevronRight } from "lucide-svelte";
    import ElementIcon from "./components/ElementIcon.svelte";

    let {
        isOpen = $bindable(true),
        currentView = $bindable("elements"),
        onNavigate = () => {},
    } = $props();

    let showMenu = $state(false);
    let draggedFromSidebar = $state(null);
    let isDraggingFromSidebar = $state(false);
    let dragPreview = $state({ x: 0, y: 0, element: null });

    // Auto-switch to grid view if elements selected externally
    $effect(() => {
        if (currentView === "elements") {
            showMenu = false;
        } else {
            showMenu = true;
        }
    });

    function handleNavigation(view) {
        onNavigate(view);
        currentView = view;
        if (view === "elements") {
            showMenu = false;
        }
    }

    // Drag Logic Integration
    function handleElementDragStart(detail) {
        const { event, element } = detail;
        const isTouch = event.type.startsWith("touch");
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;
        const clientY = isTouch ? event.touches[0].clientY : event.clientY;

        // Don't prevent default on touchstart to allow scrolling
        if (!isTouch) event.preventDefault();

        isDraggingFromSidebar = true;
        draggedFromSidebar = element;

        dragPreview = {
            x: clientX,
            y: clientY,
            element: element,
        };

        if (isTouch) {
            document.addEventListener("touchmove", handleGlobalMouseMove, {
                passive: false,
            });
            document.addEventListener("touchend", handleGlobalMouseUp);
        } else {
            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);
        }
        document.body.style.cursor = "grabbing";
    }

    function handleGlobalMouseMove(event) {
        if (isDraggingFromSidebar && draggedFromSidebar) {
            const isTouch = event.type.startsWith("touch");
            const clientX = isTouch ? event.touches[0].clientX : event.clientX;
            const clientY = isTouch ? event.touches[0].clientY : event.clientY;

            // Prevent scrolling while dragging
            if (isTouch) {
                event.preventDefault();
            }

            dragPreview.x = clientX;
            dragPreview.y = clientY;
        }
    }

    function handleGlobalMouseUp(event) {
        if (isDraggingFromSidebar && draggedFromSidebar) {
            const isTouch = event.type.startsWith("touch");
            // Touchend doesn't have touches, use changedTouches
            const clientX = isTouch
                ? event.changedTouches[0].clientX
                : event.clientX;
            const clientY = isTouch
                ? event.changedTouches[0].clientY
                : event.clientY;

            const sidebarElement = document.querySelector(".sidebar");
            const gameArea = document.querySelector(".game-area");

            if (sidebarElement && gameArea) {
                const sidebarRect = sidebarElement.getBoundingClientRect();
                const gameRect = gameArea.getBoundingClientRect();

                const isInsideSidebar =
                    clientX >= sidebarRect.left &&
                    clientX <= sidebarRect.right &&
                    clientY >= sidebarRect.top &&
                    clientY <= sidebarRect.bottom;

                if (
                    !isInsideSidebar &&
                    clientX >= gameRect.left &&
                    clientX <= gameRect.right &&
                    clientY >= gameRect.top &&
                    clientY <= gameRect.bottom
                ) {
                    const dropEvent = new CustomEvent("sidebarDrop", {
                        detail: {
                            element: draggedFromSidebar,
                            x: clientX - gameRect.left,
                            y: clientY - gameRect.top,
                        },
                    });
                    gameArea.dispatchEvent(dropEvent);
                }
            }
        }
        isDraggingFromSidebar = false;
        draggedFromSidebar = null;
        dragPreview.element = null;

        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
        document.removeEventListener("touchmove", handleGlobalMouseMove);
        document.removeEventListener("touchend", handleGlobalMouseUp);

        document.body.style.cursor = "default";
    }

    function toggleSidebar() {
        isOpen = !isOpen;
    }
</script>

<aside class="sidebar" class:open={isOpen}>
    <div class="sidebar-content">
        <header class="sidebar-header">
            <div class="header-top">
                <h2>Alquimia</h2>
            </div>
            <p class="element-count">
                {gameState.discoveredElements.length} descubiertos
            </p>
        </header>

        <div class="sidebar-body">
            {#if !showMenu}
                <ElementsList onDragStart={handleElementDragStart} />
            {:else}
                <NavigationMenu {currentView} onnavigate={handleNavigation} />
            {/if}
        </div>
    </div>
</aside>

<button class="toggle-btn" onclick={toggleSidebar} aria-label="Toggle Sidebar">
    {#if isOpen}
        <ChevronLeft size={20} />
    {:else}
        <ChevronRight size={20} />
    {/if}
</button>

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
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: var(--sidebar-width);
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border-right: 1px solid var(--glass-border);
        box-shadow: var(--card-shadow);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2000;
        display: flex;
        flex-direction: column;
    }

    .sidebar:not(.open) {
        transform: translateX(-100%);
    }

    .sidebar-content {
        padding: 2rem 1.5rem;
        flex: 1;
        overflow-y: auto;
    }

    /* Scrollbar minimalista */
    .sidebar-content::-webkit-scrollbar {
        width: 4px;
    }
    .sidebar-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
    }
    .sidebar-content::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.3);
        border-radius: 4px;
    }

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

    .sidebar-body {
        flex: 1;
        min-height: 0;
    }

    .toggle-btn {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2001;
        background: var(--accent-primary);
        color: white;
        border: none;
        width: 36px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 4px 0 15px rgba(139, 92, 246, 0.4);
    }

    .sidebar.open ~ .toggle-btn {
        left: var(--sidebar-width);
    }

    .toggle-btn:hover {
        background: var(--accent-secondary);
        padding-left: 5px;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 85vw;
            border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
        }

        .sidebar.open ~ .toggle-btn {
            left: 85vw;
        }

        @media (orientation: landscape) and (max-height: 520px) {
            .sidebar {
                width: 280px;
                max-width: 50vw;
            }
            .sidebar.open ~ .toggle-btn {
                left: 280px;
            }
            .sidebar-header {
                padding-bottom: 1rem;
                margin-bottom: 1rem;
            }
            .sidebar-header h2 {
                font-size: 1.5rem;
            }
            .sidebar-content {
                padding: 1rem;
            }
            .toggle-btn {
                height: 60px;
            }
        }
    }

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
