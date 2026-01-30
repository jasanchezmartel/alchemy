<script>
    import * as Icons from "lucide-svelte";

    // Svelte 5 uses $props() for component properties
    let {
        name = "HelpCircle",
        size = 32,
        color = "currentColor",
        strokeWidth = 2,
    } = $props();

    // Map named icons to Svelte components
    const IconComponent = $derived(Icons[name] || Icons.HelpCircle);
</script>

<IconComponent {size} {color} {strokeWidth} />
