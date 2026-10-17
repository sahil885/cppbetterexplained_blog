---
title: "How to Fix 'expected primary-expression before' in C++"
description: "Fix expected primary-expression before 'int', ']' and ';' in C++. The seven usual causes, with code and the GCC, Clang and Visual Studio messages."
pubDatetime: 2026-10-17T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "errors", "debugging"]
draft: false
featured: false
faqSchema:
  - question: "What does expected primary-expression before mean in C++?"
    answer: "The compiler needed a value, such as a variable, a number or a function call, and found something else. The token after the word before shows where it went wrong: a type name like int, an empty ], or the end of the statement."
  - question: "Why do I get expected primary-expression before 'int'?"
    answer: "Usually because you included the parameter types when calling a function, for example add(int x, int y). Types belong in the function's definition. When you call it, pass just the values: add(x, y)."
  - question: "How do I fix expected primary-expression before ']' token?"
    answer: "You are probably passing an array with empty brackets, like printAll(nums[], 3). Pass the array's name on its own: printAll(nums, 3). The empty brackets belong only in the function's parameter list."
  - question: "What is the Clang or Visual Studio version of this error?"
    answer: "Clang usually says expected expression, or expected '(' for function-style cast or type construction when a type appears where a value should be. Visual Studio reports a syntax error such as C2059, or C2144 ('int' should be preceded by ')') when a type appears inside a function call."
---

# How to Fix "expected primary-expression before" in C++

**Short answer:** the compiler needed a **value** — a variable, a number, a function call — and found something else instead: a type name like `int`, an empty `]`, or nothing at all. The token after "before" tells you exactly where to look.

The same mistake gets different wording on each compiler:

| Compiler | What you see |
|---|---|
| GCC (g++, MinGW, Code::Blocks) | `expected primary-expression before 'int'` |
| Clang (Xcode, macOS) | `expected expression`, or `expected '(' for function-style cast or type construction` |
| Visual Studio | `C2144: syntax error: 'int' should be preceded by ')'`, or `C2059: syntax error` |

---

## What's a "Primary Expression"?

It's the simplest building block of an expression — something that *has a value*:

- a variable: `total`
- a literal: `42`, `3.14`, `"hello"`
- a function call: `add(2, 3)`
- anything in parentheses: `(price * 2)`

So "expected primary-expression before 'int'" means: *I needed a value here, but the next thing I found was `int`* — which is a type, not a value. Below are the seven ways that usually happens.

## Cause 1: Putting Types in a Function Call

This is the big one. When you **define** a function, you list the types of its parameters. When you **call** it, you don't:

```cpp
#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 2, y = 3;
    int sum = add(int x, int y);
    std::cout << sum << '\n';
}
```

```
GCC:    error: expected primary-expression before 'int'
Clang:  error: expected '(' for function-style cast or type construction
MSVC:   error C2144: syntax error: 'int' should be preceded by ')'
```

**Fix:** pass just the values — `int sum = add(x, y);`

The types are already known from the function's definition, so the call only needs the values. More on this in the [functions tutorial](/posts/cpp-functions-tutorial/).

<div class="inline-cta"><strong>Learning C++ from scratch?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains the fundamentals — and the parts that trip most beginners up, like pointers, memory and OOP — in 87 plain-English pages. Just $19.</div>

## Cause 2: Passing an Array With Empty Brackets

The same mix-up, with arrays:

```cpp
#include <iostream>

void printAll(int arr[], int size) {
    for (int i = 0; i < size; ++i) std::cout << arr[i] << ' ';
}

int main() {
    int nums[3] = {1, 2, 3};
    printAll(nums[], 3);
}
```

```
GCC:    error: expected primary-expression before ']' token
Clang:  error: expected expression
MSVC:   error C7732: expected an expression before ']'
```

**Fix:** `printAll(nums, 3);` — pass the array's name on its own. The empty `[]` belongs only in the parameter list. See [how to pass an array to a function](/posts/cpp-pass-array-to-function/).

## Cause 3: A Missing Value After an Operator

An operator with nothing after it:

```cpp
#include <iostream>

int main() {
    int price = 20;
    int total = price * ;
    std::cout << total;
}
```

```
GCC:    error: expected primary-expression before ';' token
Clang:  error: expected expression
MSVC:   error C2059: syntax error: ';'
```

The same thing happens with a dangling `<<` — `std::cout << "Hello" << ;` gives the identical message. **Fix:** finish the expression, e.g. `int total = price * quantity;`

## Cause 4: An Unfinished Condition

```cpp
#include <iostream>

int main() {
    int x = 5;
    if (x > 0 && ) {
        std::cout << "positive";
    }
}
```

```
GCC:    error: expected primary-expression before ')' token
Clang:  error: expected expression
MSVC:   error C2059: syntax error: ')'
```

**Fix:** give `&&` its second half — `if (x > 0 && x < 10)`.

## Cause 5: An Extra Semicolon in a for Loop

A `for` loop has exactly **two** semicolons inside its parentheses. A third one confuses the parser:

```cpp
#include <iostream>

int main() {
    for (int i = 0; i < 3; i++;) {
        std::cout << i;
    }
}
```

```
GCC:    error: expected ')' before ';' token
        error: expected primary-expression before ')' token
Clang:  error: unexpected ';' before ')'
MSVC:   error C2059: syntax error: ';'
```

**Fix:** `for (int i = 0; i < 3; i++)`

## Cause 6: Using a Type Name Instead of a Variable

Calling a function on the **type** rather than on your **variable**:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Sam";
    std::cout << std::string.length();
}
```

```
GCC:    error: expected primary-expression before '.' token
Clang:  error: expected '(' for function-style cast or type construction
MSVC:   error C2275: 'std::string': expected an expression instead of a type
```

**Fix:** call it on the variable — `name.length()`. It's the same mistake with your own classes: `Player.getName()` instead of `player.getName()`. The class is the blueprint; the object is the thing that has a name.

## Cause 7: A Missing template Keyword (Templates Only)

If you're not writing templates yet, skip this one. Inside a template, calling a member function template on an object whose type depends on a template parameter needs the `template` keyword:

```cpp
#include <iostream>

struct Settings {
    template <typename T> T get() const { return T{}; }
};

template <typename Config>
void printValue(const Config& c) {
    std::cout << c.get<int>() << '\n';
}

int main() {
    printValue(Settings{});
}
```

```
GCC:    error: expected primary-expression before 'int'
Clang:  error: use 'template' keyword to treat 'get' as a dependent template name
```

Clang names the fix for you: write `c.template get<int>()`. Without it, the compiler reads the `<` as a less-than sign. More in [templates explained](/posts/cpp-templates-explained/).

## How to Read the Message

The token after "before" is your best clue:

| Message ends with | Usually means |
|---|---|
| `before 'int'` (or another type) | A type where a value goes — usually inside a function call |
| `before ']' token` | Empty brackets — usually passing an array as `arr[]` |
| `before ';' token` | Something's missing at the end of the line |
| `before ')' token` | Something's missing at the end of a condition or call |
| `before '.' token` | A type name used as if it were a variable |

Always fix the **first** error and recompile — one of these can trigger several follow-on errors that disappear once it's fixed. For more messages and what they mean, see [C++ error messages explained](/posts/cpp-error-messages/).

---

## Take Your C++ Further

Errors like this come from the difference between *declaring* things and *using* them — the idea that makes functions, arrays and classes click. The **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** explains it all in plain English, including the parts that trip beginners up most: pointers, memory and OOP. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — the most common errors and what they mean.
- [How to Fix Expected ';' Errors](/posts/cpp-expected-semicolon/) — the other syntax error every beginner hits.
- [How to Fix 'was not declared in this scope'](/posts/cpp-not-declared-in-this-scope/) — when the compiler doesn't know a name.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — defining functions vs calling them.
- [How to Pass an Array to a Function](/posts/cpp-pass-array-to-function/) — the right way to hand over an array.
