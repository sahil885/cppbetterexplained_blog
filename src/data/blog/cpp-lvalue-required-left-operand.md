---
title: "How to Fix 'lvalue required as left operand of assignment' in C++"
description: "Fix 'lvalue required as left operand of assignment' in C++: = instead of ==, an assignment written backwards, or assigning to a function's result."
pubDatetime: 2026-10-27T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'lvalue required as left operand of assignment' mean?"
    answer: "The left side of = has to be something that can store a value, such as a variable, an array element or an object's member. The error means you put a plain value there instead, like a number, the result of a calculation or a value returned from a function."
  - question: "Why does if (x % 2 = 0) give an lvalue error?"
    answer: "A single = assigns, so C++ tries to store 0 into x % 2, which is just a calculated value. Use == to compare: if (x % 2 == 0)."
  - question: "Why does if (x = 5) compile without an error?"
    answer: "x is a variable, so assigning 5 to it is allowed. The condition then checks the result, 5, which counts as true, so the if always runs. GCC warns about it with -Wall, Clang warns by default, and Visual Studio warns at warning level 4 with C4706."
  - question: "What is the Clang or Visual Studio version of this error?"
    answer: "Clang says expression is not assignable. Visual Studio reports C2106: '=': left operand must be l-value."
---

# How to Fix "lvalue required as left operand of assignment" in C++

**Short answer:** the left side of `=` has to be something that can store a value, like a variable. Usually you typed `=` where you meant `==` in a comparison such as `if (n % 2 = 0)`, or wrote an assignment backwards, as in `a + b = total`.

| Compiler | What you see |
|---|---|
| GCC (g++, MinGW, Code::Blocks) | `lvalue required as left operand of assignment` |
| Clang (Xcode, macOS) | `expression is not assignable` |
| Visual Studio | `C2106: '=': left operand must be l-value` |

<!-- optin-quick error="lvalue required as left operand of assignment" -->

---

## What "lvalue" Means

An **lvalue** is something with its own place in memory that you can store a value into: a variable, an array element, a member of an object. The name comes from being allowed on the **l**eft of `=`.

Everything else is just a value: a number like `10`, the result of `a + b`, or whatever a function returns. You can read those values, but there's nowhere to store anything in them:

```cpp
score = 10;    // fine: score is a variable
10 = score;    // error: 10 is just a value
```

Every cause below puts a plain value on the left of `=`.

## Cause 1: = Instead of == in a Condition

The classic. `=` assigns and `==` compares:

```cpp
#include <iostream>

int main() {
    int n = 7;
    if (n % 2 = 0) {
        std::cout << "even\n";
    }
}
```

```
GCC:    error: lvalue required as left operand of assignment
Clang:  error: expression is not assignable
MSVC:   error C2106: '=': left operand must be l-value
```

`n % 2` is a calculated value, so C++ can't store `0` in it.

**Fix:** compare with `==`:

```cpp
#include <iostream>

int main() {
    int n = 8;
    if (n % 2 == 0) {
        std::cout << "even\n";
    }
}
```

```
even
```

There's more on `%` in [the modulo operator](/posts/cpp-modulo-operator/), and on conditions in the [conditionals tutorial](/posts/cpp-conditionals-tutorial/).

## Cause 2: An Assignment Written Backwards

In maths, `a + b = total` and `total = a + b` say the same thing. In C++, `=` means "store the right side in the left side", so the order matters:

```cpp
#include <iostream>

int main() {
    int a = 2;
    int b = 3;
    int total;
    a + b = total;
    std::cout << total << '\n';
}
```

```
GCC:    error: lvalue required as left operand of assignment
Clang:  error: expression is not assignable
MSVC:   error C2106: '=': left operand must be l-value
```

A number on the left, as in `10 = score;`, gives exactly the same three messages.

**Fix:** put the variable on the left:

```cpp
#include <iostream>

int main() {
    int a = 2;
    int b = 3;
    int total = a + b;
    std::cout << total << '\n';
}
```

```
5
```

<!-- book-cta topic="fundamentals" placement="mid_article" -->

## Cause 3: Assigning to a Function's Return Value

```cpp
#include <iostream>

class Player {
public:
    int getHealth() const { return health; }
private:
    int health = 100;
};

int main() {
    Player hero;
    hero.getHealth() = 50;
    std::cout << hero.getHealth() << '\n';
}
```

```
GCC:    error: lvalue required as left operand of assignment
Clang:  error: expression is not assignable
MSVC:   error C2106: '=': left operand must be l-value
```

`getHealth()` hands back a copy of the number, not the `health` member itself, so there's nothing to store into.

The same thing happens with the standard library. `word.length() = 3;` gives the same error, because `length()` returns a number. To shorten a string, use `word.resize(3);`.

**Fix:** add a member function that changes the value, usually called a setter:

```cpp
#include <iostream>

class Player {
public:
    int getHealth() const { return health; }
    void setHealth(int h) { health = h; }
private:
    int health = 100;
};

int main() {
    Player hero;
    hero.setHealth(50);
    std::cout << hero.getHealth() << '\n';
}
```

```
50
```

See [getters and setters](/posts/cpp-getters-setters/) for when to use them.

## The Trap That Compiles: if (x = 5)

When the left side is a plain variable, `=` inside a condition is **legal**. There's no lvalue error, just a bug:

```cpp
#include <iostream>

int main() {
    int x = 2;
    if (x = 5) {
        std::cout << "x is 5\n";
    }
}
```

```
x is 5
```

`x = 5` stores 5 in `x`, and the condition then checks that 5. Any number other than zero counts as true, so the program prints "x is 5" even though `x` started as 2.

Whether you get a warning depends on your compiler and settings:

```
GCC (with -Wall):     warning: suggest parentheses around assignment used as truth value [-Wparentheses]
Clang:                warning: using the result of an assignment as a condition without parentheses [-Wparentheses]
Visual Studio (/W4):  warning C4706: assignment used as a condition
```

Without `-Wall`, GCC says nothing. Visual Studio only warns at warning level 4; at its default level 3 it's silent. Turning warnings up is the easiest way to catch this mistake.

## Similar Messages

Two related errors come from assigning to something that **is** a variable but isn't allowed to change:

| You wrote | GCC | Clang | Visual Studio |
|---|---|---|---|
| `maxPlayers = 6;` where `maxPlayers` is a `const int` | `assignment of read-only variable 'maxPlayers'` | `cannot assign to variable 'maxPlayers' with const-qualified type 'const int'` | `C3892: 'maxPlayers': assignment to const-qualified variable of type 'const int'` |
| `b = a;` where both are arrays | `invalid array assignment` | `array type 'int[3]' is not assignable` | `C3863: array type 'int [3]' is not assignable` |

For the `const` one, decide whether the value really should change. See [const in C++](/posts/cpp-const-keyword/). For arrays, copy them element by element, or use a `std::array` or `std::vector`, which you can copy with `=`. See [std::array](/posts/cpp-std-array/).

## Quick Reference

| You wrote | The fix |
|---|---|
| `if (n % 2 = 0)` | `if (n % 2 == 0)` |
| `a + b = total;` | `total = a + b;` |
| `10 = score;` | `score = 10;` |
| `obj.getValue() = 5;` | Add a setter: `obj.setValue(5);` |
| `word.length() = 3;` | `word.resize(3);` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="fundamentals" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else and the comparison operators.
- [The Modulo Operator in C++](/posts/cpp-modulo-operator/) — checking for even and odd numbers.
- [Getters and Setters in C++](/posts/cpp-getters-setters/) — changing an object's data the right way.
- [How to Fix 'expected primary-expression before'](/posts/cpp-expected-primary-expression/) — another error from a small typo.
