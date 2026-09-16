# Component API Design

Patterns for designing component APIs: variant props, compound components, forward ref, accessibility, motion, and cross-framework patterns.

## Variant props: union types vs boolean explosion

Use a single union-typed variant prop. Never use boolean combinations.

```tsx
// Correct: union type
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "destructive";
  size: "sm" | "md" | "lg";
}

// Wrong: boolean explosion (untestable combinatorial explosion)
interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  destructive?: boolean;
}
```

Boolean explosion creates impossible states (`primary` and `ghost` both true) and scales poorly. A union type is exhaustive, tree-shakeable, and self-documenting.

## Compound components

Compound components compose instead of accepting a config object with many props. Use when a component has distinct sub-parts that consumers assemble independently.

```tsx
// Compound: flexible composition
<Card>
  <Card.Header>
    <Card.Title>Plan details</Card.Title>
    <Card.Action>Upgrade</Card.Action>
  </Card.Header>
  <Card.Body>
    <p>Your current plan includes 5 seats.</p>
  </Card.Body>
  <Card.Footer>Updated 2 hours ago</Card.Footer>
</Card>

// Config-based: rigid, prop explosion
<Card
  title="Plan details"
  action="Upgrade"
  body="Your current plan includes 5 seats."
  footer="Updated 2 hours ago"
/>
```

### When to use compound vs config-based

| Pattern | Use when | Example |
|---|---|---|
| Compound | Sub-parts are optional, reorderable, or independently styled | Card, Dialog, Tabs, Menu |
| Config-based | Structure is fixed, props are simple primitives | Button, Input, Badge |

### Button.Icon and Button.Label

```tsx
import { forwardRef } from "react";

const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", children, ...props }, ref) => (
    <button ref={ref} data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  )
);
ButtonRoot.displayName = "Button";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="button-icon">{children}</span>
);
Icon.displayName = "Button.Icon";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="button-label">{children}</span>
);
Label.displayName = "Button.Label";

export const Button = Object.assign(ButtonRoot, { Icon, Label });
```

```tsx
// Usage
<Button variant="primary">
  <Button.Icon><PlusIcon /></Button.Icon>
  <Button.Label>Add item</Button.Label>
</Button>
```

## Forward ref patterns (React)

Always forward ref. Expose imperative API only when necessary (focus, scroll, measure).

```tsx
import { forwardRef, useImperativeHandle, useRef } from "react";

interface InputHandle {
  focus: () => void;
  clear: () => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

    return (
      <label>
        {label && <span className="input-label">{label}</span>}
        <input ref={internalRef} aria-invalid={!!error} {...props} />
        {error && <span className="input-error" role="alert">{error}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";
```

## Props table documentation

Every component ships a props table in its MDX docs.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "destructive"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control size |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows spinner, disables click |
| `onClick` | `(e: MouseEvent) => void` | undefined | Click handler |
| `children` | `ReactNode` | undefined | Label content |

## Accessibility spec per component

Every component documents its accessibility contract.

```mdx
## Accessibility

| Attribute | Value | Condition |
|---|---|---|
| `role` | `button` | Always (native button) |
| `aria-disabled` | `true` | When `disabled` is true |
| `aria-busy` | `true` | When `loading` is true |
| `tabindex` | `-1` | When `disabled` is true |

### Keyboard navigation
| Key | Action |
|---|---|
| `Enter` | Activates button |
| `Space` | Activates button |
| `Tab` | Moves focus to next focusable element |

### Focus management
Focus is visible via `:focus-visible` ring using `color.action.primary` token.
```

## Motion spec per component

```mdx
## Motion

| State | Duration token | Easing token | Property |
|---|---|---|---|
| Hover | `motion.duration.fast` | `motion.easing.standard` | `background-color` |
| Press | `motion.duration.fast` | `motion.easing.standard` | `transform: scale(0.98)` |
| Focus | `motion.duration.fast` | `motion.easing.standard` | `box-shadow` |

### Reduced motion
All animations disabled when `prefers-reduced-motion: reduce`. Scale and color transitions become instant.
```

## Default props as token references

Default props reference tokens, never hardcoded values.

```tsx
// Correct: token reference
const buttonStyles = {
  padding: "var(--space-2) var(--space-4)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--font-size-body)",
  transition: "background-color var(--motion-duration-fast) var(--motion-easing-standard)",
};

// Wrong: hardcoded values
const buttonStyles = {
  padding: "8px 16px",
  borderRadius: "6px",
  fontSize: "16px",
  transition: "background-color 150ms ease",
};
```

## TypeScript types and generics

Use generics for data-driven components (tables, selects, lists).

```tsx
interface SelectProps<T> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function Select<T>({ value, options, onChange }: SelectProps<T>) {
  return (
    <select value={String(value)} onChange={(e) => onChange(options[Number(e.target.value)].value)}>
      {options.map((opt, i) => (
        <option key={i} value={i}>{opt.label}</option>
      ))}
    </select>
  );
}

// Usage: type inference works
<Select value="active" options={[{ value: "active", label: "Active" }]} onChange={(v) => {}} />
```

## Flutter widget API patterns

```dart
enum ButtonVariant { primary, secondary, ghost, destructive }
enum ButtonSize { small, medium, large }

class Button extends StatelessWidget {
  final ButtonVariant variant;
  final ButtonSize size;
  final bool disabled;
  final VoidCallback? onPressed;
  final Widget child;

  const Button({
    super.key,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.disabled = false,
    this.onPressed,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final tokens = DesignTokens.of(context);
    return GestureDetector(
      onTap: disabled ? null : onPressed,
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: tokens.space4,
          vertical: tokens.space2,
        ),
        decoration: BoxDecoration(
          color: tokens.colorActionPrimary,
          borderRadius: BorderRadius.circular(tokens.radiusMd),
        ),
        child: child,
      ),
    );
  }
}
```

## Vue component API patterns

```vue
<script setup lang="ts">
type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface Props {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <button
    :data-variant="props.variant"
    :data-size="props.size"
    :disabled="props.disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

## API design checklist

- [ ] Variant props use union types, not boolean combinations
- [ ] Compound components used when sub-parts are optional or reorderable
- [ ] Forward ref on all interactive components
- [ ] Props table documented for every component
- [ ] Accessibility spec (ARIA, keyboard, focus) documented
- [ ] Motion spec (duration, easing, reduced-motion) documented
- [ ] Default props reference tokens, not hardcoded values
- [ ] Generics used for data-driven components
- [ ] No `any` types in public API
