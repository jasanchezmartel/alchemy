<script>
    import { SvelteSet } from "svelte/reactivity";
    import { gameState } from "./store.svelte.js";
    import { fly, fade } from "svelte/transition";
    import { CheckCircle2, AlertCircle } from "lucide-svelte";
    import BlackHole from "./components/BlackHole.svelte";
    import ElementIcon from "./components/ElementIcon.svelte";

    let { sidebarOpen = true } = $props();

    // Board state now persists in gameState
    let draggedCanvasElement = $state(null);
    let dragOffset = $state({ x: 0, y: 0 });
    let notifications = $state([]);
    let gameArea = $state();

    // Link notification system to global state
    $effect(() => {
        gameState.showNotification = showNotification;
    });

    // Multi-select state
    let isSelecting = $state(false);
    let selectionBox = $state({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    });
    let selectedCanvasIds = new SvelteSet();
    let isDraggingGroup = $state(false);
    let isCtrlPressed = $state(false);
    let clipboard = $state([]);
    let mousePosition = $state({ x: 0, y: 0 });
    let rapidFireId = $state(null);
    let rapidFireTimer = null;

    function handleKeyChange(event) {
        isCtrlPressed = event.ctrlKey || event.metaKey;

        // Copy (Ctrl+C)
        if (isCtrlPressed && event.key.toLowerCase() === "c") {
            const selected = gameState.canvasElements.filter((el) =>
                selectedCanvasIds.has(el.canvasId),
            );
            if (selected.length > 0) {
                clipboard = selected.map((el) => ({ ...el }));
                showNotification(
                    `📋 ${selected.length} ${selected.length === 1 ? "elemento copiado" : "elementos copiados"}`,
                    "success",
                    "clipboard",
                );
            }
        }

        // Paste (Ctrl+V)
        if (isCtrlPressed && event.key.toLowerCase() === "v") {
            if (clipboard.length > 0) {
                const newElements = clipboard.map((clonedEl) => {
                    const pos = gameState.findFreePosition(
                        clonedEl.x,
                        clonedEl.y,
                    );
                    const newEl = {
                        ...clonedEl,
                        canvasId: gameState.nextCanvasId++,
                        x: pos.x,
                        y: pos.y,
                        isNew: true,
                    };
                    return newEl;
                });

                gameState.canvasElements = [
                    ...gameState.canvasElements,
                    ...newElements,
                ];

                // Select the new elements
                selectedCanvasIds.clear();
                newElements.forEach((el) => selectedCanvasIds.add(el.canvasId));

                showNotification(
                    `📋 ${newElements.length} ${newElements.length === 1 ? "elemento pegado" : "elementos pegados"}`,
                    "success",
                    "clipboard",
                );

                setTimeout(() => {
                    gameState.canvasElements = gameState.canvasElements.map(
                        (el) => {
                            const isPasted = newElements.some(
                                (ne) => ne.canvasId === el.canvasId,
                            );
                            return isPasted ? { ...el, isNew: false } : el;
                        },
                    );
                }, 1000);
            }
        }
    }

    // Live tracking of selection
    $effect(() => {
        if (!isSelecting) return;

        const left = Math.min(selectionBox.startX, selectionBox.currentX);
        const top = Math.min(selectionBox.startY, selectionBox.currentY);
        const right =
            left + Math.abs(selectionBox.currentX - selectionBox.startX);
        const bottom =
            top + Math.abs(selectionBox.currentY - selectionBox.startY);

        gameState.canvasElements.forEach((el) => {
            const intersect = !(
                el.x > right ||
                el.x + 100 < left ||
                el.y > bottom ||
                el.y + 100 < top
            );

            if (intersect) {
                selectedCanvasIds.add(el.canvasId);
            } else if (!isCtrlPressed) {
                selectedCanvasIds.delete(el.canvasId);
            }
        });
    });

    // Handle global mouse events for selection
    $effect(() => {
        if (isSelecting) {
            window.addEventListener("mousemove", handleSelectionMove);
            window.addEventListener("mouseup", handleSelectionUp);
            return () => {
                window.removeEventListener("mousemove", handleSelectionMove);
                window.removeEventListener("mouseup", handleSelectionUp);
            };
        }
    });

    function handleSelectionMove(event) {
        if (!gameArea) return;
        const rect = gameArea.getBoundingClientRect();
        selectionBox.currentX = event.clientX - rect.left;
        selectionBox.currentY = event.clientY - rect.top;
    }

    function handleSelectionUp() {
        isSelecting = false;
    }

    let blackHoleComponent = $state();

    function suckElementsIntoBlackHole(idsToSuck) {
        const bhEl = blackHoleComponent?.getElement();
        if (!bhEl || idsToSuck.size === 0) return;

        const bhRect = bhEl.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        const targetX = bhRect.left - gameRect.left + bhRect.width / 2 - 50;
        const targetY = bhRect.top - gameRect.top + bhRect.height / 2 - 50;

        const count = idsToSuck.size;

        gameState.canvasElements = gameState.canvasElements.map((el) => {
            if (idsToSuck.has(el.canvasId)) {
                return {
                    ...el,
                    isBeingSucked: true,
                    x: targetX,
                    y: targetY,
                };
            }
            return el;
        });

        showNotification("🌪️ Elemento absorbido", "success", "absorbed", count);

        setTimeout(() => {
            gameState.canvasElements = gameState.canvasElements.filter(
                (el) => !idsToSuck.has(el.canvasId),
            );
        }, 800);
    }

    function clearAllElements() {
        if (gameState.canvasElements.length === 0) return;
        const allIds = new Set(
            gameState.canvasElements.map((el) => el.canvasId),
        );
        suckElementsIntoBlackHole(allIds);
        selectedCanvasIds.clear();
    }

    function checkBlackHoleCollision(x, y) {
        const el = blackHoleComponent?.getElement();
        if (!el) return false;

        const bhRect = el.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();

        const bhLeft = bhRect.left - gameAreaRect.left;
        const bhTop = bhRect.top - gameAreaRect.top;
        const bhRight = bhLeft + bhRect.width;
        const bhBottom = bhTop + bhRect.height;

        return x >= bhLeft && x <= bhRight && y >= bhTop && y <= bhBottom;
    }

    function handleBlackHoleDrop(event) {
        event.stopPropagation();
        if (draggedCanvasElement) {
            const isGroup =
                selectedCanvasIds.has(draggedCanvasElement.canvasId) &&
                selectedCanvasIds.size > 1;
            const idsToSuck = isGroup
                ? new Set(selectedCanvasIds)
                : new Set([draggedCanvasElement.canvasId]);

            suckElementsIntoBlackHole(idsToSuck);
            if (isGroup) selectedCanvasIds.clear();
            draggedCanvasElement = null;
        }
    }

    function handleSidebarDrop(event) {
        const { element, x, y } = event.detail;

        if (checkBlackHoleCollision(x, y)) {
            showNotification("🌪️ Elemento absorbido", "success", "absorbed");
            return;
        }

        const dropX = x - 50;
        const dropY = y - 50;

        const droppedOn = gameState.canvasElements.find((el) => {
            const distance = Math.sqrt(
                Math.pow(el.x - dropX, 2) + Math.pow(el.y - dropY, 2),
            );
            return distance < 60;
        });

        if (droppedOn) {
            const result = gameState.combineElements(element.id, droppedOn.id);

            if (result) {
                gameState.canvasElements = gameState.canvasElements.filter(
                    (el) => el.canvasId !== droppedOn.canvasId,
                );

                gameState.addElementToCanvas(result, droppedOn.x, droppedOn.y);
                showNotification(`✨ ¡Descubriste ${result.name}!`, "success");
                return;
            } else {
                showNotification(
                    "❌ Esta combinación no funciona",
                    "error",
                    "error-combination",
                );
            }
        }

        gameState.addElementToCanvas(element, dropX, dropY);
    }

    function startDragCanvasElement(event, canvasElement) {
        // Handle both Mouse and Touch events
        const isTouch = event.type === "touchstart";
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;
        const clientY = isTouch ? event.touches[0].clientY : event.clientY;

        if (!isTouch && event.button !== 0) return;

        // Don't preventDefault on touchstart to allow scrolling if needed,
        // but for a game area we usually want to prevent it.
        if (isTouch) {
            // event.preventDefault(); // Might interfere with scrolling if not careful
        } else {
            event.preventDefault();
        }
        event.stopPropagation();

        gameState.selectInfoElement(canvasElement);

        const isCtrl = !isTouch && (event.ctrlKey || event.metaKey);

        if (selectedCanvasIds.has(canvasElement.canvasId)) {
            if (isCtrl) {
                selectedCanvasIds.delete(canvasElement.canvasId);
                return;
            }
            isDraggingGroup = true;
        } else {
            if (!isCtrl) {
                selectedCanvasIds.clear();
            }
            selectedCanvasIds.add(canvasElement.canvasId);
            isDraggingGroup = true;
        }

        draggedCanvasElement = canvasElement;

        const isPartofSelection = selectedCanvasIds.has(canvasElement.canvasId);

        gameState.canvasElements = gameState.canvasElements.map((el) => {
            if (
                el.canvasId === canvasElement.canvasId ||
                (isPartofSelection && selectedCanvasIds.has(el.canvasId))
            ) {
                return { ...el, isDragging: true };
            }
            return el;
        });

        const canvasRect =
            event.currentTarget.parentElement.getBoundingClientRect();

        dragOffset = {
            x: clientX - canvasRect.left - canvasElement.x,
            y: clientY - canvasRect.top - canvasElement.y,
        };
    }

    function handleCanvasMouseDown(event) {
        if (event.button !== 0) return;

        isSelecting = true;
        const rect = gameArea.getBoundingClientRect();
        const startX = event.clientX - rect.left;
        const startY = event.clientY - rect.top;

        selectionBox = {
            startX,
            startY,
            currentX: startX,
            currentY: startY,
        };

        if (!event.ctrlKey && !event.metaKey) {
            selectedCanvasIds.clear();
        }
    }

    function handleCanvasMouseMove(event) {
        if (isSelecting) return;
        if (!draggedCanvasElement) return;

        const isTouch = event.type === "touchmove";
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;
        const clientY = isTouch ? event.touches[0].clientY : event.clientY;

        if (isTouch) {
            // Already handled by touch-action: none in CSS
        }

        const rect = event.currentTarget.getBoundingClientRect();

        const newX = clientX - rect.left - dragOffset.x;
        const newY = clientY - rect.top - dragOffset.y;

        const deltaX = newX - draggedCanvasElement.x;
        const deltaY = newY - draggedCanvasElement.y;

        gameState.canvasElements = gameState.canvasElements.map((el) => {
            if (selectedCanvasIds.has(el.canvasId)) {
                return {
                    ...el,
                    x: el.x + deltaX,
                    y: el.y + deltaY,
                };
            }
            return el;
        });

        const updatedDragged = gameState.canvasElements.find(
            (el) => el.canvasId === draggedCanvasElement.canvasId,
        );
        if (updatedDragged) {
            draggedCanvasElement = updatedDragged;
        }
    }

    function handleCanvasMouseUp(event) {
        if (isSelecting) return;
        if (!draggedCanvasElement) return;

        // Touch events don't have coordinates in touchend usually,
        // we use the last known position from the element itself which was updated in touchmove.
        // We'll proceed with the existing logic using draggedCanvasElement properties.

        let blackHoleCollided = checkBlackHoleCollision(
            draggedCanvasElement.x + 50,
            draggedCanvasElement.y + 50,
        );

        if (
            !blackHoleCollided &&
            selectedCanvasIds.has(draggedCanvasElement.canvasId) &&
            selectedCanvasIds.size > 1
        ) {
            const selectedElements = gameState.canvasElements.filter((el) =>
                selectedCanvasIds.has(el.canvasId),
            );
            blackHoleCollided = selectedElements.some((el) =>
                checkBlackHoleCollision(el.x + 50, el.y + 50),
            );
        }

        if (blackHoleCollided) {
            const isGroup =
                selectedCanvasIds.has(draggedCanvasElement.canvasId) &&
                selectedCanvasIds.size > 1;
            const idsToSuck = isGroup
                ? new Set(selectedCanvasIds)
                : new Set([draggedCanvasElement.canvasId]);

            suckElementsIntoBlackHole(idsToSuck);
            if (isGroup) selectedCanvasIds.clear();
            draggedCanvasElement = null;
            return;
        }

        gameState.canvasElements = gameState.canvasElements.map((el) =>
            el.canvasId === draggedCanvasElement.canvasId
                ? { ...el, isDragging: false }
                : el,
        );

        const droppedOn = gameState.canvasElements.find((el) => {
            if (el.canvasId === draggedCanvasElement.canvasId) return false;
            const distance = Math.sqrt(
                Math.pow(el.x - draggedCanvasElement.x, 2) +
                    Math.pow(el.y - draggedCanvasElement.y, 2),
            );
            return distance < 60;
        });

        if (droppedOn) {
            const result = gameState.combineElements(
                draggedCanvasElement.id,
                droppedOn.id,
            );

            if (result) {
                gameState.canvasElements = gameState.canvasElements.filter(
                    (el) =>
                        el.canvasId !== draggedCanvasElement.canvasId &&
                        el.canvasId !== droppedOn.canvasId,
                );

                const midX = (draggedCanvasElement.x + droppedOn.x) / 2;
                const midY = (draggedCanvasElement.y + droppedOn.y) / 2;

                const resEl = {
                    ...result,
                    canvasId: gameState.nextCanvasId++,
                    x: midX,
                    y: midY,
                    isNew: true,
                };
                gameState.canvasElements = [...gameState.canvasElements, resEl];

                showNotification(`✨ ¡Descubriste ${result.name}!`, "success");

                setTimeout(() => {
                    gameState.canvasElements = gameState.canvasElements.map(
                        (el) =>
                            el.canvasId === resEl.canvasId
                                ? { ...el, isNew: false }
                                : el,
                    );
                }, 1000);
            } else {
                showNotification(
                    "❌ Esta combinación no funciona",
                    "error",
                    "error-combination",
                );
            }
        }

        gameState.canvasElements = gameState.canvasElements.map((el) => {
            if (el.isDragging) {
                return { ...el, isDragging: false };
            }
            return el;
        });

        draggedCanvasElement = null;
    }

    function handleElementClick(event, element) {
        if (element.canvasId === rapidFireId) {
            duplicateElement(event, element);
        }
    }

    function duplicateElement(event, element) {
        event?.stopPropagation();
        rapidFireId = element.canvasId;
        clearTimeout(rapidFireTimer);
        rapidFireTimer = setTimeout(() => {
            rapidFireId = null;
        }, 400);

        gameState.addElementToCanvas(element, element.x, element.y);
        showNotification("✨ Elemento duplicado", "success", "duplicate");
    }

    function removeCanvasElement(canvasId) {
        gameState.canvasElements = gameState.canvasElements.filter(
            (el) => el.canvasId !== canvasId,
        );
    }

    function showNotification(message, type, stackKey = null, increment = 1) {
        if (stackKey) {
            const existing = notifications.find((n) => n.stackKey === stackKey);
            if (existing) {
                existing.count = (existing.count || 1) + increment;
                existing.message = message;
                notifications = [...notifications];

                if (existing.timeoutId) clearTimeout(existing.timeoutId);
                existing.timeoutId = setTimeout(() => {
                    notifications = notifications.filter(
                        (n) => n.id !== existing.id,
                    );
                }, 3000);
                return;
            }
        }

        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
            message,
            type,
            id,
            stackKey,
            count: increment,
            timeoutId: null,
        };

        newNotification.timeoutId = setTimeout(() => {
            notifications = notifications.filter((n) => n.id !== id);
        }, 5000);

        notifications = [...notifications, newNotification];

        // Limit total notifications to avoid cluttering, especially on mobile
        if (notifications.length > 3) {
            const removed = notifications.shift();
            if (removed.timeoutId) clearTimeout(removed.timeoutId);
        }
    }

    function ensureElementsInBounds() {
        if (!gameArea) return;
        const rect = gameArea.getBoundingClientRect();
        const padding = 20;
        const elementSize = 85;

        let changed = false;
        const boundedElements = gameState.canvasElements.map((el) => {
            let newX = el.x;
            let newY = el.y;

            // X bounds
            if (newX < padding) {
                newX = padding;
                changed = true;
            } else if (newX > rect.width - elementSize - padding) {
                newX = Math.max(padding, rect.width - elementSize - padding);
                changed = true;
            }

            // Y bounds
            if (newY < padding) {
                newY = padding;
                changed = true;
            } else if (newY > rect.height - elementSize - padding) {
                newY = Math.max(padding, rect.height - elementSize - padding);
                changed = true;
            }

            if (changed) {
                return { ...el, x: newX, y: newY };
            }
            return el;
        });

        if (changed) {
            gameState.canvasElements = boundedElements;
        }
    }

    // Effect for standard event listeners
    $effect(() => {
        if (gameArea) {
            gameArea.addEventListener("sidebarDrop", handleSidebarDrop);
            window.addEventListener("resize", ensureElementsInBounds);

            // Initial check to handle mount-time alignment
            setTimeout(ensureElementsInBounds, 100);

            return () => {
                gameArea.removeEventListener("sidebarDrop", handleSidebarDrop);
                window.removeEventListener("resize", ensureElementsInBounds);
            };
        }
    });
</script>

<svelte:window onkeydown={handleKeyChange} onkeyup={handleKeyChange} />

<div
    class="game-area"
    class:sidebar-open={sidebarOpen}
    class:ctrl-active={isCtrlPressed}
    bind:this={gameArea}
    onmousedown={handleCanvasMouseDown}
    onmousemove={handleCanvasMouseMove}
    ontouchmove={handleCanvasMouseMove}
    onmouseup={handleCanvasMouseUp}
    ontouchend={handleCanvasMouseUp}
    onkeydown={(e) => {
        if (e.key === "Control") isCtrlPressed = true;
    }}
    onkeyup={(e) => {
        if (e.key === "Control") isCtrlPressed = false;
    }}
    role="application"
    aria-label="Área de juego de alquimia"
    style="touch-action: none;"
    tabindex="0"
>
    <div class="canvas-header">
        <h1>⚗️ Alquimia Infinita</h1>
        <p class="subtitle">Descubre el universo combinando elementos</p>
    </div>

    <div class="canvas-elements">
        {#each gameState.canvasElements as canvasElement (canvasElement.canvasId)}
            <div
                class="canvas-element"
                class:selected={selectedCanvasIds.has(canvasElement.canvasId)}
                class:is-new={canvasElement.isNew}
                class:is-being-sucked={canvasElement.isBeingSucked}
                class:is-dragging={canvasElement.isDragging}
                style="left: {canvasElement.x}px; top: {canvasElement.y}px;"
                data-category={canvasElement.category}
                onmousedown={(e) => {
                    if (e.altKey) {
                        duplicateElement(e, canvasElement);
                    } else {
                        startDragCanvasElement(e, canvasElement);
                    }
                }}
                ontouchstart={(e) => startDragCanvasElement(e, canvasElement)}
                onclick={(e) => handleElementClick(e, canvasElement)}
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        gameState.selectInfoElement(canvasElement);
                    }
                }}
                role="button"
                tabindex="0"
                aria-label={canvasElement.name}
            >
                <div class="element-icon-wrapper">
                    <ElementIcon
                        name={canvasElement.icon}
                        size={36}
                        color="var(--cat-color, var(--accent-primary))"
                        strokeWidth={2.5}
                    />
                    <div class="element-glow"></div>
                </div>
                <span class="canvas-name">{canvasElement.name}</span>
            </div>
        {/each}
    </div>

    {#if isSelecting}
        <div
            class="selection-box"
            style="
                left: {Math.min(selectionBox.startX, selectionBox.currentX)}px;
                top: {Math.min(selectionBox.startY, selectionBox.currentY)}px;
                width: {Math.abs(
                selectionBox.startX - selectionBox.currentX,
            )}px;
                height: {Math.abs(
                selectionBox.startY - selectionBox.currentY,
            )}px;
            "
        ></div>
    {/if}

    <BlackHole
        bind:this={blackHoleComponent}
        onclear={clearAllElements}
        ondrop={handleBlackHoleDrop}
    />

    {#if gameState.canvasElements.length === 0}
        <div class="empty-state" in:fade={{ duration: 500 }}>
            <div class="empty-icon">🧪</div>
            <h2 class="empty-text">Tu laboratorio está listo</h2>
            <p class="empty-hint">
                Abre el libro de elementos y arrastra ingredientes aquí <br />
                para comenzar tu gran obra.
            </p>
        </div>
    {/if}

    <div class="notifications-container">
        {#each notifications as notification (notification.id)}
            <div
                class="notification {notification.type} premium-glass"
                transition:fly={{ x: -20, duration: 300 }}
            >
                {#if notification.type === "success"}
                    <span class="icon">✨</span>
                {:else}
                    <span class="icon">⚠️</span>
                {/if}
                <span class="message">{notification.message}</span>
                {#if notification.count > 1}
                    <span class="notification-count">{notification.count}</span>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .game-area {
        position: relative;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
        overflow: hidden;
        outline: none;
    }

    .canvas-header {
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 10;
        pointer-events: none;
        width: 100%;
        padding: 0 20px;
    }

    h1 {
        margin: 0;
        font-size: clamp(1.5rem, 5vw, 3rem);
        background: linear-gradient(
            to bottom,
            #fff 30%,
            var(--accent-primary) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    }

    .subtitle {
        margin-top: 0.5rem;
        color: var(--text-secondary);
        font-size: clamp(0.875rem, 2vw, 1.125rem);
        font-weight: 500;
        opacity: 0.8;
    }

    .canvas-elements {
        position: absolute;
        inset: 0;
    }

    .canvas-element {
        position: absolute;
        width: 85px;
        height: 85px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: grab;
        transition:
            transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
            left 0.3s cubic-bezier(0.23, 1, 0.32, 1),
            top 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        z-index: 100;
        border-radius: var(--border-radius-md);
        user-select: none;
        outline: none;
    }

    .canvas-element:active {
        cursor: grabbing;
        transform: scale(1.1);
        z-index: 1000;
    }

    .canvas-element.is-dragging {
        transition: none;
        z-index: 2000;
    }

    .element-icon-wrapper {
        position: relative;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        transition: all 0.2s ease;
        border-radius: 50%;
    }

    .canvas-element.selected .element-icon-wrapper {
        background: rgba(255, 255, 255, 0.15);
        border: 2px solid #fff;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .canvas-name {
        font-size: 0.75rem;
        color: var(--text-primary);
        font-weight: 600;
        pointer-events: none;
        max-width: 85px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .canvas-element.is-new {
        animation: elementAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .canvas-element.is-being-sucked {
        transition: all 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045);
        transform: scale(0) rotate(720deg) !important;
        opacity: 0;
        z-index: 1000;
        pointer-events: none;
    }

    /* Categories */
    [data-category="Origen"] {
        --cat-color: #f87171;
    }
    [data-category="Fenómenos"] {
        --cat-color: #60a5fa;
    }
    [data-category="Materiales"] {
        --cat-color: #a8a29e;
    }
    [data-category="Vida"] {
        --cat-color: #4ade80;
    }
    [data-category="Tecnología"] {
        --cat-color: #22d3ee;
    }
    [data-category="Espacio"] {
        --cat-color: #c084fc;
    }
    [data-category="Objetos"] {
        --cat-color: #fbbf24;
    }
    [data-category="Construcción"] {
        --cat-color: #fb923c;
    }
    [data-category="Conceptos"] {
        --cat-color: #818cf8;
    }
    [data-category="Naturaleza"] {
        --cat-color: #34d399;
    }

    .selection-box {
        position: absolute;
        border: 1px solid var(--accent-primary);
        background: rgba(139, 92, 246, 0.1);
        pointer-events: none;
        z-index: 9999;
        border-radius: 4px;
    }

    .empty-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        pointer-events: none;
        width: 100%;
        max-width: 400px;
        padding: 20px;
    }

    .empty-icon {
        font-size: 5rem;
        margin-bottom: 1.5rem;
        opacity: 0.2;
        animation: float 4s ease-in-out infinite;
    }

    .empty-text {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .empty-hint {
        color: var(--text-secondary);
        font-size: 1rem;
        line-height: 1.6;
    }

    .notifications-container {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 10000;
        pointer-events: none;
        width: fit-content;
        max-width: 90vw;
    }

    .notification {
        padding: 0.75rem 1.25rem;
        border-radius: var(--border-radius-md);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        pointer-events: auto;
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .notification.success {
        border-color: var(--success);
    }
    .notification.error {
        border-color: var(--error);
    }

    .notification-count {
        background: rgba(255, 255, 255, 0.2);
        padding: 1px 8px;
        border-radius: 10px;
        font-size: 0.75rem;
    }

    @media (max-width: 768px) {
        .canvas-header {
            top: 1.5rem;
        }
        .canvas-element {
            width: 68px;
            height: 68px;
        }
        .element-icon-wrapper {
            width: 44px;
            height: 44px;
        }
        .canvas-name {
            font-size: 0.65rem;
        }

        .notifications-container {
            top: 20px;
            bottom: auto;
        }
    }

    @media (orientation: landscape) and (max-height: 520px) {
        .canvas-header {
            top: 10px;
            left: 20px;
            transform: none;
            text-align: left;
            width: auto;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(8px);
            padding: 8px 16px;
            border-radius: var(--border-radius-md);
        }

        h1 {
            font-size: 1.25rem;
        }
        .subtitle {
            display: none;
        }
        .empty-state {
            transform: translate(-50%, -50%) scale(0.7);
        }

        .notifications-container {
            top: auto;
            bottom: 10px;
            left: auto;
            right: 10px;
            transform: none;
            align-items: flex-end;
            max-width: 280px;
        }

        .notification {
            padding: 8px 12px;
            font-size: 0.8rem;
        }
    }
    @keyframes elementAppear {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        70% {
            transform: scale(1.15);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
</style>
