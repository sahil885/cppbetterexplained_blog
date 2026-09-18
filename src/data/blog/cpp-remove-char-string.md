---
title: "How to Remove a Character from a String in C++"
description: "Remove characters from a C++ string with erase, the erase-remove idiom, and remove_if. Delete by index, by value, all spaces, or every character matching a rule."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "strings", "STL", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you remove a character from a string in C++?"
    answer: "To remove by position use s.erase(index, 1). To remove every occurrence of a character use the erase-remove idiom: s.erase(std::remove(s.begin(), s.end(), c), s.end())."
  - question: "Why does std::remove not actually remove anything?"
    answer: "std::remove cannot change a container's size. It shifts the unwanted elements to the back and returns an iterator to the new logical end, and you must call erase with that iterator to shorten the string."
  - question: "How do you remove all spaces from a string in C++?"
    answer: "Use the erase-remove idiom with a space: s.erase(std::remove(s.begin(), s.end(), ' '), s.end()). To remove all whitespace kinds, use remove_if with std::isspace instead."
  - question: "How do you remove the last character of a string in C++?"
    answer: "Call s.pop_back() in C++11 or later, or s.erase(s.size() - 1). Check the string is not empty first, because pop_back on an empty string is undefined behaviour."
---

# How to Remove a Character from a String in C++

**Short answer:** by position use `s.erase(index, 1)`. To remove every occurrence, use the erase-remove idiom:

```cpp
s.erase(std::remove(s.begin(), s.end(), 'a'), s.end());
```

---

## Remove by Position

```cpp
#include <iostream>
#include <string>

int main() {
    std::string s = "hello";

    s.erase(1, 1);        // remove 1 char at index 1
    std::cout << s;       // hllo
}
```

`erase(pos, count)` removes `count` characters starting at `pos`. Leave off the count and it removes everything from that position onward:

```cpp
std::string s = "hello world";
s.erase(5);               // hello
```

Passing an index beyond the end throws `std::out_of_range`, so validate first if the index comes from user input or a search.

## Remove the First or Last Character

```cpp
std::string s = "hello";

s.pop_back();             // hell     (C++11)
s.erase(0, 1);            // ell
```

`pop_back()` on an empty string is **undefined behaviour** — no exception, just silent corruption. Always guard it:

```cpp
if (!s.empty()) s.pop_back();
```

## Remove Every Occurrence: The Erase-Remove Idiom

This is the one people search for:

```cpp
#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string s = "banana";

    s.erase(std::remove(s.begin(), s.end(), 'a'), s.end());

    std::cout << s;       // bnn
}
```

It looks strange until you see what each half does.

<div class="inline-cta"><strong>Want the STL explained properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers strings, algorithms and containers in plain English — 87 pages, just $19.</div>

## Why std::remove Does Not Remove

`std::remove` works through iterators, and **iterators cannot resize a container**. So it does the only thing it can: it shuffles the characters you want to keep towards the front, and returns an iterator marking the new logical end.

```cpp
std::string s = "banana";
auto newEnd = std::remove(s.begin(), s.end(), 'a');

// s is now "bnn" + 3 leftover characters
// s.size() is still 6
```

The leftover tail is unspecified junk. `erase(newEnd, s.end())` chops it off and fixes the size. That is why the two calls are always written together — using `remove` alone is a classic bug that leaves a string looking right when printed but reporting the wrong length.

## Remove Characters Matching a Rule

`remove_if` takes a predicate instead of a value:

```cpp
#include <algorithm>
#include <cctype>

// remove all whitespace, not just spaces
s.erase(std::remove_if(s.begin(), s.end(),
        [](unsigned char c){ return std::isspace(c); }), s.end());

// keep only letters and digits
s.erase(std::remove_if(s.begin(), s.end(),
        [](unsigned char c){ return !std::isalnum(c); }), s.end());

// remove all digits
s.erase(std::remove_if(s.begin(), s.end(),
        [](unsigned char c){ return std::isdigit(c); }), s.end());
```

The `unsigned char` cast is not optional pedantry. Passing a negative `char` to `isspace` is undefined behaviour, and it genuinely crashes on some inputs with accented characters.

## Remove the First Occurrence Only

```cpp
std::string s = "banana";
size_t pos = s.find('a');
if (pos != std::string::npos) {
    s.erase(pos, 1);
}
std::cout << s;          // bnana
```

Always check for `npos` — passing it to `erase` throws.

## C++20: std::erase and std::erase_if

C++20 finally added the obvious spelling:

```cpp
#include <string>

std::string s = "banana";
std::erase(s, 'a');                                  // bnn

std::erase_if(s, [](char c){ return c == 'n'; });    // b
```

Same behaviour, no iterator pair, no chance of forgetting the `erase` half. Use it if your compiler supports C++20.

## Removing from a Vector Works the Same Way

The idiom is not string-specific:

```cpp
std::vector<int> v = {1, 2, 3, 2, 4};
v.erase(std::remove(v.begin(), v.end(), 2), v.end());
// 1 3 4
```

See [removing elements from a vector](/posts/cpp-remove-from-vector/) for the container version and its iterator traps.

## Quick Reference

| Goal               | Code                                                   |
| ------------------ | ------------------------------------------------------ |
| Remove at index    | `s.erase(i, 1)`                                        |
| Remove last char   | `s.pop_back()`                                         |
| Remove first char  | `s.erase(0, 1)`                                        |
| Remove first match | `s.erase(s.find(c), 1)`                                |
| Remove all matches | `s.erase(std::remove(s.begin(), s.end(), c), s.end())` |
| Remove by rule     | `std::remove_if(...)` + `erase`                        |
| C++20 shorthand    | `std::erase(s, c)`                                     |

---

## Take Your C++ Further

If you want strings and the STL explained properly instead of assembled from snippets, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Trim Whitespace from a String in C++](/posts/cpp-trim-string/) — removing only the ends.
- [How to Replace a Substring in a C++ String](/posts/cpp-replace-substring/) — swapping text instead of deleting it.
- [How to Remove an Element from a Vector](/posts/cpp-remove-from-vector/) — the same idiom on containers.
- [C++ String Handling: A Complete Guide](/posts/cpp-string-handling/) — the wider picture.
- [How to Check if a String Contains a Substring](/posts/cpp-string-contains-substring/) — finding before removing.
