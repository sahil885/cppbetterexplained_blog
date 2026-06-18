---
title: "C++ char to int Conversion: The Right Way (and the Common Trap)"
description: "Convert a char to an int in C++ correctly: the ch - '0' trick for digit characters, static_cast for ASCII codes, and stoi for strings, with clear examples."
pubDatetime: 2026-06-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you convert a char to an int in C++?"
    answer: "It depends on what you want. To turn the digit character '7' into the number 7, subtract '0': int n = ch - '0'. To get a character's ASCII code, use static_cast<int>(ch)."
  - question: "Why does converting a char to an int give a big number like 55?"
    answer: "A char already stores a number — its ASCII code. The character '7' has the code 55. Casting the char shows that code. Subtract '0' to get the digit's actual value instead."
  - question: "What is the ch - '0' trick in C++?"
    answer: "Digit characters sit in order in ASCII, so '0' is 48, '1' is 49, and so on. Subtracting '0' from any digit character gives the number it represents: '7' - '0' = 7."
draft: false
featured: false
---

# C++ char to int Conversion

Converting a `char` to an `int` in C++ sounds simple, but it trips up almost every beginner — because a `char` is *already* a number under the hood. What you do next depends on whether you want the digit it shows or the ASCII code behind it. Let's clear it up.

---

## The Trap: a char Already Holds a Number

Every `char` stores a small integer called its ASCII code. So "converting" isn't really about changing types — it's about deciding which number you want:

```cpp
#include <iostream>

int main() {
    char c = '7';
    std::cout << c << "\n";        // prints 7  (the character)
    std::cout << (int)c << "\n";   // prints 55 (its ASCII code)
    return 0;
}
```

The character `'7'` has the ASCII code `55`. If you cast it straight to `int`, you get `55`, not `7`. That surprise is the root of almost every char-to-int bug.

---

## Convert a Digit Character to Its Value

When you have a single digit like `'7'` and want the number `7`, subtract the character `'0'`:

```cpp
#include <iostream>

int main() {
    char digit = '7';
    int value = digit - '0';        // 55 - 48 = 7
    std::cout << value * 2 << "\n"; // 14 — real arithmetic now
    return 0;
}
```

This works because the digit characters `'0'` through `'9'` sit in consecutive order in ASCII. `'0'` is 48, so subtracting it shifts any digit down to its true value. It's the single most useful char trick in C++.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Get the ASCII Code on Purpose

Sometimes you *do* want the ASCII code — for example, to check ranges or do character math. Make that intent obvious with `static_cast<int>`:

```cpp
#include <iostream>

int main() {
    char letter = 'A';
    int code = static_cast<int>(letter);  // 65
    std::cout << letter << " has ASCII code " << code << "\n";
    return 0;
}
```

`static_cast<int>` is the modern, readable way to say "I really do mean the numeric code." It's clearer than the old C-style `(int)letter` and easier to spot when reading code later.

---

## Convert a Whole Number String

If your characters form a multi-digit number stored in a `std::string`, don't loop digit by digit — use `std::stoi` ("string to int"):

```cpp
#include <iostream>
#include <string>

int main() {
    std::string text = "452";
    int number = std::stoi(text);   // 452
    std::cout << number + 1 << "\n"; // 453
    return 0;
}
```

`std::stoi` parses the whole string at once and even handles a leading minus sign. Reach for it whenever you're turning user input or file text into a number.

---

## Going the Other Way: int to char

To turn a single-digit number back into its character, add `'0'`:

```cpp
#include <iostream>

int main() {
    int n = 5;
    char digit = n + '0';          // '5'
    std::cout << digit << "\n";    // 5 (as a character)
    return 0;
}
```

Adding `'0'` is the mirror image of subtracting it. This pairs nicely with building strings character by character.

---

## Quick Reference

| Goal | Code |
|------|------|
| Digit char → its value | `int v = c - '0';` |
| Char → ASCII code | `int code = static_cast<int>(c);` |
| Number string → int | `int n = std::stoi(text);` |
| Digit value → char | `char c = n + '0';` |

---

## Related Articles

- [How to Convert String to int in C++](/posts/cpp-string-to-int/) — stoi, atoi, and stringstream
- [C++ int to string Conversion](/posts/cpp-int-to-string/) — every method explained
- [C++ Type Casting Explained](/posts/cpp-type-casting/) — static_cast and friends
- [C++ String vs char array](/posts/cpp-string-vs-char-array/) — when to use each
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — how char really works

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
