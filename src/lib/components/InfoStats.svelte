<script>
    import { Sparkles } from "lucide-svelte";

    let { complexity = 0, combinationsLeft = 0 } = $props();
</script>

<div class="section">
    <h4>Nivel de Alquimia</h4>
    <div class="complexity-container">
        <div class="complexity-badge" style="--tier: {complexity}">
            <Sparkles
                size={14}
                fill={complexity > 0 ? "#fbbf24" : "currentColor"}
            />
            <span>Tier {complexity}</span>
        </div>
        <p class="complexity-desc">
            {#if complexity === 0}
                Elemento fundamental de la naturaleza.
            {:else}
                Requiere {complexity} niveles de transmutación.
            {/if}
        </p>
    </div>
</div>

<div class="divider"></div>

<div class="section">
    <h4>Posibilidades</h4>
    <div class="stats">
        <span class="highlight">{combinationsLeft}</span>
        <span class="label">combinaciones por descubrir</span>
    </div>
</div>

<style>
    .section h4 {
        margin: 0 0 14px 0;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: var(--text-faded);
        font-weight: 900;
    }

    .complexity-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .complexity-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: var(--badge-warning-bg);
        border: 1px solid var(--badge-warning-border);
        border-radius: var(--border-radius-full);
        color: var(--badge-warning-text);
        font-size: 14px;
        font-weight: 700;
        width: fit-content;
    }

    .complexity-desc {
        margin: 0;
        font-size: 12px;
        color: var(--text-faded-light);
        line-height: 1.4;
    }

    .divider {
        height: 1px;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        margin: 20px 0;
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .highlight {
        font-size: 36px;
        font-weight: 900;
        color: #8b5cf6;
        line-height: 1;
        text-shadow: 0 0 25px rgba(139, 92, 246, 0.5);
    }

    .label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 500;
        padding-left: 2px;
    }

    @media (max-width: 768px) {
        .section h4 {
            margin-bottom: 8px;
            font-size: 10px;
        }
        .divider {
            margin: 12px 0;
        }
        .complexity-badge {
            padding: 4px 10px;
            font-size: 12px;
        }
        .complexity-desc {
            font-size: 11px;
        }
        .highlight {
            font-size: 28px;
        }
        .label {
            font-size: 12px;
        }
        @media (orientation: landscape) and (max-height: 520px) {
            .divider {
                margin: 10px 0;
            }
            .highlight {
                font-size: 24px;
            }
        }
    }
</style>
