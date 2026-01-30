<script>
    import { ChevronLeft, ChevronRight } from "lucide-svelte";

    let { isOpen = true, onclick } = $props();
</script>

<button
    class="toggle-btn"
    {onclick}
    class:open={isOpen}
    aria-label="Toggle Sidebar"
>
    {#if isOpen}
        <ChevronLeft size={20} />
    {:else}
        <ChevronRight size={20} />
    {/if}
</button>

<style>
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

    .toggle-btn.open {
        left: var(--sidebar-width);
    }

    .toggle-btn:hover {
        background: var(--accent-secondary);
        padding-left: 5px;
    }

    @media (max-width: 768px) {
        .toggle-btn.open {
            left: 85vw;
        }

        @media (orientation: landscape) and (max-height: 520px) {
            .toggle-btn.open {
                left: 280px;
            }
            .toggle-btn {
                height: 60px;
            }
        }
    }
</style>
