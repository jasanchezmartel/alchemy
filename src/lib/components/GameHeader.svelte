<script>
</script>

<div class="canvas-header">
    <h1>⚗️ Alquimia Infinita</h1>
    <p class="subtitle">Descubre el universo combinando elementos</p>
</div>

<style>
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

    @media (max-width: 768px) {
        .canvas-header {
            top: 1.5rem;
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
    }
</style>
