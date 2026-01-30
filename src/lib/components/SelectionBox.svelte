<script>
    let { selectionBox, isSelecting = false } = $props();
</script>

{#if isSelecting}
    <div
        class="selection-box"
        style="
            left: {Math.min(selectionBox.startX, selectionBox.currentX)}px;
            top: {Math.min(selectionBox.startY, selectionBox.currentY)}px;
            width: {Math.abs(selectionBox.startX - selectionBox.currentX)}px;
            height: {Math.abs(selectionBox.startY - selectionBox.currentY)}px;
        "
    ></div>
{/if}

<style>
    .selection-box {
        position: absolute;
        border: 1px solid var(--accent-primary);
        background: rgba(139, 92, 246, 0.1);
        pointer-events: none;
        z-index: 9999;
        border-radius: 4px;
    }
</style>
