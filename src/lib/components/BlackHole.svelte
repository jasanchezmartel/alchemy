<script>
    let { onclear, ondrop } = $props();
    let blackHoleElement = $state();

    const particles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.7,
        rotation: i * 60,
    }));

    function handleClick(event) {
        event.stopPropagation();
        if (onclear) onclear();
    }

    // Expose element for collision detection
    export function getElement() {
        return blackHoleElement;
    }
</script>

<div
    class="black-hole-container"
    onclick={handleClick}
    onmousedown={(e) => e.stopPropagation()}
    onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            handleClick(e);
        }
    }}
    onmouseup={ondrop}
    role="button"
    tabindex="0"
    aria-label="Agujero negro: Borrar todo"
    bind:this={blackHoleElement}
>
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <radialGradient id="holeGradient">
                <stop offset="75%" stop-color="black" />
                <stop offset="92%" stop-color="#4b0082" />
                <stop offset="100%" stop-color="#00f2ff" />
            </radialGradient>
        </defs>

        {#each particles as p}
            <g
                class="vortex"
                style="--delay: {p.delay}s; --rot: {p.rotation}deg;"
            >
                <circle class="particle" cx="100" cy="100" r="2" />
            </g>
        {/each}

        <circle
            class="singularity"
            cx="100"
            cy="100"
            r="35"
            fill="url(#holeGradient)"
            filter="url(#glow)"
        />

        <circle
            class="accretion-disk"
            cx="100"
            cy="100"
            r="38"
            fill="none"
            stroke="#00f2ff"
            stroke-width="0.5"
            opacity="0.3"
        />
    </svg>
</div>

<style>
    .black-hole-container {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
        cursor: pointer;
        z-index: 5000;
        transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
        .black-hole-container {
            bottom: 10px;
            right: 10px;
            width: 75px;
            height: 75px;
        }
    }

    .singularity {
        animation: bh-pulse 4s ease-in-out infinite;
        transform-origin: center;
        transition: all 0.3s ease;
    }

    .black-hole-container:hover .singularity {
        transform: scale(1.15);
        filter: brightness(1.5) drop-shadow(0 0 15px #00f2ff);
    }

    .vortex {
        transform-origin: center;
        animation: bh-orbit 3s linear infinite;
        animation-delay: var(--delay);
        transform: rotate(var(--rot));
        transition: animation-duration 0.3s ease;
    }

    .black-hole-container:hover .vortex {
        animation-duration: 1s;
    }

    .particle {
        fill: #00f2ff;
        filter: drop-shadow(0 0 2px #00f2ff);
        animation: bh-suck-in 3s ease-in infinite;
        animation-delay: var(--delay);
        opacity: 0;
        transition: fill 0.3s ease;
    }

    .black-hole-container:hover .particle {
        animation-duration: 1s;
        fill: #fff;
    }

    @keyframes bh-orbit {
        from {
            transform: rotate(var(--rot));
        }
        to {
            transform: rotate(calc(var(--rot) - 360deg));
        }
    }

    @keyframes bh-suck-in {
        0% {
            transform: translate(80px, -20px) scale(1.5);
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 0.8;
        }
        100% {
            transform: translate(0px, 0px) scale(0);
            opacity: 0;
        }
    }

    @keyframes bh-pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
</style>
