<script>
    import { gameState } from "./store.svelte.js";
    import NavigationMenu from "./components/NavigationMenu.svelte";
    import ElementsList from "./components/ElementsList.svelte";
    import SidebarHeader from "./components/SidebarHeader.svelte";
    import SidebarToggle from "./components/SidebarToggle.svelte";
    import DragPreview from "./components/DragPreview.svelte";

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
        <SidebarHeader />

        <div class="sidebar-body">
            {#if !showMenu}
                <ElementsList onDragStart={handleElementDragStart} />
            {:else}
                <NavigationMenu {currentView} onnavigate={handleNavigation} />
            {/if}
        </div>
    </div>
</aside>

<SidebarToggle {isOpen} onclick={toggleSidebar} />

<DragPreview {dragPreview} />

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

    .sidebar-body {
        flex: 1;
        min-height: 0;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 85vw;
            border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
        }

        @media (orientation: landscape) and (max-height: 520px) {
            .sidebar {
                width: 280px;
                max-width: 50vw;
            }
            .sidebar-content {
                padding: 1rem;
            }
        }
    }
</style>
