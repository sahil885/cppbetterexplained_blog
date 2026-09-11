---
title: "How to Trim Whitespace from a String in C++"
description: "Trim leading and trailing whitespace from a C++ string. Copy-paste trim, ltrim and rtrim functions using find_first_not_of, plus a C++20 ranges version."
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "strings", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you trim a string in C++?"
    answer: "C++ has no built-in trim function. The standard approach is to find the first and last non-whitespace characters with find_first_not_of and find_last_not_of, then return the substring between them. A complete copy-paste function is shown below."
  - question: "Why does C++ not have a built-in trim function?"
    answer: "std::string is deliberately minimal and stores raw bytes without assuming a text convention. Trimming requires deciding what counts as whitespace, so the standard library leaves it to you. Boost provides trim functions if you already use Boost."
  - question: "What characters count as whitespace when trimming?"
    answer: "Usually space, tab, newline, carriage return, form feed and vertical tab, written as \" \\t\\n\\r\\f\\v\". You can pass any set of characters you want to strip to find_first_not_of, so trimming is not limited to whitespace."
  - question: "How do you remove all spaces from a string, not just the ends?"
    answer: "Use the erase-remove idiom: s.erase(std::remove(s.begin(), s.end(), ' '), s.end()). That deletes every space in the string rather than only the leading and trailing ones."
---

# How to Trim Whitespace from a String in C++

**Short answer:** C++ has no built-in `trim()`. Use `find_first_not_of` and `find_last_not_of` to locate the first and last non-whitespace characters, then take the substring between them. Copy-paste function below.

---

## The Copy-Paste Trim Function

```cpp
#include <iostream>
#include <string>

const std::string WHITESPACE = " \t\n\r\f\v";

std::string ltrim(const std::string& s) {
    size_t start = s.find_first_not_of(WHITESPACE);
    return (start == std::string::npos) ? "" : s.substr(start);
}

std::string rtrim(const std::string& s) {
    size_t end = s.find_last_not_of(WHITESPACE);
    return (end == std::string::npos) ? "" : s.substr(0, end + 1);
}

std::string trim(const std::string& s) {
    return rtrim(ltrim(s));
}

int main() {
    std::string messy = "   hello world   ";
    std::cout << "[" << trim(messy) << "]\n";   // [hello world]
    std::cout << "[" << ltrim(messy) << "]\n";  // [hello world   ]
    std::cout << "[" << rtrim(messy) << "]\n";  // [   hello world]
}
```

That is the whole job. The rest of this article explains why it works and the traps around it.

## Why There Is No std::string::trim

`std::string` is a container of bytes, not a text type. It does not assume your data is human-readable text, so it does not assume you want whitespace removed. Trimming also needs a decision — is a non-breaking space whitespace? what about a null byte? — and the standard library avoids making that choice for you.

The practical consequence: every C++ codebase ends up with its own small trim helper. Put the one above in a utility header and stop rewriting it.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers strings, vectors and the STL in plain English — 87 pages, just $19.</div>

## How find_first_not_of Actually Works

`find_first_not_of` scans from the left and returns the index of the first character that is **not** in the set you pass:

```cpp
std::string s = "   abc";
size_t i = s.find_first_not_of(" ");  // 3 — index of 'a'
```

`find_last_not_of` does the same from the right:

```cpp
std::string s = "abc   ";
size_t i = s.find_last_not_of(" ");   // 2 — index of 'c'
```

So `substr(start, end - start + 1)` gives you everything between the first and last real characters.

## The All-Whitespace Trap

If the string contains nothing but whitespace, `find_first_not_of` returns `std::string::npos` — a huge unsigned value. Passing that to `substr` throws `std::out_of_range`, or silently produces garbage if you do arithmetic on it first:

```cpp
std::string blank = "     ";
size_t start = blank.find_first_not_of(WHITESPACE);  // npos
// blank.substr(start);  // throws std::out_of_range
```

That is exactly why both functions above check for `npos` and return an empty string. Skipping that check is the single most common bug in hand-written trim code.

## Trimming in Place

If you would rather modify the string instead of returning a copy, erase from both ends:

```cpp
void trimInPlace(std::string& s) {
    s.erase(0, s.find_first_not_of(WHITESPACE));
    size_t end = s.find_last_not_of(WHITESPACE);
    if (end != std::string::npos) s.erase(end + 1);
    else s.clear();
}
```

`erase(0, n)` removes the first `n` characters, and `erase(pos)` removes everything from `pos` onward.

## Trimming Other Characters

Nothing here is whitespace-specific. Pass whatever set you want to strip:

```cpp
std::string quoted = "\"hello\"";
std::string bare = trimChars(quoted, "\"");   // hello

std::string padded = "000042000";
std::string digits = trimChars(padded, "0");  // 42
```

with:

```cpp
std::string trimChars(const std::string& s, const std::string& chars) {
    size_t start = s.find_first_not_of(chars);
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(chars);
    return s.substr(start, end - start + 1);
}
```

Useful for stripping quotes off CSV fields or leading zeros off IDs.

## Trimming Input from cin

The most common reason people need trim is user input. Note that `std::getline` already strips the newline, but it keeps any spaces the user typed:

```cpp
std::string name;
std::getline(std::cin, name);
name = trim(name);   // "  Sahil  " becomes "Sahil"
```

If you are mixing `cin >>` and `getline` and getting skipped input, that is a different problem — see [clearing the input buffer with cin.ignore](/posts/cpp-cin-ignore-clear-buffer/).

## Removing All Spaces Instead

Trim only touches the ends. To delete every space in the string, use the erase-remove idiom:

```cpp
#include <algorithm>

std::string s = "a b c d";
s.erase(std::remove(s.begin(), s.end(), ' '), s.end());
std::cout << s;   // abcd
```

`std::remove` shuffles the unwanted characters to the back and returns an iterator to the new logical end; `erase` then actually shortens the string. It does not remove anything on its own — forgetting the `erase` half is a classic mistake.

## Quick Reference

| Goal                 | Code                                                     |
| -------------------- | -------------------------------------------------------- |
| Trim both ends       | `trim(s)` from above                                     |
| Trim left only       | `s.erase(0, s.find_first_not_of(WS))`                    |
| Trim right only      | `s.erase(s.find_last_not_of(WS) + 1)`                    |
| Strip specific chars | `trimChars(s, "\"")`                                     |
| Remove all spaces    | `s.erase(std::remove(s.begin(), s.end(), ' '), s.end())` |

---

## Take Your C++ Further

If you want strings, vectors and the STL explained properly rather than looked up one function at a time, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English with diagrams and runnable examples. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ String Handling: A Complete Guide](/posts/cpp-string-handling/) — the full picture on std::string.
- [How to Split a String in C++](/posts/cpp-split-string/) — break a line into fields after trimming it.
- [C++ substr(): Extracting Substrings](/posts/cpp-substring/) — the function trim is built on.
- [cin.ignore() and Clearing the Input Buffer](/posts/cpp-cin-ignore-clear-buffer/) — fix skipped or stuck input.
- [How to Check if a String Contains a Substring](/posts/cpp-string-contains-substring/) — searching within strings.
