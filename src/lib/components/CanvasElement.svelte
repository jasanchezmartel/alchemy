<script>
    import ElementIcon from "./ElementIcon.svelte";

    let {
        canvasElement,
        selected = false,
        onmousedown,
        ontouchstart,
        onclick,
        onkeydown,
    } = $props();
</script>

<div
    class="canvas-element"
    class:selected
    class:is-new={canvasElement.isNew}
    class:is-being-sucked={canvasElement.isBeingSucked}
    class:is-dragging={canvasElement.isDragging}
    style="left: {canvasElement.x}px; top: {canvasElement.y}px;"
    data-category={canvasElement.category}
    {onmousedown}
    {ontouchstart}
    {onclick}
    {onkeydown}
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
    </div>
    <span class="canvas-name">{canvasElement.name}</span>
</div>

<style>
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
    [data-category="Naturaleza"] {
        --cat-color: #4ade80;
    }
    [data-category="Materiales"] {
        --cat-color: #fbbf24;
    }
    [data-category="Vida"] {
        --cat-color: #f472b6;
    }
    [data-category="Tecnología"] {
        --cat-color: #94a3b8;
    }
    [data-category="Espacio"] {
        --cat-color: #818cf8;
    }
    [data-category="Objetos"] {
        --cat-color: #a78bfa;
    }
    [data-category="Construcción"] {
        --cat-color: #fb923c;
    }
    [data-category="Conceptos"] {
        --cat-color: #2dd4bf;
    }

    @media (max-width: 768px) {
        .canvas-element {
            width: 68px;
            height: 68px;
        }
        .canvas-name {
            font-size: 0.65rem;
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
</style>
