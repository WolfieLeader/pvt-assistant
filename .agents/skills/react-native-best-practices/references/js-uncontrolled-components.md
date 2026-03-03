---
title: Uncontrolled TextInput
impact: HIGH
tags: textinput, controlled, uncontrolled, defaultValue, performance
---

# Skill: Uncontrolled TextInput

Use `defaultValue` instead of `value` for TextInput to avoid JS-native round-trip lag.

## Quick Pattern

**Incorrect (controlled - round-trip per keystroke):**

```jsx
<TextInput value={text} onChangeText={setText} />
```

**Correct (uncontrolled - native handles display):**

```jsx
<TextInput defaultValue={text} onChangeText={setText} />
```

## When to Use

- TextInput feels laggy during fast typing
- Characters appear with delay
- Flickering text on legacy architecture
- Form inputs don't need character-by-character validation

## Problem Description

![Controlled TextInput Ping-Pong](images/controlled-textinput-pingpong.png)

With controlled TextInput (`value` prop):

1. User types character
2. Native sends event to JS
3. JS updates state
4. React re-renders
5. New `value` sent back to native
6. Native updates display

Each character requires a round-trip between native and JavaScript. On legacy architecture, if React state update is slow, native may show intermediate states (flicker).

## Step-by-Step Instructions

### 1. Identify Controlled TextInputs

Search for TextInput components using `value` prop:

```jsx
// These are controlled - potential lag
<TextInput value={text} onChangeText={setText} />
<TextInput value={name} onChangeText={setName} />
```

### 2. Convert to Uncontrolled

Replace `value` with `defaultValue`:

```jsx
// Before: Controlled
<TextInput value={text} onChangeText={setText} />

// After: Uncontrolled
<TextInput defaultValue={text} onChangeText={setText} />
```

### 3. Use Ref for Programmatic Access

```jsx
const inputRef = useRef(null);

// Clear input programmatically
const handleSubmit = () => {
  processText(text);
  setText("");
  inputRef.current?.clear();
};

<TextInput ref={inputRef} defaultValue={text} onChangeText={setText} />;
```

## Code Examples

### Simple Form

```jsx
const SimpleForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View>
      <TextInput defaultValue={name} onChangeText={setName} placeholder="Name" />
      <TextInput defaultValue={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <Button onPress={() => submit(name, email)} title="Submit" />
    </View>
  );
};
```

### Search Input

```jsx
const SearchInput = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <View>
      <TextInput defaultValue={query} onChangeText={setQuery} placeholder="Search..." />
      <SearchResults query={deferredQuery} />
    </View>
  );
};
```

## When to Keep Controlled

| Scenario                      | Use Controlled? | Reason                           |
| ----------------------------- | --------------- | -------------------------------- |
| Simple text input             | No              | Uncontrolled is faster           |
| Search/filter                 | No              | Use with `useDeferredValue`      |
| Form validation on submit     | No              | Validate on submit, not per-char |
| Input masking (phone, CC)     | Yes             | Need to modify each character    |
| Character limit with feedback | Yes             | Need to intercept input          |
| Currency formatting           | Yes             | Need to transform input          |

## Performance Comparison

| Mode                          | Round-trips per char | Flicker risk | Performance |
| ----------------------------- | -------------------- | ------------ | ----------- |
| Controlled (`value`)          | 1 full round-trip    | Yes (legacy) | Slower      |
| Uncontrolled (`defaultValue`) | 0                    | No           | Best        |

## Common Pitfalls

- **Using both `value` and `defaultValue`**: Never combine them. Pick one.
- **Forgetting ref for clear**: Use `inputRef.current?.clear()` to reset.
- **Assuming New Architecture fixes everything**: Uncontrolled still provides best performance even on new arch.

## Related Skills

- [js-concurrent-react.md](./js-concurrent-react.md) - Combine with `useDeferredValue`
- [js-profile-react.md](./js-profile-react.md) - Profile input performance
