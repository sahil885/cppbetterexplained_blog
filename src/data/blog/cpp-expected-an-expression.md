---
title: "How to Fix 'expected an expression' in C++ (Visual Studio)"
description: "Fix 'expected an expression' in Visual Studio C++: an empty value, an empty if, a missing function argument, => instead of >=, and a half-finished ?: operator."
pubDatetime: 2026-11-19T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'expected an expression' mean in C++?"
    answer: "Visual Studio reached a spot where a value had to go, and found nothing usable there. Usually something is missing: the value after =, the condition inside if (), an argument after a comma, or the last part of a ?: operator. Look at the character the red squiggle points at."
  - question: "Why does Visual Studio say 'expected an expression' but the build error is different?"
    answer: "The red squiggle comes from IntelliSense, which checks code as you type. The build uses the compiler, which words it differently, usually as C2059: syntax error followed by the character it tripped on, such as ';' or ')'. Both point at the same line."
  - question: "What is the GCC version of 'expected an expression'?"
    answer: "GCC says expected primary-expression before followed by the character it found, for example expected primary-expression before ';' token. Clang says expected expression. All three mean the same thing."
  - question: "Why does if (x => 5) give 'expected an expression'?"
    answer: "C++ has no => operator. The compiler reads x = and then finds > where a value should be. Write >= for greater than or equal to, with the equals sign second."
---

# How to Fix "expected an expression" in C++ (Visual Studio)

**Short answer:** Visual Studio reached a spot in your code where a **value** has to go, and there's nothing usable there. Something is usually missing: the value after `=`, the condition inside `if ()`, an argument after a comma, or the last part of `? :`. Look at the exact character the red squiggle is under, and check what should come right before it.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle) | `expected an expression` |
| Visual Studio build | `C2059: syntax error: ';'` (or `')'`, `'>'`) |
| GCC (g++, MinGW, Code::Blocks) | `expected primary-expression before ';' token` |
| Clang (Xcode, macOS) | `expected expression` |

<!-- optin-quick error="expected an expression" -->

---

## What "Expression" Means Here

An **expression** is anything that produces a value: `42`, `x`, `a + b`, `add(2, 3)`, `score >= 5`. Lots of places in C++ need one: after `=`, inside `if ( )`, between the commas of a function call, after `return`.

When one of those places is empty, or holds something that isn't a value, the editor stops with "expected an expression". The fix is to put the missing value back.

## Cause 1: Nothing After the =

```cpp
#include <iostream>

int main() {
    int total = ;
    std::cout << total << '\n';
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C2059: syntax error: ';'
GCC:                   error: expected primary-expression before ';' token
Clang:                 error: expected expression
```

The `;` arrived where the value should be. **Fix:** give it a value, `int total = 10;`, or leave the `=` out and assign it later.

The same thing happens anywhere a line ends too early, such as `std::cout << "Total: " << ;`.

## Cause 2: An Empty if Condition

```cpp
#include <iostream>

int main() {
    int score = 7;
    if () {
        std::cout << "Passed\n";
    }
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C2059: syntax error: ')'
                       error C2143: syntax error: missing ';' before '{'
GCC:                   error: expected primary-expression before ')' token
Clang:                 error: expected expression
```

An `if` needs a condition to test. **Fix:**

```cpp
#include <iostream>

int main() {
    int score = 7;
    if (score >= 5) {
        std::cout << "Passed\n";
    }
}
```

```
Passed
```

## Cause 3: A Missing Function Argument

```cpp
#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << add(2, ) << '\n';
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C2059: syntax error: ')'
GCC:                   error: expected primary-expression before ')' token
Clang:                 error: expected expression
```

The comma promises a second argument that never arrives. **Fix:** `add(2, 3)`, which prints `5`. If you meant to leave an argument out, give the parameter a [default argument](/posts/cpp-default-arguments/) instead.

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 4: => Instead of >=

```cpp
#include <iostream>

int main() {
    int age = 20;
    if (age => 18) {
        std::cout << "Adult\n";
    }
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C2059: syntax error: '>'
GCC:                   error: expected primary-expression before '>' token
Clang:                 error: expected expression
```

C++ has no `=>` operator. The compiler reads `age =`, an assignment, then finds `>` where the value being assigned should be. **Fix:** put the equals sign second:

```cpp
#include <iostream>

int main() {
    int age = 20;
    if (age >= 18) {
        std::cout << "Adult\n";
    }
}
```

```
Adult
```

The same goes for `=<`, which should be `<=`. All the comparison operators are in the [conditionals tutorial](/posts/cpp-conditionals-tutorial/).

## Cause 5: A Half-Finished ?: Operator

```cpp
#include <iostream>

int main() {
    int a = 4, b = 9;
    int bigger = (a > b) ? a : ;
    std::cout << bigger << '\n';
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C2059: syntax error: ';'
GCC:                   error: expected primary-expression before ';' token
Clang:                 error: expected expression
```

The ternary operator needs a value on **both** sides of the colon. **Fix:** `int bigger = (a > b) ? a : b;`, which prints `9`. More in the [ternary operator guide](/posts/cpp-ternary-operator/).

## Cause 6: Empty Square Brackets

```cpp
#include <iostream>

int main() {
    int scores[3] = {90, 85, 77};
    scores[] = 100;
    std::cout << scores[0] << '\n';
}
```

```
Visual Studio editor:  expected an expression
MSVC build:            error C7732: expected an expression before ']'
GCC:                   error: expected primary-expression before ']' token
Clang:                 error: expected expression
```

Empty brackets are only allowed when you *declare* an array and let the compiler count the values, as in `int scores[] = {90, 85, 77};`. To change one element, say which one: `scores[0] = 100;`.

## A Close Relative: "type name is not allowed"

If the squiggle says **type name is not allowed** instead, you put a *type* where a value belongs, as in `std::cout << int;` or `Counter.count()`. That has its own guide: [how to fix 'type name is not allowed'](/posts/cpp-type-name-is-not-allowed/).

## Quick Reference

| The line looks like | What's missing | Fix |
|---|---|---|
| `int total = ;` | The value | `int total = 10;` |
| `if () {` | The condition | `if (score >= 5) {` |
| `add(2, )` | An argument | `add(2, 3)` |
| `if (age => 18)` | Nothing: the operator is backwards | `if (age >= 18)` |
| `x ? a : ;` | The value after `:` | `x ? a : b` |
| `scores[] = 100;` | The index | `scores[0] = 100;` |

For the GCC wording of the same mistakes, see [expected primary-expression before](/posts/cpp-expected-primary-expression/). For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [How to Fix 'expected primary-expression before'](/posts/cpp-expected-primary-expression/) — the GCC version of this error.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — Visual Studio's `expected a ';'` and friends.
- [How to Fix `expected a ')'`](/posts/cpp-expected-closing-parenthesis/) — when a bracket is left open.
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else and the comparison operators.
