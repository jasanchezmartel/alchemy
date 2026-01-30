<script>
    import { SvelteSet } from "svelte/reactivity";
    import { gameState } from "./store.svelte.js";
    import BlackHole from "./components/BlackHole.svelte";
    import CanvasElement from "./components/CanvasElement.svelte";
    import SelectionBox from "./components/SelectionBox.svelte";
    import EmptyState from "./components/EmptyState.svelte";
    import NotificationContainer from "./components/NotificationContainer.svelte";
    import GameHeader from "./components/GameHeader.svelte";

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
    <GameHeader />

    <div class="canvas-elements">
        {#each gameState.canvasElements as canvasElement (canvasElement.canvasId)}
            <CanvasElement
                {canvasElement}
                selected={selectedCanvasIds.has(canvasElement.canvasId)}
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
            />
        {/each}
    </div>

    <SelectionBox {selectionBox} {isSelecting} />

    <BlackHole
        bind:this={blackHoleComponent}
        onclear={clearAllElements}
        ondrop={handleBlackHoleDrop}
    />

    <EmptyState visible={gameState.canvasElements.length === 0} />

    <NotificationContainer {notifications} />
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

    .canvas-elements {
        position: absolute;
        inset: 0;
    }
</style>
