---
title: "C++ Check if String Contains Substring (find and contains)"
description: "Learn how to check if a string contains a substring in C++ using find(), the C++23 contains() method, and a case-insensitive approach, with clear examples."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you check if a string contains a substring in C++?"
    answer: "Use the find() method: if (text.find(\"word\") != std::string::npos) is true when the substring is present. find returns the index of the match, or std::string::npos if it isn't found."
  - question: "What is std::string::npos in C++?"
    answer: "npos is a special constant meaning 'not found' or 'no position'. Functions like find return npos when they fail to locate what you searched for, so you compare against it to test for a match."
  - question: "Does C++ have a contains method for strings?"
    answer: "Yes, since C++23 std::string has a contains() method that returns a bool directly: text.contains(\"word\"). On older compilers, use find() != std::string::npos instead."
draft: false
featured: false
---

# C++ Check if String Contains Substring

**To check if a string contains a substring in C++, use `find`: `text.find("word") != std::string::npos` is `true` when the substring is present.** In C++23 there's also a cleaner `contains()` method. Let's look at both, plus how to do a case-insensitive search.

---

## The Standard Way: find

`std::string::find` searches for a substring and returns the index where it starts — or the special value `std::string::npos` if it isn't there:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string text = "the quick brown fox";

    if (text.find("brown") != std::string::npos) {
        std::cout << "Found it!\n";
    } else {
        std::cout << "Not found.\n";
    }
    return 0;
}
```

The key is comparing against `std::string::npos`. Because `find` returns an index (and index 0 is a valid match at the very start), you must not test it as a simple true/false — always compare with `npos`.

---

## Getting the Position

The return value of `find` is useful on its own when you want to know *where* the match is:

```cpp
std::string text = "name=Alice";
size_t pos = text.find("=");
if (pos != std::string::npos) {
    std::string value = text.substr(pos + 1);  // "Alice"
    std::cout << value << "\n";
}
```

Here `find` locates the `=`, and `substr` grabs everything after it. This pairs naturally with splitting and parsing tasks.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Modern Way: contains (C++23)

C++23 added a `contains()` method that returns a `bool` directly, so there's no `npos` comparison to remember:

```cpp
// Requires C++23: compile with g++ -std=c++23
std::string text = "the quick brown fox";
if (text.contains("brown")) {
    std::cout << "Found it!\n";
}
```

This is the most readable option when your compiler supports it. If you're on an older toolchain, the `find` approach above does exactly the same job.

---

## Case-Insensitive Search

`find` is case-sensitive, so `"Brown"` won't match `"brown"`. For a case-insensitive check, convert both strings to lowercase first:

```cpp
#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c){ return std::tolower(c); });
    return s;
}

int main() {
    std::string text = "The Quick Brown Fox";
    bool found = toLower(text).find("brown") != std::string::npos;
    std::cout << (found ? "found\n" : "missing\n");  // found
    return 0;
}
```

We lowercase a copy of the text (and your search term, if needed) so the comparison ignores case. Wrapping `std::tolower` in a lambda with `unsigned char` avoids a subtle undefined-behavior trap with negative characters.

---

## Quick Reference

| Goal | Code |
|------|------|
| Does it contain X? | `s.find("X") != std::string::npos` |
| C++23 shortcut | `s.contains("X")` |
| Where is X? | `size_t pos = s.find("X");` |
| Ignore case | lowercase both, then `find` |

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/) — find, substr, replace, and more
- [C++ Split String](/posts/cpp-split-string/) — break a string into pieces
- [C++ stringstream](/posts/cpp-stringstream/) — stream-based parsing
- [C++ String to int](/posts/cpp-string-to-int/) — convert found text to numbers

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
