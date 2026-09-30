# Mobile Performance Patterns

> React Native and Flutter patterns that keep mobile UI at 60fps.
> Read when implementing lists, animations, or state-heavy screens.
> This is the #1 area where generated mobile code fails.

Every frame has a budget: 16.67ms at 60fps, 8.33ms at 120fps ProMotion.
Miss it and scrolling stutters, animations jank, and the app reads as
broken. Performance is baseline quality, not optimization.

## React Native

### Lists: never ScrollView + map

```tsx
// BAD: renders every item up front; memory explodes on long lists
<ScrollView>
  {items.map(item => <Row key={item.id} item={item} />)}
</ScrollView>

// GOOD: virtualized, memoized, stable keys
const Row = React.memo(({ item }: { item: Item }) => (
  <Pressable style={styles.row}>
    <Text>{item.title}</Text>
  </Pressable>
));

const renderItem = useCallback(
  ({ item }: { item: Item }) => <Row item={item} />,
  []
);
const keyExtractor = useCallback((item: Item) => item.id, []);
const getItemLayout = useCallback(
  (_: unknown, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }),
  []
);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

| Optimization | Prevents | Impact |
|---|---|---|
| `React.memo` on row | Re-render on parent change | Critical |
| `useCallback` renderItem | New function identity each render | Critical |
| Stable `keyExtractor` (never index) | Wrong row recycling, reorder bugs | Critical |
| `getItemLayout` (fixed height) | Async layout measurement | High |
| `removeClippedSubviews` | Off-screen memory bloat | High |
| `maxToRenderPerBatch` / `windowSize` | Main-thread blocking | Medium |

For very long or complex lists, prefer Shopify `FlashList`: faster
recycling, better memory, fewer tuning props (`estimatedItemSize` is
the only required hint).

### Animations: run on the UI thread

```tsx
// BAD: JS-thread animation, drops frames under load
Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: false });

// GOOD: native driver (transform and opacity only)
Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true });

// BEST for complex/gesture-driven: Reanimated worklets
const offset = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(offset.value) }],
}));
```

Native driver supports only `transform` and `opacity`. Anything that
animates width, height, color, or layout goes through Reanimated or
stays out of the design.

### Memory hygiene

Every `useEffect` that opens a timer, listener, or subscription returns
a cleanup. Async work that resolves after unmount must not set state
(AbortController or an is-mounted guard). Strip `console.log` from
production builds; logging blocks the JS thread.

## Flutter

### Rebuilds: const and surgical state

```dart
// BAD: setState rebuilds the entire subtree
setState(() => _counter++);

// GOOD: const widgets opt out of rebuilds entirely
Column(
  children: [
    Text('Counter: $_counter'),
    const ExpensiveWidget(), // never rebuilds
  ],
)

// GOOD: ValueListenableBuilder rebuilds only what depends on the value
ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) => Text('$value'),
  child: const Icon(Icons.star), // cached, never rebuilt
)

// GOOD: Riverpod select watches one field, not the whole state
final name = ref.watch(provider.select((s) => s.name));
```

Rule: `const` on every widget that takes no runtime state. Lift state
no higher than needed; prefer `select` over watching whole providers.

### Lists: builder constructors

```dart
// BAD: materializes all children
ListView(children: items.map((i) => ItemWidget(i)).toList())

// GOOD: lazy build, fixed extent when possible
ListView.separated(
  itemCount: items.length,
  itemBuilder: (context, i) => ItemWidget(items[i]),
  separatorBuilder: (context, i) => const Divider(),
  itemExtent: 56,       // fixed height: faster layout, enables jump-to
)
```

### Images

```dart
CachedNetworkImage(
  imageUrl: url,
  memCacheWidth: 200,   // decode at display size x2, not full res
  placeholder: (_, __) => const Skeleton(),
  errorWidget: (_, __, ___) => const Icon(Icons.error),
)
```

Image memory is width x height x 4 bytes. Ten unscaled 4K photos are
~330MB, enough to crash. Always bound decode size.

### Dispose

Dispose in reverse order of creation: `TextEditingController`,
`AnimationController` (use `TickerProviderStateMixin`), stream
subscriptions, focus nodes. Prefer `FadeTransition` over the `Opacity`
widget during animation.

## Shared rules

### Animate transform and opacity only

| GPU-composited (fast) | CPU layout (slow) |
|---|---|
| translate, scale, rotate | width, height, position |
| opacity | margin, padding, border-radius, box-shadow |

Timing: micro-interactions 100-200ms, standard transitions 200-300ms,
page transitions 300-400ms. Spring feel: damping 10-20, stiffness
100-200.

### Battery and OLED

Dark mode with true-black backgrounds saves real power on OLED. Reduce
animation and defer non-critical work on low battery. Batch network
requests; radio-on time costs battery.

### Offline-first data

Read cache first, render instantly, revalidate in the background
(TanStack Query, Riverpod async). Queue user actions offline and sync
on reconnect. Never make the UI wait on the network for data it has
seen before.

## Testing

Trust nothing but real devices:

- Low-end Android (under $200 class) and an older iPhone.
- Release/profile builds only; dev mode hides and invents jank.
- Realistic data volumes (1000+ list items, not 10).
- Slow network (3G throttle) for loading and offline states.
- Tools: RN via Flipper/Instruments/Android Profiler; Flutter via
  DevTools performance overlay and `flutter run --profile`.

## Checklist

React Native:

- [ ] FlatList or FlashList for every list (never ScrollView + map)
- [ ] renderItem in useCallback, rows in React.memo, stable keys
- [ ] getItemLayout for fixed-height rows
- [ ] Animations use native driver or Reanimated; transform/opacity only
- [ ] Every useEffect cleans up; no console.log in production

Flutter:

- [ ] const on every widget that allows it
- [ ] ValueListenableBuilder / Riverpod select over broad rebuilds
- [ ] ListView.builder/separated with itemExtent for fixed rows
- [ ] Images cached and decode-bounded
- [ ] dispose() implemented for every controller and subscription

Before release:

- [ ] 60fps verified on a low-end device in a release build
- [ ] Memory stable over extended use; cold start under ~2s
- [ ] List scroll smooth with 1000+ items
- [ ] Offline path tested on a real disconnected device
