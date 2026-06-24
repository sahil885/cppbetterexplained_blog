---
title: "How to Get a Substring in C++ with substr()"
description: "Extract a substring in C++ using the substr() method. Learn the position and length arguments, how to grab the rest of a string, and how to avoid out_of_range."
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you get a substring in C++?"
    answer: "Call the substr() method on a std::string: text.substr(pos, len). It returns a new string starting at index pos and containing len characters. Indexing starts at 0, so the first character is position 0."
  - question: "What happens if you leave out the length in substr()?"
    answer: "If you call substr(pos) with only a starting position, you get every character from pos to the end of the string. This is the easiest way to grab the 'rest' of a string after a certain point."
  - question: "Why does substr() throw out_of_range in C++?"
    answer: "substr() throws std::out_of_range when the starting position is greater than the string's length. Check the length first, or make sure pos is valid, to avoid crashing your program."
draft: false
featured: false
---

# How to Get a Substring in C++ with substr()

Pulling a smaller piece out of a string — a file extension, a username, the first word — is everyday work in C++. The `substr()` method handles all of it. Once you understand its two arguments, slicing strings becomes second nature.

---

## The Basics of substr()

Call `substr()` on any `std::string`. It takes a **starting position** and a **length**, and returns a brand-new string with that slice:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string text = "Programming in C++";
    std::cout << text.substr(0, 11) << "\n";  // Programming
    std::cout << text.substr(15) << "\n";     // C++
    return 0;
}
```

Two things to internalise. First, positions start at **0**, so position 0 is the `P`. Second, the second number is a *length*, not an end position — `substr(0, 11)` means "11 characters starting at 0."

---

## Grab Everything After a Position

Leave out the length and `substr()` returns everything from your starting position to the end of the string. Combine it with `find()` to slice at a specific character — here, pulling a file's extension:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string path = "report.pdf";
    std::size_t dot = path.find('.');
    std::string extension = path.substr(dot + 1);
    std::cout << "Extension: " << extension << "\n";  // pdf
    return 0;
}
```

`find('.')` returns the index of the dot, and `substr(dot + 1)` takes everything after it. This "find a marker, then slice" pattern is the workhorse of simple text parsing.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## A Practical Example: Splitting an Email

Combine the two ideas to split an email address into its user and domain parts at the `@`:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string email = "ada@example.com";
    std::size_t at = email.find('@');
    std::string user = email.substr(0, at);   // up to the @
    std::string domain = email.substr(at + 1); // after the @
    std::cout << "User: " << user << "\n";      // ada
    std::cout << "Domain: " << domain << "\n";  // example.com
    return 0;
}
```

`substr(0, at)` takes the characters *before* the `@` (a length of `at`), and `substr(at + 1)` takes everything after it. No characters are copied twice, and the original `email` is left unchanged.

---

## Avoiding the out_of_range Error

There's one crash to watch for. If the starting position is **larger than the string's length**, `substr()` throws a `std::out_of_range` exception and your program stops. A quick length check keeps you safe:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string s = "short";
    std::size_t pos = 10;
    if (pos <= s.length())
        std::cout << s.substr(pos) << "\n";
    else
        std::cout << "Position is out of range\n";
    return 0;
}
```

This matters most when `pos` comes from `find()`, which returns `std::string::npos` (a huge value) when it finds nothing. Always confirm `find()` succeeded before feeding its result into `substr()`.

---

## Quick Reference

| Goal | Code |
|------|------|
| Characters `len` starting at `pos` | `s.substr(pos, len)` |
| Everything from `pos` to the end | `s.substr(pos)` |
| The whole string (a copy) | `s.substr(0)` |
| Slice after a found character | `s.substr(s.find(c) + 1)` |
| Stay safe | check `pos <= s.length()` first |

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/) — the std::string basics
- [C++ String Contains a Substring](/posts/cpp-string-contains-substring/) — searching with find()
- [C++ Split a String](/posts/cpp-split-string/) — break text into multiple pieces
- [C++ Reverse a String](/posts/cpp-reverse-string/) — another common string task
- [C++ getline: Read a Full Line of Input](/posts/cpp-getline-string-input/) — get the strings you'll slice

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
