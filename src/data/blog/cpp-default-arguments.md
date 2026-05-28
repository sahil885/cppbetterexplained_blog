---
title: "C++ Default Arguments: How to Give Function Parameters Default Values"
description: "Learn how C++ default function arguments work with clear examples. Reduce repetitive function calls and write cleaner APIs with optional parameters."
pubDatetime: 2026-05-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "tutorial"]
faqSchema:
  - question: "What are default arguments in C++?"
    answer: "Default arguments let you specify a fallback value for a function parameter. If the caller doesn't provide that argument, the default value is used automatically. They're declared in the function signature using an equals sign, e.g. void greet(std::string name = \"World\")."
  - question: "Where must default arguments be placed in a C++ function signature?"
    answer: "Default arguments must always be at the end of the parameter list. Once a parameter has a default, every parameter after it must also have a default. You can't have a default parameter followed by a non-default one."
  - question: "What is the difference between default arguments and function overloading in C++?"
    answer: "Both let you call a function with fewer arguments, but they work differently. Default arguments use a single function definition with fallback values. Function overloading uses separate function definitions with different parameter lists. Use defaults when the logic is the same but one parameter is optional; use overloading when the logic differs."
draft: false
featured: false
---

# C++ Default Arguments: How to Give Function Parameters Default Values

Sometimes a function parameter almost always gets the same value. Rather than forcing the caller to repeat it every time, C++ lets you declare a **default value** right in the function signature. If the caller provides an argument, that value is used. If not, the default kicks in.

---

## Basic Syntax

Declare a default by writing `= value` after the parameter name:

```cpp
#include <iostream>
#include <string>

void greet(std::string name = "World") {
    std::cout << "Hello, " << name << "!\n";
}

int main() {
    greet("Alice");  // Hello, Alice!
    greet();         // Hello, World!
    return 0;
}
```

The second call uses the default value `"World"` because no argument was passed.

---

## Multiple Default Arguments

You can give defaults to multiple parameters. The rule is: **defaults must be at the end of the list** — you can't have a non-default parameter after a default one.

```cpp
#include <iostream>

void drawBox(int width, int height = 5, char fill = '*') {
    for (int row = 0; row < height; row++) {
        for (int col = 0; col < width; col++) {
            std::cout << fill;
        }
        std::cout << "\n";
    }
}

int main() {
    drawBox(4);           // width=4, height=5, fill='*'
    std::cout << "\n";
    drawBox(3, 2);        // width=3, height=2, fill='*'
    std::cout << "\n";
    drawBox(3, 2, '#');   // width=3, height=2, fill='#'
    return 0;
}
```

Output:
```
****
****
****
****
****

***
***

###
###
```

This works because you always provide the required parameter (`width`) and optionally override the defaults.

---

## The "Trailing Defaults" Rule

This is valid:
```cpp
void example(int a, int b = 10, int c = 20);  // fine
```

This is NOT valid:
```cpp
void example(int a = 5, int b, int c = 20);  // error — b has no default but follows a
```

Think of it like a queue: once you start adding defaults, every parameter that follows must also have a default.

---

## Default Arguments in Header Files

If you split your code into header (`.h`) and implementation (`.cpp`) files, declare the defaults **only in the header** — not in both places. Putting them in both causes a compiler error.

```cpp
// myFunc.h
void connect(std::string host, int port = 8080, bool secure = false);

// myFunc.cpp
void connect(std::string host, int port, bool secure) {
    // no defaults here
}
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Default Arguments vs Function Overloading

Both achieve similar results, but the right choice depends on your situation:

```cpp
// Using defaults — single function, same logic
void log(std::string msg, bool newline = true) {
    std::cout << msg;
    if (newline) std::cout << "\n";
}

// Using overloading — separate logic per version
void log(std::string msg) { std::cout << msg << "\n"; }
void log(std::string msg, int level) {
    std::cout << "[" << level << "] " << msg << "\n";
}
```

Use defaults when the function body is the same and you just want optional parameters. Use [function overloading](/posts/cpp-function-overloading/) when different argument types require genuinely different behaviour.

---

## Practical Example: A Configurable Timer

```cpp
#include <iostream>

void startTimer(int seconds, bool verbose = false, std::string label = "Timer") {
    if (verbose) {
        std::cout << label << " starting: " << seconds << "s\n";
    }
    // (actual timer logic would go here)
    if (verbose) {
        std::cout << label << " finished.\n";
    }
}

int main() {
    startTimer(10);                          // quiet mode
    startTimer(5, true);                     // verbose, default label
    startTimer(3, true, "Download timer");   // fully specified
    return 0;
}
```

---

## Related Articles

- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/)
- [C++ Function Overloading: Same Name, Different Parameters Explained](/posts/cpp-function-overloading/)
- [C++ Header Files Explained for Beginners](/posts/cpp-header-files/)
- [C++ Pass by Value vs Pass by Reference](/posts/cpp-pass-by-value-reference/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
