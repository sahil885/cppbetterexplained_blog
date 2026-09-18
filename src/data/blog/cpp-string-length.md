---
title: "C++ String Length: size() vs length() vs strlen()"
description: "Get the length of a string in C++. Why size() and length() are identical, when to use strlen for char arrays, and the signed-unsigned trap that breaks loops."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "strings", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you get the length of a string in C++?"
    answer: "Call s.length() or s.size() on a std::string. They are identical functions returning the same value, so either is correct. For a C-style char array use strlen from <cstring>."
  - question: "What is the difference between size() and length() in C++?"
    answer: "Nothing. They are exact synonyms on std::string and return the same number of characters. length() reads better for text while size() matches every other STL container, which is why generic code prefers size()."
  - question: "What is the difference between strlen and size in C++?"
    answer: "strlen walks a char array counting bytes until it finds the null terminator, which costs O(n). std::string::size() returns a stored value in O(1), so it is both faster and safe on strings containing embedded nulls."
  - question: "Why does s.length() - 1 break on an empty string?"
    answer: "Because length() returns an unsigned size_t. On an empty string 0 - 1 wraps around to a huge positive number instead of -1, so loop conditions like i <= s.length() - 1 run far past the end of the string."
---

# C++ String Length: size() vs length() vs strlen()

**Short answer:** for a `std::string`, call `s.length()` or `s.size()` — they are the same function. For a C-style `char*`, use `strlen(s)`.

```cpp
std::string s = "hello";
std::cout << s.length();   // 5
std::cout << s.size();     // 5  — identical
```

---

## size() and length() Are Identical

This trips people up because it looks like there must be a difference. There is not:

```cpp
std::string s = "hello world";

std::cout << s.length() << '\n';   // 11
std::cout << s.size()   << '\n';   // 11
```

Both return the number of characters, both are O(1), both return `size_t`. The duplication is historical: `length()` reads naturally for text, while `size()` is the name every other STL container uses. Template code that might receive a `vector` or a `string` uses `size()` for consistency — that is the only real reason to prefer one.

## strlen() Is for char Arrays

```cpp
#include <cstring>

const char* c = "hello";
std::cout << std::strlen(c);      // 5
```

`strlen` counts bytes until it hits the null terminator `'\0'`. That has two consequences worth knowing:

- **It is O(n).** Calling it inside a loop condition re-scans the whole string every iteration.
- **It stops at the first null.** A string containing an embedded `\0` reports a shorter length than it holds.

`std::string::size()` has neither problem because the length is stored, not computed. This is one of several reasons to prefer `std::string` over raw char arrays — see [string vs char array](/posts/cpp-string-vs-char-array/).

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers strings and the STL in plain English — 87 pages, just $19.</div>

## sizeof Is Not String Length

A very common mistake:

```cpp
char arr[] = "hello";
std::cout << sizeof(arr);       // 6 — includes the '\0'
std::cout << std::strlen(arr);  // 5

const char* p = "hello";
std::cout << sizeof(p);         // 8 — the size of a POINTER

std::string s = "hello";
std::cout << sizeof(s);         // ~32 — the size of the object, not the text
```

`sizeof` is a compile-time question about types and storage. It never tells you how many characters a string holds.

## The Unsigned Length Trap

`length()` returns `size_t`, which is **unsigned**. That makes this loop infinite on an empty string:

```cpp
// BROKEN when s is empty
for (size_t i = 0; i <= s.length() - 1; ++i) {
    std::cout << s[i];
}
```

If `s.length()` is 0, then `s.length() - 1` is not −1 — it wraps to roughly 18 quintillion, so the loop runs far past the end and reads memory it does not own.

Safe alternatives:

```cpp
for (size_t i = 0; i < s.length(); ++i) { ... }     // < not <=

for (char c : s) { ... }                            // best
```

The same trap appears when comparing a length against a signed number:

```cpp
int n = -1;
if (s.length() > n) { ... }    // n converts to a huge unsigned value
```

Compilers warn about this as a signed/unsigned comparison. It is worth fixing rather than silencing.

## Checking for an Empty String

```cpp
if (s.empty()) { ... }         // clear and O(1)
if (s.length() == 0) { ... }   // same thing, noisier
```

Prefer `empty()`. On other containers it can be cheaper than computing a size, and it states the intent directly.

## Length of Unicode Text

`length()` returns **bytes**, not visible characters:

```cpp
std::string s = "café";
std::cout << s.length();       // 5, not 4 — é takes two bytes in UTF-8
```

For ASCII these are the same. For anything international they are not, and counting user-perceived characters correctly needs a Unicode library. If you are validating a length limit on user input, be aware you are limiting bytes.

## Quick Reference

| You have           | Get length with            | Cost         |
| ------------------ | -------------------------- | ------------ |
| `std::string`      | `s.size()` or `s.length()` | O(1)         |
| `char*` / `char[]` | `std::strlen(s)`           | O(n)         |
| Checking for empty | `s.empty()`                | O(1)         |
| Array storage size | `sizeof(arr)`              | compile time |

---

## Take Your C++ Further

If you want strings and the STL explained properly rather than looked up piecemeal, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ String Handling: A Complete Guide](/posts/cpp-string-handling/) — everything else std::string does.
- [C++ string vs char Array](/posts/cpp-string-vs-char-array/) — why size() beats strlen().
- [How to Find the Size of an Array in C++](/posts/cpp-array-size/) — the same question for arrays.
- [How to Trim Whitespace from a String in C++](/posts/cpp-trim-string/) — length after cleaning input.
- [C++ substr(): Extracting Substrings](/posts/cpp-substring/) — using length to slice.
