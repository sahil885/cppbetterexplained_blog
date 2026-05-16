---
title: "C++ const vs constexpr: What's the Difference?"
description: "Learn the difference between const and constexpr in C++. This guide explains compile-time vs runtime constants, when to use each, and how constexpr functions work."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "modern C++", "tutorial"]
faqSchema:
  - question: "What is the difference between const and constexpr in C++?"
    answer: "const means the value cannot be changed after initialization — but it might be determined at runtime. constexpr means the value must be determined at compile time. constexpr is stricter: every constexpr value is also const, but not every const value is constexpr. Use constexpr for true compile-time constants."
  - question: "When should I use constexpr instead of const in C++?"
    answer: "Use constexpr when you know the value at compile time and want the compiler to guarantee this (for use as array sizes, template arguments, or performance-critical constants). Use const when the value won't change but might only be known at runtime (like a value read from user input or a file)."
  - question: "What is a constexpr function in C++?"
    answer: "A constexpr function can be evaluated at compile time if called with compile-time arguments, or at runtime if called with runtime arguments. If the result is used in a compile-time context (like an array size or template argument), the compiler evaluates it at compile time. This makes them more flexible than regular const."
draft: false
featured: false
---

# C++ `const` vs `constexpr`: What's the Difference?

Both `const` and `constexpr` mean "this value doesn't change." But they differ in one important way: **when** the value is determined.

---

## `const`: Value Fixed After Initialization

A `const` variable's value is fixed once assigned — but the assignment can happen at runtime:

```cpp
const int x = 5;          // Compile-time — value known immediately
const int y = x * 2;      // Also compile-time — computed from x

int n;
cin >> n;
const int z = n;          // Runtime — value determined by user input
                           // Still const (can't change), but not compile-time
```

`const` means "don't change this value." It says nothing about *when* the value is determined.

---

## `constexpr`: Value Guaranteed at Compile Time

A `constexpr` variable must be fully determined at compile time:

```cpp
constexpr int x = 5;      // Fine — 5 is a compile-time constant
constexpr int y = x * 2;  // Fine — x is constexpr, so x*2 is too

int n;
cin >> n;
constexpr int z = n;      // Error! n is runtime — not compile-time
```

If you try to initialize a `constexpr` with a runtime value, the compiler gives an error. This is the guarantee: `constexpr` values are always available at compile time.

---

## Why Compile-Time Constants Matter

Several C++ features require compile-time constants:

**Array sizes:**
```cpp
const int n = 5;       // May or may not work as array size (implementation-defined for local const int)
constexpr int m = 5;   // Always works

int arr[m];            // Fine — m is a compile-time constant
```

**Template arguments:**
```cpp
constexpr int SIZE = 100;
array<int, SIZE> data;      // Fine — constexpr as template arg
bitset<SIZE> flags;         // Fine

const int RUNTIME_SIZE = getSizeFromFile();
array<int, RUNTIME_SIZE> bad;  // Error — not compile-time
```

**`static_assert`:**
```cpp
constexpr int MAX_USERS = 1000;
static_assert(MAX_USERS > 0, "Must have at least one user");  // Checked at compile time
```

---

## `constexpr` Functions

A `constexpr` function can be evaluated at compile time if called with compile-time arguments, or at runtime otherwise:

```cpp
constexpr int square(int x) {
    return x * x;
}

constexpr int a = square(5);    // Evaluated at compile time → a = 25
int b = square(7);              // Evaluated at runtime — still works

int n;
cin >> n;
int c = square(n);              // Runtime — n is not compile-time
```

**Compile-time vs runtime behavior:**
```cpp
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

constexpr int f5 = factorial(5);  // Computed at compile time — no runtime cost
// f5 is literally 120 in the compiled binary

int x = 10;
int fx = factorial(x);            // Computed at runtime (x is not constexpr)
```

This flexibility makes `constexpr` functions powerful — write once, works in both contexts.

---

## `const` vs `constexpr` for Member Functions

In a class, `const` on a member function means "this function doesn't modify the object." `constexpr` member functions can additionally be evaluated at compile time:

```cpp
class Circle {
    double radius;
public:
    constexpr Circle(double r) : radius(r) {}  // constexpr constructor

    constexpr double area() const {            // constexpr + const
        return 3.14159 * radius * radius;
    }
};

constexpr Circle c(5.0);
constexpr double a = c.area();  // Computed at compile time!
```

---

## When to Use Each

**Use `const` when:**
- The value shouldn't change after initialization
- The value might only be known at runtime (user input, file reading, etc.)
- Parameters of functions that shouldn't modify the argument

```cpp
void printName(const string& name) { ... }  // const parameter reference
const int maxAttempts = getConfigValue();    // Runtime value, but immutable
```

**Use `constexpr` when:**
- The value is genuinely known at compile time
- You need the value as an array size, template argument, or enum
- You're writing a function you want to be evaluatable at compile time
- You're defining mathematical or physical constants

```cpp
constexpr double PI = 3.14159265358979;
constexpr int MAX_SIZE = 256;
constexpr int KB = 1024;
constexpr int MB = 1024 * KB;
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## `consteval` (C++20): Always at Compile Time

C++20 added `consteval` for functions that must always be evaluated at compile time (unlike `constexpr` which can run at runtime too):

```cpp
consteval int mustBeCompileTime(int x) {
    return x * x;
}

constexpr int a = mustBeCompileTime(5);  // Fine — compile time
int x = 10;
int b = mustBeCompileTime(x);           // Error — x is runtime!
```

---

## Summary

| | `const` | `constexpr` |
|-|---------|------------|
| Value doesn't change | Yes | Yes |
| Compile-time required | No | Yes |
| Works with runtime values | Yes | No |
| Can be array size | Sometimes | Always |
| Can be template arg | Sometimes | Always |
| Applies to functions | Yes (means "no mutation") | Yes (enables compile-time eval) |

The practical rule: if the value is a true constant that the compiler can know (like `PI` or buffer sizes), use `constexpr`. If the value is just "don't change this after I set it" — especially from runtime sources — use `const`.

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — variable declaration basics
- [C++ Enum Tutorial](/posts/cpp-enum-tutorial/) — enums and constexpr work together well
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — constexpr functions
- [C++ Templates Explained](/posts/cpp-templates-explained/) — templates use compile-time constants heavily

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
