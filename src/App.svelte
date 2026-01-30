<script>
  import Sidebar from "./lib/Sidebar.svelte";
  import GameArea from "./lib/GameArea.svelte";
  import InfoPanel from "./lib/InfoPanel.svelte";
  import { gameState } from "./lib/store.svelte.js";
  import { fly, fade } from "svelte/transition";

  function toggleSidebar() {
    gameState.sidebarOpen = !gameState.sidebarOpen;
  }

  function handleNavigation(view) {
    gameState.currentView = view;
    // If exploring other views on mobile, auto-close sidebar
    if (window.innerWidth <= 768) {
      gameState.sidebarOpen = false;
    }
  }
</script>

<main class="app-container">
  <div class="layout-wrapper" class:sidebar-open={gameState.sidebarOpen}>
    <Sidebar
      bind:isOpen={gameState.sidebarOpen}
      onNavigate={handleNavigation}
      bind:currentView={gameState.currentView}
    />

    <section class="main-content">
      <InfoPanel />

      {#if gameState.currentView === "elements"}
        <GameArea sidebarOpen={gameState.sidebarOpen} />
      {:else}
        <div class="placeholder-area">
          <div class="placeholder-card premium-glass">
            <h1>
              {#if gameState.currentView === "info"}Información
              {:else if gameState.currentView === "tree"}Árbol de
                Descubrimientos
              {:else if gameState.currentView === "hints"}Pistas
              {:else if gameState.currentView === "achievements"}Logros
              {/if}
            </h1>
            <p>Esta sección está en construcción.</p>
          </div>
        </div>
      {/if}
    </section>
  </div>
</main>

<style>
  .app-container {
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .layout-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .main-content {
    flex: 1;
    position: relative;
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    /* No horizontal margin needed - Sidebar is fixed or absolute */
    overflow: hidden;
  }

  .placeholder-area {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .placeholder-card {
    padding: 3rem;
    text-align: center;
    border-radius: var(--border-radius-lg);
    max-width: 500px;
    width: 100%;
  }

  .placeholder-card h1 {
    color: var(--accent-primary);
    margin-bottom: 1rem;
  }

  .placeholder-card p {
    color: var(--text-secondary);
  }
</style>
