---
title: "How to Fix 'expression must have a constant value' in C++"
description: "Fix 'expression must have a constant value' (E0028) and C2131 in C++: array sizes from cin, case labels and std::array, with the vector and constexpr fixes."
pubDatetime: 2026-11-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'expression must have a constant value' mean in C++?"
    answer: "C++ needs some values while it compiles your program: the size of an ordinary array, each case label in a switch, and the size in std::array. You used a variable whose value is only known when the program runs. In Visual Studio, E0028 is the editor's version of the message and C2131 is the build error."
  - question: "Why does my array code work in g++ but not in Visual Studio?"
    answer: "GCC accepts arrays sized by a variable, called variable length arrays, as an extension borrowed from C. They aren't standard C++, so Visual Studio rejects the same code. Compile with -pedantic and g++ warns: ISO C++ forbids variable length array."
  - question: "How do I make an array with a size the user enters?"
    answer: "Use std::vector from the <vector> header: std::vector<int> scores(count);. A vector gets its memory while the program runs, so the size can come from cin, and you still use scores[i] like an array."
  - question: "Why doesn't const fix 'expression must have a constant value'?"
    answer: "const only means the value can't change after it's set. const int size = count; is still set from a value that's only known at run time. Use constexpr when you mean a value known while compiling, because the compiler then checks it, and use std::vector when the size comes from the user."
---

# How to Fix "expression must have a constant value" in C++

**Short answer:** C++ needs some values while it compiles your program: the size of an ordinary array, each `case` label in a `switch`, and the size in `std::array<int, 5>`. If you put a normal variable there, its value isn't known until the program runs, so Visual Studio stops. When the number comes from the user, use `std::vector`. When it's a fixed number, declare it `constexpr`.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle, Error List) | `E0028 expression must have a constant value` |
| Visual Studio build | `C2131: expression did not evaluate to a constant` |
| GCC (g++, MinGW, Code::Blocks) | Often nothing: GCC accepts arrays sized by a variable as an extension |
| Clang (Xcode, macOS) | `warning: variable length arrays in C++ are a Clang extension` |

<!-- optin-quick error="expression must have a constant value" -->

---

## What the Message Means

A few values have to be known while the compiler builds your program, before it runs:

- the size of an array, as in `int scores[10];`
- each `case` label in a `switch`
- the size in `std::array<int, 10>`

These need **constant expressions**: plain numbers, or variables declared `constexpr` (or `const` and set from a plain number). A normal variable doesn't count, even if you set it to 5 on the line above.

In Visual Studio you'll often see two entries for the same line. `E0028` comes from IntelliSense, which checks your code as you type. `C2131` comes from the compiler when you build.

## Cause 1: An Array Size the User Types In

This is the most common case:

```cpp
#include <iostream>

int main() {
    int count;
    std::cin >> count;

    int scores[count];
    for (int i = 0; i < count; i++) {
        scores[i] = (i + 1) * 10;
    }
    std::cout << "Last score: " << scores[count - 1] << '\n';
}
```

Visual Studio won't build it:

```
error C2131: expression did not evaluate to a constant
note: failure was caused by a read of a variable not usable in constant expressions
note: see usage of 'count'
```

`count` comes from `std::cin`, so nobody knows its value until the program runs. Visual Studio needs the array's size before that.

Yet g++ builds and runs the same code without a word (type 3 and it prints `Last score: 30`), and Clang only warns. That's why code that works in Code::Blocks or an online compiler can fail in Visual Studio. There's more on why below.

**Fix:** use `std::vector`:

```cpp
#include <iostream>
#include <vector>

int main() {
    int count;
    std::cin >> count;

    std::vector<int> scores(count);
    for (int i = 0; i < count; i++) {
        scores[i] = (i + 1) * 10;
    }
    std::cout << "Last score: " << scores[count - 1] << '\n';
}
```

```
Last score: 30
```

A vector gets its memory from the heap while the program runs, so its size can come from anywhere. The rest of the code doesn't change: `scores[i]` works just as it did with the array. See the [vector tutorial](/posts/cpp-vector-tutorial/) and [dynamic arrays](/posts/cpp-dynamic-array/) for more.

## Why g++ Lets You Do It

GCC supports **variable length arrays** (VLAs), a feature from C, as an extension to C++. They aren't part of standard C++, which is why Visual Studio rejects them. Compile with `-pedantic` and g++ says so:

```
warning: ISO C++ forbids variable length array 'scores' [-Wvla]
```

VLAs are risky even where they compile. They live on the stack, which is small, so a big number from the user can crash the program. Use `std::vector` even when your compiler accepts a VLA. [Stack vs heap](/posts/cpp-stack-vs-heap/) explains the difference.

<!-- book-cta topic="memory" placement="mid_article" -->

## Cause 2: A Global Array Sized by a Normal Variable

```cpp
#include <iostream>

int maxScores = 5;
int scores[maxScores];

int main() {
    scores[0] = 90;
    std::cout << scores[0] << '\n';
}
```

```
GCC:    error: size of array 'scores' is not an integral constant-expression
Clang:  error: variable length array declaration not allowed at file scope
MSVC:   error C2131: expression did not evaluate to a constant
```

Outside a function, even GCC refuses. A global array is set up before `main` starts, so its size can't depend on a variable.

**Fix:** make the size `constexpr`:

```cpp
#include <iostream>

constexpr int maxScores = 5;
int scores[maxScores];

int main() {
    scores[0] = 90;
    std::cout << scores[0] << '\n';
}
```

```
90
```

`const int maxScores = 5;` works too, because it's set from a plain number. [const vs constexpr](/posts/cpp-const-vs-constexpr/) explains the difference.

## Cause 3: const Set From a Variable

After Cause 2, it's natural to try `const`:

```cpp
#include <iostream>

int main() {
    int count;
    std::cin >> count;

    const int size = count;
    int scores[size];
    for (int i = 0; i < size; i++) {
        scores[i] = (i + 1) * 10;
    }
    std::cout << "Last score: " << scores[size - 1] << '\n';
}
```

```
MSVC:   error C2131: expression did not evaluate to a constant
        note: failure was caused by a read of a variable not usable in constant expressions
        note: see usage of 'size'
Clang:  warning: variable length arrays in C++ are a Clang extension [-Wvla-cxx-extension]
        note: initializer of 'size' is not a constant expression
```

The editor's squiggle may say `constant value is not known` here instead.

`const` only means the value can't change once it's set. `size` is set from `count`, which still comes from the user, so its value isn't known while compiling. GCC accepts this as a VLA again.

`constexpr` is the keyword that means "known while compiling", and the compiler checks it. Change the line to `constexpr int size = count;` and every compiler points at the real problem:

```
GCC:    error: the value of 'count' is not usable in a constant expression
Clang:  error: constexpr variable 'size' must be initialized by a constant expression
MSVC:   error C2131: expression did not evaluate to a constant
```

For a size the user types in, the fix is still the `std::vector` from Cause 1.

## Cause 4: A Variable in a case Label

```cpp
#include <iostream>

int main() {
    int choice = 2;
    int quit = 3;
    switch (choice) {
        case quit:
            std::cout << "Bye\n";
            break;
        default:
            std::cout << "Option " << choice << '\n';
    }
}
```

```
GCC:    error: the value of 'quit' is not usable in a constant expression
        note: 'int quit' is not const
Clang:  error: case value is not a constant expression
MSVC:   error C2131: expression did not evaluate to a constant
        error C2051: case expression not constant
```

Each `case` must be a value the compiler knows while it builds the `switch`. In the editor, this shows as `expression must have a constant value` too.

**Fix:** make it a constant:

```cpp
#include <iostream>

int main() {
    int choice = 2;
    const int quit = 3;
    switch (choice) {
        case quit:
            std::cout << "Bye\n";
            break;
        default:
            std::cout << "Option " << choice << '\n';
    }
}
```

```
Option 2
```

If the value you're comparing against is only known at run time, use `if` and `else if` instead of a `switch`. More in the [switch statement guide](/posts/cpp-switch-statement/).

## Cause 5: A Variable as the Size of std::array

```cpp
#include <array>
#include <iostream>

int main() {
    int size = 5;
    std::array<int, size> scores{};
    std::cout << scores.size() << '\n';
}
```

```
GCC:    error: the value of 'size' is not usable in a constant expression
        note: 'int size' is not const
Clang:  error: non-type template argument is not a constant expression
MSVC:   error C2971: 'std::array': template parameter '_Size': 'size': a variable with non-static storage duration cannot be used as a non-type argument
```

The size of a `std::array` is part of its type, so it has to be known while compiling, just like a plain array's. The editor reports `expression must have a constant value` here as well.

**Fix:** `constexpr`:

```cpp
#include <array>
#include <iostream>

int main() {
    constexpr int size = 5;
    std::array<int, size> scores{};
    std::cout << scores.size() << '\n';
}
```

```
5
```

If the size comes from the user, use `std::vector` instead. See [std::array in C++](/posts/cpp-std-array/) for when each one fits.

## When the Squiggle Is Wrong

If the program builds and runs, but the editor still shows E0028 on a line with no array size, `case` or `std::array` in it, IntelliSense itself may be wrong. It has had bugs that put this message on valid code ([one example](https://github.com/microsoft/vscode-cpptools/issues/10075)). The build output is what counts.

## Quick Reference

| Where it happens | Example | Fix |
|---|---|---|
| Array size from input | `int scores[count];` | `std::vector<int> scores(count);` |
| Global array size | `int maxScores = 5;` | `constexpr int maxScores = 5;` |
| `const` set from a variable | `const int size = count;` | `std::vector`, or `constexpr` for a fixed size |
| `case` label | `case quit:` | `const int quit = 3;` |
| `std::array` size | `std::array<int, size>` | `constexpr int size = 5;` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="memory" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [Dynamic Arrays in C++](/posts/cpp-dynamic-array/) — how to create an array with a size chosen at run time.
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — everything you need to use `std::vector`.
- [C++ const vs constexpr](/posts/cpp-const-vs-constexpr/) — what each keyword promises.
- [C++ Stack vs Heap](/posts/cpp-stack-vs-heap/) — where your variables live, and why it matters.
