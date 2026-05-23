---
title: "C++ Output Formatting with iomanip: setw, setprecision, and More"
description: "Learn how to format C++ output using iomanip: control column width with setw, decimal places with setprecision, alignment, and fill characters."
pubDatetime: 2026-05-23T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "output", "tutorial"]
faqSchema:
  - question: "How do I control decimal places in C++ output?"
    answer: "Use std::fixed and std::setprecision(n) from <iomanip>. For example: cout << fixed << setprecision(2) << 3.14159 prints 3.14. std::fixed ensures the number is shown in decimal notation, and setprecision sets how many digits appear after the decimal point."
  - question: "How do I align output in columns in C++?"
    answer: "Use std::setw(n) to set the minimum field width. Combined with std::left or std::right (the default), you can align text and numbers in neat columns. setw only applies to the next output item, so you need to repeat it for each value."
  - question: "What header do I need for setw and setprecision in C++?"
    answer: "Include <iomanip> for manipulators like setw, setprecision, setfill, and fixed. The basic manipulators left, right, endl, and boolalpha are available from <iostream> without needing <iomanip>."
draft: false
featured: false
---

# C++ Output Formatting with iomanip

When you print numbers and tables, raw `std::cout` output often looks messy — too many decimal places, misaligned columns, inconsistent widths. The `<iomanip>` library gives you precise control over how output looks. It's surprisingly simple once you know the key manipulators.

---

## The Header You Need

```cpp
#include <iostream>
#include <iomanip>
```

`<iomanip>` provides the formatting manipulators. `<iostream>` provides `cout` itself.

---

## Controlling Decimal Places: setprecision and fixed

By default, C++ prints floating-point numbers with about 6 significant digits. Use `std::setprecision` to control this, and `std::fixed` to show a fixed number of digits after the decimal point:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    double pi = 3.14159265358979;

    std::cout << pi << "\n";                             // 3.14159 (default)
    std::cout << std::setprecision(2) << pi << "\n";    // 3.1 (2 significant digits)
    std::cout << std::fixed << std::setprecision(2) << pi << "\n"; // 3.14
    std::cout << std::fixed << std::setprecision(5) << pi << "\n"; // 3.14159
    return 0;
}
```

**Important:** once you set `std::fixed`, it stays active for all subsequent output in that stream. Reset it with `std::defaultfloat` if needed:

```cpp
std::cout << std::fixed << std::setprecision(2) << 9.99 << "\n"; // 9.99
std::cout << std::defaultfloat;
std::cout << 9.99 << "\n"; // 9.99 (back to default)
```

---

## Setting Column Width: setw

`std::setw(n)` sets the minimum width of the next output item. If the value is shorter than `n` characters, spaces are added (right-aligned by default):

```cpp
#include <iostream>
#include <iomanip>

int main() {
    std::cout << std::setw(10) << "Name" << std::setw(8) << "Score" << "\n";
    std::cout << std::setw(10) << "Alice"  << std::setw(8) << 95 << "\n";
    std::cout << std::setw(10) << "Bob"    << std::setw(8) << 87 << "\n";
    std::cout << std::setw(10) << "Carol"  << std::setw(8) << 100 << "\n";
    return 0;
}
```

Output:
```
      Name   Score
     Alice      95
       Bob      87
     Carol     100
```

**Key detail:** `setw` applies only to the **next single item**. You must repeat it for every value you want width-controlled.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Alignment: left and right

By default, values are right-aligned within their field width. Use `std::left` to flip this:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    // Right-aligned (default)
    std::cout << std::right;
    std::cout << std::setw(12) << "Alice" << std::setw(6) << 95 << "\n";
    std::cout << std::setw(12) << "Bob"   << std::setw(6) << 87 << "\n";

    std::cout << "\n";

    // Left-aligned
    std::cout << std::left;
    std::cout << std::setw(12) << "Alice" << std::setw(6) << 95 << "\n";
    std::cout << std::setw(12) << "Bob"   << std::setw(6) << 87 << "\n";
    return 0;
}
```

Output:
```
       Alice    95
         Bob    87

Alice           95    
Bob             87    
```

Unlike `setw`, `std::left` and `std::right` are **sticky** — they stay active until you change them.

---

## Custom Fill Character: setfill

By default, `setw` pads with spaces. Use `std::setfill(c)` to use a different character:

```cpp
#include <iostream>
#include <iomanip>

int main() {
    std::cout << std::setfill('-') << std::setw(20) << "TITLE" << "\n";
    // ---------------TITLE

    std::cout << std::setfill('0') << std::setw(6) << 42 << "\n";
    // 000042 (useful for formatting IDs, time values)
    return 0;
}
```

Like `left`/`right`, `setfill` is sticky until changed.

---

## Displaying Booleans as true/false

By default, `cout` prints `bool` values as `0` and `1`. Use `std::boolalpha` to get `true`/`false`:

```cpp
#include <iostream>

int main() {
    bool flag = true;
    std::cout << flag << "\n";              // 0 or 1
    std::cout << std::boolalpha << flag << "\n"; // true
    std::cout << std::noboolalpha;          // reset
    return 0;
}
```

---

## Displaying Numbers in Hex or Octal

```cpp
#include <iostream>

int main() {
    int n = 255;
    std::cout << std::hex << n << "\n";     // ff
    std::cout << std::oct << n << "\n";     // 377
    std::cout << std::dec << n << "\n";     // 255 (back to decimal)

    // With 0x prefix
    std::cout << std::showbase << std::hex << n << "\n"; // 0xff
    std::cout << std::noshowbase;
    return 0;
}
```

---

## Practical Example: A Formatted Receipt

Here's a complete program that prints a formatted receipt using the manipulators above:

```cpp
#include <iostream>
#include <iomanip>
#include <string>

void printItem(const std::string& name, int qty, double price) {
    std::cout << std::left  << std::setw(20) << name
              << std::right << std::setw(5)  << qty
              << std::right << std::setw(10) << std::fixed
              << std::setprecision(2) << (qty * price) << "\n";
}

int main() {
    std::cout << std::left  << std::setw(20) << "Item"
              << std::right << std::setw(5)  << "Qty"
              << std::right << std::setw(10) << "Total" << "\n";
    std::cout << std::string(35, '-') << "\n";

    printItem("Apple",     6,  0.50);
    printItem("Bread",     2,  2.49);
    printItem("Milk",      1,  1.99);
    printItem("Chocolate", 3,  1.25);

    std::cout << std::string(35, '-') << "\n";
    std::cout << std::left  << std::setw(25) << "Total"
              << std::right << std::setw(10) << std::fixed
              << std::setprecision(2) << (6*0.50 + 2*2.49 + 1.99 + 3*1.25) << "\n";
    return 0;
}
```

Output:
```
Item                  Qty     Total
-----------------------------------
Apple                   6      3.00
Bread                   2      4.98
Milk                    1      1.99
Chocolate               3      3.75
-----------------------------------
Total                         13.72
```

---

## Sticky vs One-Shot Manipulators

| Manipulator | Scope |
|---|---|
| `setw(n)` | **One-shot** — applies to next item only |
| `setprecision(n)` | Sticky — stays until changed |
| `fixed` / `defaultfloat` | Sticky |
| `left` / `right` | Sticky |
| `setfill(c)` | Sticky |
| `boolalpha` / `noboolalpha` | Sticky |
| `hex` / `oct` / `dec` | Sticky |

---

## Related Articles

- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/)
- [C++ User Input with cin: Reading from the Keyboard](/posts/cpp-cin-user-input/)
- [C++ String Handling: Everything a Beginner Needs to Know](/posts/cpp-string-handling/)
- [C++ Math Functions: Using the cmath Library](/posts/cpp-math-functions/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
