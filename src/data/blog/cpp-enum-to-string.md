---
title: "C++ Enum to String: Convert Enums to Text (3 Ways)"
description: "Learn how to convert a C++ enum to a string. Use a switch statement, an array lookup, or a map, with clear examples for both plain enums and enum class."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "enums", "tutorial"]
faqSchema:
  - question: "How do you convert an enum to a string in C++?"
    answer: "C++ has no built-in enum-to-string, so you write a small function. The clearest way is a switch statement that returns the matching text for each enum value, with a default case for safety."
  - question: "Why can't you print an enum directly as text in C++?"
    answer: "Enums are stored as integers, so printing one with cout shows the underlying number, not the name. The compiler discards the name labels, so you must map values back to text yourself."
  - question: "What is the best way to map enums to strings?"
    answer: "For a few values a switch is simplest. For many values, a std::map<MyEnum, std::string> or an array indexed by the enum value is cleaner and easy to extend without touching control flow."
draft: false
featured: false
---

# C++ Enum to String: Convert Enums to Text

**C++ has no built-in way to turn an enum into a string, so you write a short conversion function — usually a `switch` that returns the matching text.** Enums are stored as integers, so printing one directly gives a number, not the name. Here are three clean ways to get the text.

---

## Why You Need This

Printing an enum shows its underlying integer, which is rarely what you want:

```cpp
#include <iostream>

enum class Color { Red, Green, Blue };

int main() {
    Color c = Color::Green;
    std::cout << static_cast<int>(c) << "\n";  // prints 1, not "Green"
    return 0;
}
```

The compiler keeps only the numeric value (`Red`=0, `Green`=1, `Blue`=2); the names exist just for your source code. To display `"Green"`, you map the value back to text.

---

## Method 1: A switch Statement

The most readable approach for a handful of values is a `switch` that returns a string:

```cpp
#include <iostream>
#include <string>

enum class Color { Red, Green, Blue };

std::string toString(Color c) {
    switch (c) {
        case Color::Red:   return "Red";
        case Color::Green: return "Green";
        case Color::Blue:  return "Blue";
        default:           return "Unknown";
    }
}

int main() {
    std::cout << toString(Color::Green) << "\n";  // Green
    return 0;
}
```

Each case returns the matching text. The `default` case is good insurance — if someone adds a new enum value later and forgets to update the function, you get `"Unknown"` instead of undefined behavior.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 2: An Array Lookup

If your enum values are sequential starting at 0 (the default), you can index an array of names directly:

```cpp
#include <iostream>
#include <string>

enum Color { Red, Green, Blue, COLOR_COUNT };

const std::string colorNames[] = { "Red", "Green", "Blue" };

int main() {
    Color c = Green;
    std::cout << colorNames[c] << "\n";  // Green
    return 0;
}
```

Because a plain enum converts to its integer automatically, `colorNames[c]` works. This is compact, but it's fragile: if the names array and the enum ever drift out of order, you'll print the wrong text. Keep them right next to each other.

---

## Method 3: A std::map

For larger or non-sequential enums, a `std::map` is the most maintainable choice:

```cpp
#include <iostream>
#include <string>
#include <map>

enum class Status { Active, Paused, Stopped };

int main() {
    std::map<Status, std::string> names = {
        {Status::Active,  "Active"},
        {Status::Paused,  "Paused"},
        {Status::Stopped, "Stopped"}
    };

    std::cout << names[Status::Paused] << "\n";  // Paused
    return 0;
}
```

The map makes the value-to-name pairing explicit and easy to extend — just add a line. It's slightly heavier than a switch, but for configuration-style enums that readability is worth it.

---

## Which Method to Use

| Situation | Best method |
|-----------|-------------|
| A few values | `switch` |
| Sequential values, performance matters | array lookup |
| Many or non-sequential values | `std::map` |

For most beginner code, start with the `switch` — it's clear, safe, and needs no extra container.

---

## Related Articles

- [C++ Enum Tutorial](/posts/cpp-enum-tutorial/) — enums and enum class explained
- [C++ Switch Statement](/posts/cpp-switch-statement/) — the control structure used above
- [C++ map and unordered_map](/posts/cpp-map-unordered-map/) — the map lookup method
- [C++ String Handling](/posts/cpp-string-handling/) — working with the resulting text

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
