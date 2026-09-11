---
title: "How to Replace a Substring in a C++ String"
description: "Replace text inside a C++ string: replace one occurrence, replace all occurrences with a loop, and use std::string::replace by position. Copy-paste code included."
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "strings", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you replace a substring in C++?"
    answer: "Find the substring with str.find(target), then call str.replace(pos, target.length(), replacement). To replace every occurrence you need a loop, because std::string::replace only handles one position at a time."
  - question: "Does C++ have a replace_all function for strings?"
    answer: "No. std::string::replace works on a single position and length, and std::replace from <algorithm> only swaps single characters. Replacing every occurrence of a substring requires a short loop, shown below."
  - question: "What is the difference between std::replace and std::string::replace?"
    answer: "std::replace from <algorithm> replaces individual characters across a range, for example turning every 'a' into 'b'. std::string::replace is a member function that swaps a span of characters, identified by position and length, for a different string."
  - question: "Why does my replace-all loop hang forever?"
    answer: "Because the replacement text contains the search text, so each replacement creates a new match. Advance your search position past the inserted text by using pos += replacement.length() instead of restarting the search from the beginning."
---

# How to Replace a Substring in a C++ String

**Short answer:** find the position with `find()`, then call `replace(pos, length, newText)`. There is no built-in replace-all, so replacing every occurrence needs a small loop — both versions are below.

---

## Replace the First Occurrence

```cpp
#include <iostream>
#include <string>

int main() {
    std::string s = "I like cats and cats like me";
    std::string target = "cats";
    std::string replacement = "dogs";

    size_t pos = s.find(target);
    if (pos != std::string::npos) {
        s.replace(pos, target.length(), replacement);
    }

    std::cout << s;   // I like dogs and cats like me
}
```

Three arguments to `replace`: where to start, how many characters to remove, and what to put there instead.

**Always check for `npos`.** If `find` does not locate the text it returns `std::string::npos`, and passing that to `replace` throws `std::out_of_range`.

## Replace All Occurrences

This is the function most people are actually looking for:

```cpp
#include <iostream>
#include <string>

void replaceAll(std::string& s,
                const std::string& target,
                const std::string& replacement) {
    if (target.empty()) return;

    size_t pos = 0;
    while ((pos = s.find(target, pos)) != std::string::npos) {
        s.replace(pos, target.length(), replacement);
        pos += replacement.length();
    }
}

int main() {
    std::string s = "I like cats and cats like me";
    replaceAll(s, "cats", "dogs");
    std::cout << s;   // I like dogs and dogs like me
}
```

Two details make this correct rather than subtly broken:

- **`s.find(target, pos)`** resumes the search from where you left off instead of scanning from the start each time.
- **`pos += replacement.length()`** steps past the text you just inserted.

<div class="inline-cta"><strong>Want the full picture?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> explains strings, vectors and the STL in plain English — 87 pages, just $19.</div>

## The Infinite Loop Trap

Skip that `pos +=` step and watch what happens when the replacement contains the target:

```cpp
// BROKEN — hangs forever
while ((pos = s.find("cat")) != std::string::npos) {
    s.replace(pos, 3, "cats");   // "cats" contains "cat"
}
```

Every replacement creates a fresh match at the same place, so the loop never ends and the string grows until memory runs out. Advancing the position is not an optimisation — it is what makes the loop terminate.

## Replacing by Position, Without Searching

If you already know where the text sits, skip `find` entirely:

```cpp
std::string date = "2026-09-11";
date.replace(4, 1, "/");   // one char at index 4
date.replace(7, 1, "/");
std::cout << date;         // 2026/09/11
```

The replacement does not have to be the same length as what it removes — the string resizes itself:

```cpp
std::string s = "hello world";
s.replace(0, 5, "goodbye");
std::cout << s;   // goodbye world
```

## Replacing Single Characters

For one character at a time, `std::replace` from `<algorithm>` is simpler and faster:

```cpp
#include <algorithm>

std::string path = "C:\\Users\\Sahil";
std::replace(path.begin(), path.end(), '\\', '/');
std::cout << path;   // C:/Users/Sahil
```

Note the different design: this takes **characters**, not strings, and it edits in place across the whole range. It cannot change the string's length, which is exactly why it can't replace substrings.

## Removing a Substring

Removing is just replacing with nothing:

```cpp
std::string s = "hello, cruel world";
size_t pos = s.find(", cruel");
if (pos != std::string::npos) {
    s.erase(pos, 7);        // or s.replace(pos, 7, "");
}
std::cout << s;             // hello world
```

## Case-Insensitive Replace

`find` is case-sensitive. To ignore case, search a lowercased copy while editing the original:

```cpp
#include <algorithm>
#include <cctype>

std::string lower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c){ return std::tolower(c); });
    return s;
}

void replaceAllInsensitive(std::string& s,
                           const std::string& target,
                           const std::string& replacement) {
    std::string hay = lower(s);
    std::string needle = lower(target);
    size_t pos = 0;
    while ((pos = hay.find(needle, pos)) != std::string::npos) {
        s.replace(pos, target.length(), replacement);
        hay = lower(s);
        pos += replacement.length();
    }
}
```

Rebuilding the lowercase copy each pass keeps the two strings aligned when the replacement changes the length.

## Quick Reference

| Goal                             | Code                                         |
| -------------------------------- | -------------------------------------------- |
| Replace first match              | `s.replace(s.find(t), t.size(), r)`          |
| Replace all matches              | `replaceAll(s, t, r)` from above             |
| Replace at known position        | `s.replace(pos, len, r)`                     |
| Replace one character everywhere | `std::replace(s.begin(), s.end(), 'a', 'b')` |
| Delete a substring               | `s.erase(pos, len)`                          |

---

## Take Your C++ Further

If you would rather understand strings and the STL than look up one function at a time, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** walks through the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Trim Whitespace from a String in C++](/posts/cpp-trim-string/) — clean up input before replacing in it.
- [How to Check if a String Contains a Substring](/posts/cpp-string-contains-substring/) — the find() call this builds on.
- [C++ substr(): Extracting Substrings](/posts/cpp-substring/) — pulling text out instead of swapping it.
- [C++ String Handling: A Complete Guide](/posts/cpp-string-handling/) — the wider std::string picture.
- [How to Split a String in C++](/posts/cpp-split-string/) — breaking a string into parts.
