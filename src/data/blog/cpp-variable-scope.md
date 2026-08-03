---
title: "Variable Scope in C++: Local, Global, and Block Scope Explained"
description: "Understand variable scope in C++ with examples. Learn local vs global variables, block scope, shadowing, and why global variables cause hard-to-find bugs."
pubDatetime: 2026-08-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "variables", "functions", "tutorial"]
faqSchema:
  - question: "What is the difference between a local and a global variable in C++?"
    answer: "A local variable is declared inside a function or block and only exists while that block is running. A global variable is declared outside every function, exists for the whole life of the program, and can be read or modified by any function in the file."
  - question: "What is variable shadowing in C++?"
    answer: "Shadowing happens when an inner scope declares a variable with the same name as one in an outer scope. Inside that inner block the new variable hides the outer one, and the outer variable becomes unreachable by that name until the block ends."
  - question: "Are global variables bad in C++?"
    answer: "They are not always wrong, but they make code hard to reason about because any function can change them at any time. Prefer passing values as parameters or returning them. Reserve globals for genuine constants, which should be marked const or constexpr."
draft: false
featured: false
---

# Variable Scope in C++: Local, Global, and Block Scope Explained

Scope answers two questions about every variable you declare: **where can this name be used**, and **when does this variable stop existing**. Get scope wrong and you'll see errors like `'count' was not declared in this scope`, or worse, code that compiles fine and silently uses the wrong variable.

---

## Local Scope: The Default

A variable declared inside a function belongs to that function and nothing else:

```cpp
#include <iostream>

void greet() {
    int count = 5;             // local to greet()
    std::cout << count << "\n";
}

int main() {
    greet();
    // std::cout << count;     // error: 'count' was not declared in this scope
    return 0;
}
```

`count` is created when `greet()` starts and destroyed when it returns. `main()` has no idea it ever existed.

This is why two functions can both use a variable named `i` without interfering. Each one gets its own.

---

## Block Scope: Tighter Than You Might Think

Scope isn't per-function — it's per **block**, meaning any pair of curly braces:

```cpp
#include <iostream>

int main() {
    if (true) {
        int inside = 10;
        std::cout << inside << "\n";   // fine
    }
    // std::cout << inside;            // error: gone at the closing brace

    for (int i = 0; i < 3; ++i) {
        std::cout << i << " ";
    }
    // std::cout << i;                 // error: i belonged to the loop

    return 0;
}
```

The loop counter `i` is declared in the `for` header, so it lives and dies with the loop. If you need the value after the loop ends, declare it before:

```cpp
int i = 0;
for (; i < 10; ++i) {
    if (someCondition(i)) break;
}
std::cout << "Stopped at " << i << "\n";
```

The general guidance is to declare variables in the **smallest scope that works**. A variable that can't be seen can't be accidentally modified, and its lifetime is obvious at a glance.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Global Scope: Visible Everywhere

A variable declared outside every function is global:

```cpp
#include <iostream>

int score = 0;                 // global

void addPoints(int n) {
    score += n;                // no parameter needed — it just reaches out
}

void resetGame() {
    score = 0;
}

int main() {
    addPoints(10);
    addPoints(5);
    std::cout << "Score: " << score << "\n";   // Score: 15

    resetGame();
    std::cout << "Score: " << score << "\n";   // Score: 0
    return 0;
}
```

Globals are initialised before `main()` runs and live until the program exits. Unlike local variables, a global with no initialiser is **zero-initialised** — an uninitialised local `int` contains garbage, an uninitialised global `int` is `0`.

---

## Why Globals Cause Pain

The convenience is real, and so is the cost. Suppose `score` ends up wrong. Which function did it? With a global, the answer is *any of them* — you have to read every function in the file to find out.

Compare with the alternative:

```cpp
int addPoints(int score, int n) {
    return score + n;
}

int main() {
    int score = 0;
    score = addPoints(score, 10);
    score = addPoints(score, 5);
    return 0;
}
```

Now `addPoints` can't touch anything you didn't hand it. You can test it in isolation, and reading its signature tells you everything it can affect. That property — a function's effects being visible from its signature — is what makes larger programs manageable.

The one case where globals are uncontroversial is constants:

```cpp
constexpr double PI = 3.14159265358979;
constexpr int MAX_PLAYERS = 4;
```

Nothing can modify them, so none of the reasoning problems apply. See [const vs constexpr](/posts/cpp-const-vs-constexpr/) for which to pick.

---

## Shadowing: The Silent Bug

If an inner scope declares a name that already exists outside, the inner one wins:

```cpp
#include <iostream>

int value = 100;               // global

int main() {
    int value = 50;            // shadows the global
    std::cout << value << "\n";       // 50

    {
        int value = 25;        // shadows the local
        std::cout << value << "\n";   // 25
    }

    std::cout << value << "\n";       // 50 again
    std::cout << ::value << "\n";     // 100 — the global, via ::
    return 0;
}
```

The `::` prefix is the [scope resolution operator](/posts/cpp-scope-resolution-operator/) with nothing on its left, which means "the global one."

Shadowing compiles without complaint, which is exactly why it bites. The classic version is a constructor parameter shadowing a member variable:

```cpp
class Player {
public:
    Player(int score) {
        score = score;   // assigns the parameter to itself — member unchanged
    }
private:
    int score;
};
```

Turn on `-Wshadow` in your compiler flags and the compiler will point these out before they cost you an afternoon:

```
g++ -Wall -Wshadow -std=c++17 main.cpp -o main
```

The fix here is a member initialiser list — `Player(int score) : score(score) {}` — which is unambiguous. See [constructors and destructors](/posts/cpp-constructors-destructors/) for the full picture.

---

## Static Locals: A Middle Ground

A local variable marked `static` keeps its value between calls but stays invisible outside its function:

```cpp
#include <iostream>

void counter() {
    static int calls = 0;      // initialised once, on the first call
    ++calls;
    std::cout << "Called " << calls << " times\n";
}

int main() {
    counter();   // Called 1 times
    counter();   // Called 2 times
    counter();   // Called 3 times
    return 0;
}
```

You get a global's lifetime with a local's visibility — often exactly what someone reaches for a global to achieve. [The static keyword in C++](/posts/cpp-static-keyword/) covers its other uses.

---

## Quick Reference

| Scope | Declared | Lifetime | Visible to |
|-------|----------|----------|------------|
| Block | Inside `{ }` | Until the closing brace | That block |
| Local | Inside a function | Until the function returns | That function |
| Static local | `static` inside a function | Whole program | That function |
| Global | Outside all functions | Whole program | Every function in the file |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/)
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/)
- [The static Keyword in C++](/posts/cpp-static-keyword/)
- [C++ Scope Resolution Operator](/posts/cpp-scope-resolution-operator/)
- [const vs constexpr in C++](/posts/cpp-const-vs-constexpr/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
