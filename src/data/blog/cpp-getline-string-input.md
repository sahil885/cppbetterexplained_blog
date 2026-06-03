---
title: "C++ getline: How to Read a Full Line of Input (With Spaces)"
description: "Learn how to use std::getline in C++ to read strings with spaces. Fix the classic cin skips spaces problem and the getline after cin bug, with clear examples."
pubDatetime: 2026-06-03T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "input-output", "tutorial"]
faqSchema:
  - question: "How do you read a full line with spaces in C++?"
    answer: "Use std::getline(std::cin, str). Unlike cin >> str, which stops at the first space, getline reads everything up to the newline, so it captures full sentences like 'New York City' into one string."
  - question: "Why does getline get skipped after cin?"
    answer: "After cin >> reads a number, it leaves the newline character in the input buffer. The next getline reads that leftover newline and returns an empty string. Fix it with std::cin.ignore() before calling getline."
  - question: "What is the difference between cin and getline in C++?"
    answer: "cin >> reads a single whitespace-separated token and stops at spaces or newlines. getline reads an entire line including spaces, up to and including the newline, which it discards. Use getline for full names or sentences."
draft: false
featured: false
---

# C++ getline: Reading a Full Line of Input

Sooner or later every beginner hits the same wall: they ask the user for their full name, type "John Smith", and the program only stores "John". The culprit is `cin >>`, and the fix is `std::getline`. Let's see exactly why this happens and how to handle it cleanly.

---

## The Problem with cin >>

The extraction operator `cin >>` reads one whitespace-separated token. It stops at the first space, tab, or newline:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your full name: ";
    std::cin >> name;
    std::cout << "Hello, " << name << "!\n";
    return 0;
}
```

Type `John Smith` and the output is `Hello, John!`. The word "Smith" is left sitting in the input buffer because `cin >>` quit at the space. That's perfect for reading single words or numbers, but wrong for anything with spaces.

---

## The Fix: std::getline

`std::getline` reads everything up to the newline, spaces included, and stores it in a string:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your full name: ";
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!\n";
    return 0;
}
```

Now `John Smith` comes through complete. `getline` takes two arguments: the input stream (`std::cin`) and the string to fill. It reads the whole line, throws away the trailing newline, and stops.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Classic getline-After-cin Bug

Here's the trickiest part, and a bug nearly every learner runs into. When you mix `cin >>` and `getline`, the `getline` seems to get skipped entirely:

```cpp
#include <iostream>
#include <string>

int main() {
    int age;
    std::string name;

    std::cout << "Enter your age: ";
    std::cin >> age;                  // leaves '\n' in the buffer

    std::cout << "Enter your name: ";
    std::getline(std::cin, name);     // reads the leftover '\n' — empty!

    std::cout << "Name: " << name << ", Age: " << age << "\n";
    return 0;
}
```

The name comes out blank. Why? When you typed your age and pressed Enter, `cin >> age` read the number but left the newline character behind. The following `getline` immediately reads that newline, treats it as the end of an empty line, and returns at once.

---

## Fixing It with cin.ignore

The solution is to discard the leftover newline before calling `getline`. `std::cin.ignore()` does exactly that:

```cpp
#include <iostream>
#include <string>
#include <limits>

int main() {
    int age;
    std::string name;

    std::cout << "Enter your age: ";
    std::cin >> age;

    // discard everything left on the current line, including the newline
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

    std::cout << "Enter your name: ";
    std::getline(std::cin, name);

    std::cout << "Name: " << name << ", Age: " << age << "\n";
    return 0;
}
```

That `ignore` call skips characters until it has thrown away a newline, clearing the buffer so `getline` starts fresh. The `<limits>` header provides the "as many as needed" value. Remember this pattern — you'll use it any time numeric input is followed by a line of text.

---

## Quick Reference

| Goal | Use |
|------|-----|
| Read a single word or number | `std::cin >> x;` |
| Read a full line with spaces | `std::getline(std::cin, line);` |
| getline right after cin >> | `std::cin.ignore(...)` first |

The takeaway: `cin >>` for tokens, `getline` for whole lines, and `cin.ignore` to bridge the two safely.

---

## Related Articles

- [C++ cin User Input](/posts/cpp-cin-user-input/) — the basics of reading input
- [C++ String Handling](/posts/cpp-string-handling/) — working with the strings getline fills
- [C++ String to int](/posts/cpp-string-to-int/) — converting input text to numbers
- [C++ stringstream](/posts/cpp-stringstream/) — parsing words out of a line
- [C++ Hello World Explained](/posts/cpp-hello-world-explained/) — cout and the iostream library

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
