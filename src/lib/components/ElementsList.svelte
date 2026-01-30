<script>
    import { gameState } from "../store.svelte.js";
    import { slide } from "svelte/transition";
    import ElementIcon from "./ElementIcon.svelte";

    // props replacement in Svelte 5
    let { onDragStart } = $props();

    let searchTerm = $state("");
    let expandedCategories = $state({});

    // Use $derived for reactive derived state
    let elementsByCategory = $derived(
        gameState.elements.reduce((acc, el) => {
            if (
                searchTerm &&
                !el.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return acc;
            }

            const cat = el.category || "Otros";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(el);
            return acc;
        }, {}),
    );

    const categoryOrder = [
        "Origen",
        "Fenómenos",
        "Naturaleza",
        "Vida",
        "Materiales",
        "Construcción",
    ];

    let sortedCategories = $derived(
        Object.keys(elementsByCategory).sort((a, b) => {
            const idxA = categoryOrder.indexOf(a);
            const idxB = categoryOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        }),
    );

    // Effect replacement for reactive reactivity on searchTerm change
    $effect(() => {
        if (searchTerm) {
            sortedCategories.forEach((cat) => {
                expandedCategories[cat] = true;
            });
        }
    });

    function toggleCategory(cat) {
        expandedCategories[cat] = !expandedCategories[cat];
    }

    function handleMouseDown(event, element) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return;
        if (onDragStart) onDragStart({ event, element });
    }
</script>

<div class="elements-list-container">
    <div class="search-container">
        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
                type="text"
                placeholder="Buscar elemento..."
                bind:value={searchTerm}
                class="search-input"
            />
        </div>
    </div>

    <div class="elements-scroll-area">
        {#each sortedCategories as category}
            <div class="category-block">
                <button
                    class="category-header"
                    class:is-expanded={expandedCategories[category]}
                    onclick={() => toggleCategory(category)}
                    aria-expanded={expandedCategories[category]}
                >
                    <span class="category-name">{category}</span>
                </button>

                {#if expandedCategories[category]}
                    <div
                        class="category-content"
                        transition:slide={{ duration: 200 }}
                    >
                        <div class="category-grid">
                            {#each elementsByCategory[category] as element (element.id)}
                                <div
                                    class="element-item"
                                    onmousedown={(e) =>
                                        handleMouseDown(e, element)}
                                    role="button"
                                    tabindex="0"
                                    aria-label={element.name}
                                    onclick={() => {
                                        const isMobile =
                                            window.innerWidth <= 768;
                                        if (isMobile) {
                                            gameState.addElementToCanvas(
                                                element,
                                            );
                                        } else {
                                            gameState.selectInfoElement(
                                                element,
                                            );
                                        }
                                    }}
                                    onkeydown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            const isMobile =
                                                window.innerWidth <= 768;
                                            if (isMobile) {
                                                gameState.addElementToCanvas(
                                                    element,
                                                );
                                            } else {
                                                gameState.selectInfoElement(
                                                    element,
                                                );
                                            }
                                        }
                                    }}
                                >
                                    <div
                                        class="element-icon-container"
                                        data-category={element.category}
                                    >
                                        <ElementIcon
                                            name={element.icon}
                                            size={28}
                                            color="var(--cat-color, #8b5cf6)"
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span class="element-label"
                                        >{element.name}</span
                                    >
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/each}

        {#if sortedCategories.length === 0}
            <div class="no-results">No se encontraron elementos</div>
        {/if}
    </div>
</div>

<style>
    .elements-list-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: var(--text-primary);
    }

    .search-container {
        margin-bottom: 1.5rem;
    }

    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 1px solid var(--glass-border);
        border-radius: var(--border-radius-md);
        padding: 0 1rem;
        height: 48px;
        transition: all 0.3s ease;
    }

    .search-box:focus-within {
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 2px var(--accent-glow);
    }

    .search-icon {
        font-size: 1rem;
        margin-right: 0.75rem;
        opacity: 0.5;
    }

    .search-input {
        background: transparent;
        border: none;
        color: var(--text-primary);
        width: 100%;
        font-size: 0.875rem;
        outline: none;
        font-family: inherit;
    }

    .elements-scroll-area {
        flex: 1;
        overflow-y: auto;
        padding-right: 4px;
    }

    .category-block {
        margin-bottom: 0.5rem;
    }

    .category-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        background: var(--panel-header-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--border-radius-md);
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        color: var(--text-primary);
    }

    .category-header:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--accent-primary);
    }

    .category-header::after {
        content: "▼";
        font-size: 0.625rem;
        opacity: 0.5;
        transition: transform 0.2s;
    }

    .category-header.is-expanded::after {
        transform: rotate(180deg);
    }

    .category-name {
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.025em;
        text-transform: uppercase;
        color: var(--text-secondary);
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
        gap: 1rem;
        padding: 1rem 0.5rem 1.5rem;
    }

    .element-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: grab;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        padding: 0.5rem;
        border-radius: var(--border-radius-sm);
    }

    .element-item:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: scale(1.05);
    }

    .element-icon-container {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--glass-border);
        transition: all 0.3s ease;
    }

    .element-item:hover .element-icon-container {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--cat-color);
        box-shadow: 0 0 15px var(--cat-color);
    }

    .element-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 600;
        text-align: center;
        line-height: 1.2;
        transition: color 0.2s;
    }

    .element-item:hover .element-label {
        color: var(--text-primary);
    }

    [data-category="Origen"] {
        --cat-color: var(--category-origin);
    }
    [data-category="Fenómenos"] {
        --cat-color: var(--category-phenomena);
    }
    [data-category="Materiales"] {
        --cat-color: var(--category-materials);
    }
    [data-category="Vida"] {
        --cat-color: var(--category-life);
    }
    [data-category="Tecnología"] {
        --cat-color: var(--category-technology);
    }
    [data-category="Espacio"] {
        --cat-color: var(--category-space);
    }
    [data-category="Objetos"] {
        --cat-color: var(--category-objects);
    }
    [data-category="Construcción"] {
        --cat-color: var(--category-construction);
    }
    [data-category="Conceptos"] {
        --cat-color: var(--category-concepts);
    }
    [data-category="Naturaleza"] {
        --cat-color: var(--category-nature);
    }

    .no-results {
        text-align: center;
        color: var(--text-muted);
        margin-top: 2.5rem;
        font-style: italic;
    }
</style>
