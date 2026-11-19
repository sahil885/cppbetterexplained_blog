---
title: "How to Fix \"expected a ')'\" in C++ (Visual Studio)"
description: "Fix \"expected a ')'\" in C++: an if or while missing its closing bracket, an unfinished function call, a missing && between conditions, and a #define with a semicolon."
pubDatetime: 2026-11-19T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does \"expected a ')'\" mean in C++?"
    answer: "A ( was opened and the compiler reached something that can't be inside the brackets before it found the matching ). Usually the ) is simply missing, but it also appears when two conditions sit side by side without && or ||, or when a #define ends in a semicolon."
  - question: "Where is the missing bracket?"
    answer: "Visual Studio puts the squiggle where it expected the ), which is just after the last thing that made sense. Clang adds a note, to match this '(', that points at the opening bracket. Count the ( and ) on that line; they should match."
  - question: "Why does if (x == 5 y == 3) give \"expected a ')'\"?"
    answer: "Two conditions need an operator between them. After x == 5 the compiler expects either the closing ) or an operator, and finds y instead. Write if (x == 5 && y == 3) for both, or || for either."
  - question: "Why does my #define cause \"expected a ')'\"?"
    answer: "A #define is pasted into the code exactly as written, semicolon included. #define LIMIT 10; turns if (n == LIMIT) into if (n == 10;), and the ; arrives before the ). Remove the semicolon, or better, use constexpr int LIMIT = 10;."
---

# How to Fix "expected a ')'" in C++ (Visual Studio)

**Short answer:** a `(` was opened, and before Visual Studio found the matching `)` it ran into something that can't go inside the brackets. Usually the `)` is just missing. If the brackets do match, look for two conditions with no `&&` or `||` between them, or a `#define` that ends in a semicolon.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle) | `expected a ')'` |
| Visual Studio build | `C2143: syntax error: missing ')' before ';'`, or `C2059: syntax error` |
| GCC (g++, MinGW, Code::Blocks) | `expected ')' before '{' token` |
| Clang (Xcode, macOS) | `expected ')'`, then `note: to match this '('` |

<!-- optin-quick error="expected a ')'" -->

---

## Cause 1: An if Missing Its Closing Bracket

```cpp
#include <iostream>

int main() {
    int x = 7;
    if (x > 5 {
        std::cout << "Big\n";
    }
}
```

```
Visual Studio editor:  expected a ')'
GCC:                   error: expected ')' before '{' token
Clang:                 error: expected ')'
                       note: to match this '('
```

The `{` arrived while the condition was still open. Visual Studio's build output is confusing here: it reports `C2059: syntax error` on later lines, so trust the squiggle. **Fix:**

```cpp
#include <iostream>

int main() {
    int x = 7;
    if (x > 5) {
        std::cout << "Big\n";
    }
}
```

```
Big
```

## Cause 2: An Extra ( at the Start

```cpp
#include <iostream>

int main() {
    int x = 0;
    while ((x < 3) {
        x++;
    }
    std::cout << x << '\n';
}
```

```
Visual Studio editor:  expected a ')'
GCC:                   error: expected ')' before '{' token
Clang:                 error: expected ')'
                       note: to match this '('
```

Two `(` and one `)`. Either delete the extra `(` or close both. `while (x < 3)` prints `3` once the loop finishes.

## Cause 3: An Unfinished Function Call

```cpp
#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(2, 3;
    std::cout << sum << '\n';
}
```

```
Visual Studio editor:  expected a ')'
MSVC build:            error C2143: syntax error: missing ')' before ';'
GCC:                   error: expected ')' before ';' token
Clang:                 error: expected ')'
                       note: to match this '('
```

**Fix:** `int sum = add(2, 3);`, which prints `5`. The same applies to brackets used for grouping: `int total = (a + b * 2;` needs its `)` too, as in `(a + b) * 2`.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 4: Two Conditions With Nothing Between Them

```cpp
#include <iostream>

int main() {
    int x = 5, y = 3;
    if (x == 5 y == 3) {
        std::cout << "Both\n";
    }
}
```

```
Visual Studio editor:  expected a ')'
MSVC build:            error C2146: syntax error: missing ')' before identifier 'y'
GCC:                   error: expected ')' before 'y'
Clang:                 error: expected ')'
```

The brackets match, but after `x == 5` the compiler expects either the end of the condition or an operator, and finds `y`. **Fix:** join them with `&&` (both must be true) or `||` (either one):

```cpp
#include <iostream>

int main() {
    int x = 5, y = 3;
    if (x == 5 && y == 3) {
        std::cout << "Both\n";
    }
}
```

```
Both
```

## Cause 5: A #define That Ends in a Semicolon

This one is hard to spot, because the line with the squiggle looks perfect:

```cpp
#include <iostream>

#define LIMIT 10;

int main() {
    int n = 10;
    if (n == LIMIT) {
        std::cout << "At the limit\n";
    }
}
```

```
Visual Studio editor:  expected a ')'
MSVC build:            error C2059: syntax error: ')'
GCC:                   error: expected primary-expression before ')' token
Clang:                 error: expected expression
```

A `#define` is pasted into your code exactly as written, semicolon included, so `if (n == LIMIT)` becomes `if (n == 10;)`. Notice that GCC and Clang word it differently from Visual Studio here; they complain about the `)` after the stray `;`.

**Fix:** remove the semicolon from the `#define`, or better, use a real constant, which never has this problem:

```cpp
#include <iostream>

constexpr int LIMIT = 10;

int main() {
    int n = 10;
    if (n == LIMIT) {
        std::cout << "At the limit\n";
    }
}
```

```
At the limit
```

See [preprocessor directives](/posts/cpp-preprocessor-directives/) and [const vs constexpr](/posts/cpp-const-vs-constexpr/) for more.

## How to Find the Missing Bracket Fast

1. **Count the brackets on the flagged line.** Every `(` needs a `)`.
2. **Click next to a bracket.** Visual Studio and VS Code highlight its partner; if nothing lights up, that one is unmatched.
3. **Read Clang's note** if you have it: `to match this '('` points straight at the opening bracket.
4. **Check any `#define` the line uses** if the brackets all match.

## Quick Reference

| The line looks like | Fix |
|---|---|
| `if (x > 5 {` | `if (x > 5) {` |
| `while ((x < 3) {` | `while (x < 3) {` |
| `add(2, 3;` | `add(2, 3);` |
| `if (x == 5 y == 3)` | `if (x == 5 && y == 3)` |
| `#define LIMIT 10;` | `constexpr int LIMIT = 10;` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — Visual Studio's `expected a ';'`.
- [How to Fix 'expected an expression'](/posts/cpp-expected-an-expression/) — when a value is missing instead.
- [How to Fix Expected '}' at End of Input](/posts/cpp-expected-brace-at-end-of-input/) — the same problem with curly braces.
- [C++ Preprocessor Directives](/posts/cpp-preprocessor-directives/) — how #define really works.
