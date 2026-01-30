<script>
    import { fly } from "svelte/transition";

    let { notifications = [] } = $props();
</script>

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

<style>
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
        .notifications-container {
            top: 20px;
            bottom: auto;
        }
    }

    @media (orientation: landscape) and (max-height: 520px) {
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
</style>
