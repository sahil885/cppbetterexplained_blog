---
title: "How to Fix \"expected a ':'\" in C++ (Visual Studio)"
description: "Fix \"expected a ':'\" in C++: case 1; and default; in a switch, public without a colon, and a ?: operator missing its colon. Plus the std:cout trap."
pubDatetime: 2026-11-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does \"expected a ':'\" mean in C++?"
    answer: "A colon is missing in one of the places C++ requires one: after a case or default label in a switch, after public, private or protected in a class, or between the two choices of the ?: operator. Usually a semicolon was typed where the colon belongs."
  - question: "Why does case 1; give an error?"
    answer: "Case labels end with a colon, not a semicolon: case 1:. The colon marks where the code for that case starts. The same applies to default:."
  - question: "Why does std:cout give 'identifier cout is undefined'?"
    answer: "With a single colon, std: is read as a label named std, so cout is looked up on its own and isn't found. The scope operator is two colons: std::cout. GCC says 'cout' was not declared in this scope and also warns that the label 'std' is unused."
  - question: "What is the GCC version of this error?"
    answer: "GCC says expected ':' before followed by what it found, such as expected ':' before ';' token. Clang says expected ':' after 'case' or expected ':' after 'default'."
---

# How to Fix "expected a ‘:’" in C++ (Visual Studio)

**Short answer:** a **colon** is missing where C++ requires one: after `case 1` or `default` in a `switch`, after `public` or `private` in a class, or between the two choices of `? :`. Most of the time a semicolon was typed where the colon belongs.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle) | `expected a ':'` |
| Visual Studio build | `C2143: syntax error: missing ':' before ';'` |
| GCC (g++, MinGW, Code::Blocks) | `expected ':' before ';' token` |
| Clang (Xcode, macOS) | `expected ':' after 'case'` |

<!-- optin-quick error="expected a ':'" -->

---

## Cause 1: case 1; Instead of case 1:

```cpp
#include <iostream>

int main() {
    int choice = 1;
    switch (choice) {
        case 1;
            std::cout << "One\n";
            break;
    }
}
```

```
Visual Studio editor:  expected a ':'
MSVC build:            error C2143: syntax error: missing ':' before ';'
GCC:                   error: expected ':' before ';' token
Clang:                 error: expected ':' after 'case'
```

A case label ends with a colon. It marks where that case's code begins. **Fix:** `case 1:`, and the program prints `One`.

## Cause 2: default; Instead of default:

```cpp
#include <iostream>

int main() {
    int choice = 3;
    switch (choice) {
        case 1:
            std::cout << "One\n";
            break;
        default;
            std::cout << "Other\n";
    }
}
```

```
Visual Studio editor:  expected a ':'
MSVC build:            error C2065: 'default': undeclared identifier
GCC:                   error: expected ':' before ';' token
Clang:                 error: expected ':' after 'default'
```

Visual Studio's build message is misleading here. `default` is a keyword, not an identifier, so trust the squiggle. **Fix:** `default:`, which prints `Other`. More in the [switch statement guide](/posts/cpp-switch-statement/).

<!-- book-cta topic="oop" placement="mid_article" -->

## Cause 3: public Without a Colon

```cpp
#include <iostream>

class Player {
public
    int score;
};

int main() {
    Player p;
    p.score = 5;
    std::cout << p.score << '\n';
}
```

```
Visual Studio editor:  expected a ':'
MSVC build:            error C2062: type 'int' unexpected
                       error C2039: 'score': is not a member of 'Player'
GCC:                   error: expected ':' before 'int'
Clang:                 error: expected ':'
```

`public`, `private` and `protected` are labels inside a class, and each one ends with a colon. **Fix:** `public:`, and the program prints `5`. See [classes and objects](/posts/cpp-classes-and-objects/) for more.

## Cause 4: A ?: Operator Missing Its Colon

```cpp
#include <iostream>

int main() {
    int a = 4, b = 9;
    int bigger = (a > b) ? a b;
    std::cout << bigger << '\n';
}
```

```
Visual Studio editor:  expected a ':'
MSVC build:            error C2146: syntax error: missing ',' before identifier 'b'
GCC:                   error: expected ':' before 'b'
Clang:                 error: expected ':'
                       note: to match this '?'
```

The ternary operator always has both parts: `condition ? value_if_true : value_if_false`. **Fix:** `(a > b) ? a : b`, which gives `9`. More in the [ternary operator guide](/posts/cpp-ternary-operator/).

## A Related Trap: std:cout With One Colon

This one doesn't say "expected a ':'", but it's the same kind of slip:

```cpp
#include <iostream>

int main() {
    std:cout << "Hi\n";
}
```

```
Visual Studio editor:  identifier "cout" is undefined
MSVC build:            error C2065: 'cout': undeclared identifier
GCC:                   error: 'cout' was not declared in this scope; did you mean 'std::cout'?
                       warning: label 'std' defined but not used
```

With one colon, `std:` is read as a **label** (a name you could jump to with `goto`), so `cout` is looked up on its own and isn't found. GCC's warning gives it away. **Fix:** two colons, `std::cout`. The [scope resolution operator](/posts/cpp-scope-resolution-operator/) is always `::`.

## Quick Reference

| You wrote | Fix |
|---|---|
| `case 1;` | `case 1:` |
| `default;` | `default:` |
| `public` (in a class) | `public:` |
| `x ? a b` | `x ? a : b` |
| `std:cout` | `std::cout` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="oop" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Switch Statement](/posts/cpp-switch-statement/) — case, default and break.
- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — public and private members.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — the opposite slip.
- [The Scope Resolution Operator](/posts/cpp-scope-resolution-operator/) — what `::` means.
