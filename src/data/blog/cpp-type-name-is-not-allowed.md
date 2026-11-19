---
title: "How to Fix 'type name is not allowed' in C++ (Visual Studio)"
description: "Fix 'type name is not allowed' in Visual Studio C++: a type in a function call, Class.member instead of an object or ::, and std::string.size() instead of name.size()."
pubDatetime: 2026-11-19T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "visual-studio"]
draft: false
featured: false
hideMidOptin: true
faqSchema:
  - question: "What does 'type name is not allowed' mean in C++?"
    answer: "You used the name of a type, such as int, std::string or one of your own classes, in a place where C++ needs a value. A type describes what kind of thing something is; it isn't a thing you can pass, print or call a function on. Use a variable or object of that type instead."
  - question: "Why does Point.x give 'type name is not allowed'?"
    answer: "Point is the struct, not a particular point. Make an object first, Point p = {3, 4};, then use p.x. The dot always goes after an object, never after a type name."
  - question: "How do I call a static function without an object?"
    answer: "Use two colons instead of a dot: Counter::count(). The dot is for objects; :: is for things that belong to the class itself."
  - question: "What is the build error for 'type name is not allowed'?"
    answer: "Visual Studio's build usually reports C2275: expected an expression instead of a type. GCC says expected primary-expression before '.' or before 'int', and Clang says the name does not refer to a value."
---

# How to Fix "type name is not allowed" in C++ (Visual Studio)

**Short answer:** you wrote the name of a **type**, such as `int`, `std::string` or one of your own classes, where C++ needs a **value**. A type only describes what kind of thing something is; you can't pass it, print it, or call a function on it. Use a variable or object of that type instead, or `::` for something that belongs to the class itself.

| Where | What you see |
|---|---|
| Visual Studio editor (red squiggle) | `type name is not allowed` |
| Visual Studio build | `C2275: expected an expression instead of a type` |
| GCC (g++, MinGW, Code::Blocks) | `expected primary-expression before '.' token` |
| Clang (Xcode, macOS) | `'Point' does not refer to a value` |

<!-- optin-quick error="type name is not allowed" -->

---

## Type vs Value

`int` is a type. `4` is a value of that type, and so is a variable like `int x = 4;`. In the same way, `std::string` is a type and `std::string name = "Sam";` gives you a value called `name`.

A cookie cutter and a cookie is a good way to picture it: the class or struct is the cutter, and each object is a cookie made with it. You can eat a cookie, but not the cutter. This error means you tried to use the cutter.

## Cause 1: A Type in a Function Call

Copying a function's declaration into the call is very common:

```cpp
#include <iostream>
#include <string>

int square(int n) {
    return n * n;
}

int main() {
    int x = 4;
    int result = square(int x);
    std::cout << result << '\n';
}
```

```
Visual Studio editor:  type name is not allowed
MSVC build:            error C2144: syntax error: 'int' should be preceded by ')'
GCC:                   error: expected primary-expression before 'int'
Clang:                 error: expected '(' for function-style cast or type construction
```

The type belongs in the function's **definition** (`int square(int n)`). When you **call** it, you pass just the value. **Fix:** `square(x)`, which prints `16`.

## Cause 2: Using a Struct Instead of an Object

```cpp
#include <iostream>
#include <string>

struct Point {
    int x;
    int y;
};

int main() {
    Point p = {3, 4};
    std::cout << Point.x << '\n';
}
```

```
Visual Studio editor:  type name is not allowed
MSVC build:            error C2275: 'Point': expected an expression instead of a type
GCC:                   error: expected primary-expression before '.' token
Clang:                 error: 'Point' does not refer to a value
```

`Point` is the struct; `p` is the actual point. **Fix:** use the object's name: `std::cout << p.x << '\n';` prints `3`. See [structs explained](/posts/cpp-structs-explained/) for more.

<!-- book-cta topic="oop" placement="mid_article" -->

## Cause 3: Calling a Static Function With a Dot

```cpp
#include <iostream>
#include <string>

class Counter {
public:
    static int count() { return 3; }
};

int main() {
    std::cout << Counter.count() << '\n';
}
```

```
Visual Studio editor:  type name is not allowed
MSVC build:            error C2275: 'Counter': expected an expression instead of a type
GCC:                   error: expected primary-expression before '.' token
Clang:                 error: 'Counter' does not refer to a value
```

A `static` function belongs to the class, not to any one object, so you call it through the class with `::`. **Fix:** `Counter::count()`, which prints `3`. The dot is only for objects. More on this in [the static keyword](/posts/cpp-static-keyword/) and the [scope resolution operator](/posts/cpp-scope-resolution-operator/).

## Cause 4: std::string.size() Instead of name.size()

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Sam";
    std::cout << std::string.size() << '\n';
}
```

```
Visual Studio editor:  type name is not allowed
MSVC build:            error C2275: 'std::string': expected an expression instead of a type
GCC:                   error: expected primary-expression before '.' token
Clang:                 error: expected '(' for function-style cast or type construction
```

`size()` tells you the length of a particular string, so it needs the string: **Fix:** `name.size()`, which prints `3`. The same goes for vectors: `scores.size()`, not `std::vector<int>.size()`.

## Cause 5: Printing a Type

`std::cout << int;` gets the same squiggle. There's nothing to print: a type has no value. To print a variable, use its name. To see how big a type is, use `sizeof(int)`, which is allowed because `sizeof` takes a type in brackets. See [the sizeof operator](/posts/cpp-sizeof-operator/).

## Quick Reference

| You wrote | Fix |
|---|---|
| `square(int x)` | `square(x)` |
| `Point.x` | `p.x` (an object of type `Point`) |
| `Counter.count()` for a static function | `Counter::count()` |
| `std::string.size()` | `name.size()` |
| `std::cout << int;` | Print a variable, or `sizeof(int)` |

For other common messages, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

<!-- book-cta topic="oop" placement="end_cta" -->

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [C++ Classes and Objects](/posts/cpp-classes-and-objects/) — the difference between a class and an object.
- [C++ Structs Explained](/posts/cpp-structs-explained/) — creating and using structs.
- [How to Fix 'expected an expression'](/posts/cpp-expected-an-expression/) — when a value is missing altogether.
- [How to Fix 'does not name a type'](/posts/cpp-does-not-name-a-type/) — the opposite problem: a value where a type belongs.
