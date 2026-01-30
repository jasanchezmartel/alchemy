<script>
    import { fade } from "svelte/transition";

    let { visible = false } = $props();
</script>

{#if visible}
    <div class="empty-state" in:fade={{ duration: 500 }}>
        <div class="empty-icon">🧪</div>
        <h2 class="empty-text">Tu laboratorio está listo</h2>
        <p class="empty-hint">
            Abre el libro de elementos y arrastra ingredientes aquí <br />
            para comenzar tu gran obra.
        </p>
    </div>
{/if}

<style>
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

    @media (orientation: landscape) and (max-height: 520px) {
        .empty-state {
            transform: translate(-50%, -50%) scale(0.7);
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
