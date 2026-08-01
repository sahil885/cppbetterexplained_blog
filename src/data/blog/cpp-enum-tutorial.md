---
title: "C++ Enum Tutorial: enum and enum class Explained"
description: "Learn C++ enums from scratch. This beginner guide covers plain enums, enum class (scoped enums), when to use each, and why enum class is preferred in modern C++."
modDatetime: 2026-08-01T00:00:00Z
pubDatetime: 2026-05-14T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "enum", "tutorial"]
faqSchema:
  - question: "What is an enum in C++?"
    answer: "An enum (enumeration) is a user-defined type consisting of named integer constants. Instead of using raw numbers like 0, 1, 2 to represent states, you give them meaningful names like RED, GREEN, BLUE. This makes code much easier to read and understand."
  - question: "What is the difference between enum and enum class in C++?"
    answer: "Plain enums leak their names into the surrounding scope, which can cause naming conflicts. enum class (scoped enums, C++11) requires you to prefix the name with the enum type, like Color::RED. enum class also doesn't implicitly convert to int, making code safer. Prefer enum class in modern C++."
  - question: "Can you assign values to enum in C++?"
    answer: "Yes. By default, enum values start at 0 and increment by 1. You can assign custom integer values: enum Status { OK = 200, NOT_FOUND = 404, ERROR = 500 }; Any unassigned values continue incrementing from the last assigned value."
draft: false
featured: false
---

# C++ Enum Tutorial: enum and enum class Explained

Imagine tracking the status of a network request. You could represent it as an integer: 0 means pending, 1 means success, 2 means failed. That works, but what happens six months later when someone reads `if (status == 2)`? They have no idea what 2 means without going back to find the definition.

Enums (enumerations) solve this by giving meaningful names to a set of related integer values. Instead of `2`, you write `Status::FAILED`. That's readable at a glance.

This tutorial covers C++ enums from scratch — including the modern `enum class` that you should be using in new code.

---

## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/nD4DvgtB9Ww" title="What are Enums in C++ Programming?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Your First enum

Here's a basic enum:

```cpp
#include <iostream>
using namespace std;

enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
};

int main() {
    Direction d = NORTH;

    if (d == NORTH) {
        cout << "Heading north!" << endl;
    }
    return 0;
}
```

By default, `NORTH = 0`, `SOUTH = 1`, `EAST = 2`, `WEST = 3`. The compiler assigns integers starting from zero, incrementing by one.

You've replaced meaningless numbers with readable names. That's the entire point.

---

## Assigning Custom Values

You don't have to accept the default 0, 1, 2, 3. You can assign any integer values you want:

```cpp
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};

int main() {
    HttpStatus response = OK;
    cout << "Status code: " << response << endl;  // 200
    return 0;
}
```

This is great for HTTP status codes, error codes, or any domain where specific numbers already have meaning.

You can also set some values and let the rest auto-increment:

```cpp
enum Priority {
    LOW = 1,
    MEDIUM,    // 2 (auto-incremented)
    HIGH,      // 3
    CRITICAL = 10
};
```

---

## The Problem with Plain enum

Plain enums have a significant issue: their values pollute the surrounding scope. Consider:

```cpp
enum Color { RED, GREEN, BLUE };
enum Fruit { APPLE, ORANGE, GREEN };  // Error! GREEN is already defined
```

`GREEN` from `Color` clashes with `GREEN` from `Fruit`. This is called **name leakage**, and it's a real problem in large codebases.

There's another issue: plain enums implicitly convert to `int`. That means this compiles without a warning, even though it makes no sense:

```cpp
enum Color { RED, GREEN, BLUE };
enum Size { SMALL, MEDIUM, LARGE };

Color c = RED;
int n = c;           // Compiles fine — converts Color to int
bool same = (c == SMALL);  // Compares RED (0) to SMALL (0) — true!
```

`RED == SMALL` evaluates to `true` because they're both `0` under the hood. That's a bug waiting to happen.

---

## enum class: The Modern Solution

C++11 introduced `enum class` (also called **scoped enumerations**). It solves both problems:

```cpp
#include <iostream>
using namespace std;

enum class Color {
    RED,
    GREEN,
    BLUE
};

int main() {
    Color c = Color::RED;  // Must use the type prefix

    if (c == Color::RED) {
        cout << "Color is red" << endl;
    }
    return 0;
}
```

Two key differences from plain `enum`:

1. **Names are scoped**: You write `Color::RED`, not just `RED`. No naming conflicts.
2. **No implicit int conversion**: `int n = Color::RED;` is a compile error. You have to cast explicitly.

Use `enum class` for all new code. It's safer and clearer.

---

## Using enum class in a switch

Enums and switch statements are a natural pair:

```cpp
#include <iostream>
using namespace std;

enum class Season {
    SPRING,
    SUMMER,
    AUTUMN,
    WINTER
};

void describe(Season s) {
    switch (s) {
        case Season::SPRING: cout << "Flowers blooming" << endl; break;
        case Season::SUMMER: cout << "Hot and sunny" << endl; break;
        case Season::AUTUMN: cout << "Leaves falling" << endl; break;
        case Season::WINTER: cout << "Cold and dark" << endl; break;
    }
}

int main() {
    describe(Season::AUTUMN);  // Leaves falling
    return 0;
}
```

A good compiler will warn you if you miss a case in the switch — another benefit of using enums over raw integers.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Converting enum class to int

Unlike plain enums, `enum class` won't auto-convert to `int`. When you genuinely need the underlying integer value, use `static_cast`:

```cpp
enum class Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
};

int main() {
    Priority p = Priority::HIGH;
    int value = static_cast<int>(p);  // 3
    cout << "Priority level: " << value << endl;
    return 0;
}
```

The explicit cast makes it obvious that you're intentionally treating the enum as an integer, rather than it happening accidentally.

---

## Specifying the Underlying Type

By default, enum values are stored as `int`. You can specify a different underlying type — useful for saving memory or ensuring a specific size:

```cpp
enum class Direction : uint8_t {
    NORTH,
    SOUTH,
    EAST,
    WEST
};
```

`uint8_t` is an unsigned 8-bit integer (0–255), fine for four directions. You can use any integral type: `int`, `unsigned int`, `short`, `long`, `uint8_t`, etc.

---

## enum vs #define vs const

Before enums existed, programmers used `#define` for named constants:

```cpp
#define RED 0
#define GREEN 1
#define BLUE 2
```

Problems: `#define` is a text substitution done by the preprocessor before compilation. It has no type, no scope, and no safety. `const int` is better, but it still doesn't group related values together.

Enums give you:
- **Type safety** — you can't accidentally mix enums from different types (with `enum class`)
- **Grouping** — all related values live under one named type
- **Debugger support** — debuggers know the enum names, not just the numbers

---

## A Practical Example: Game State Machine

Here's a real-world pattern you'll see often — using an enum to represent program state:

```cpp
#include <iostream>
using namespace std;

enum class GameState {
    MENU,
    PLAYING,
    PAUSED,
    GAME_OVER
};

void update(GameState state) {
    switch (state) {
        case GameState::MENU:      cout << "Showing main menu" << endl; break;
        case GameState::PLAYING:   cout << "Game running..." << endl; break;
        case GameState::PAUSED:    cout << "Game paused" << endl; break;
        case GameState::GAME_OVER: cout << "Game over screen" << endl; break;
    }
}

int main() {
    GameState state = GameState::MENU;
    update(state);

    state = GameState::PLAYING;
    update(state);

    state = GameState::GAME_OVER;
    update(state);

    return 0;
}
```

The enum makes the state machine's logic clear and self-documenting. Anyone reading this code immediately understands what's going on.

---

## Quick Reference

| Feature | plain `enum` | `enum class` |
|---------|-------------|--------------|
| Name scoping | No (names leak) | Yes (prefix required) |
| Implicit int conversion | Yes | No |
| C++ version | All | C++11+ |
| Recommended? | Legacy code only | Yes, for new code |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — enums are a user-defined type built on top of integers
- [C++ Switch Statement](/posts/cpp-switch-statement/) — the natural companion to enums
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if/else with enum conditions
- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — enums are often used as class member variables

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
