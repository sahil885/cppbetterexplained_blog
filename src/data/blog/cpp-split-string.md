---
title: "C++ Split String: How to Split a String by Delimiter (3 Ways)"
description: "Learn how to split a string in C++ by space, by a character, or by a substring. Three clear methods using stringstream, getline, and find, with examples."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you split a string in C++?"
    answer: "The simplest way is to put the string into a std::stringstream and read words out with the >> operator, which splits on whitespace. To split on a specific character like a comma, use std::getline(stream, token, ',') in a loop."
  - question: "How do you split a string by a comma in C++?"
    answer: "Wrap the string in a std::stringstream and call std::getline(ss, token, ',') in a while loop. Each call reads up to the next comma and stores the piece in token, which you push into a vector."
  - question: "Does C++ have a built-in split function?"
    answer: "No, the standard library has no single split() function like Python. You build splitting yourself with stringstream and getline, or with find and substr for multi-character delimiters. It only takes a few lines."
draft: false
featured: false
---

# C++ Split String: How to Split a String by Delimiter

**To split a string in C++, put it in a `std::stringstream` and read pieces out with `std::getline(ss, token, delimiter)`.** C++ has no built-in `split()` like Python, but a few lines of code handle every case — splitting by spaces, by a single character, or by a longer substring.

---

## Method 1: Split by Whitespace

If you just want the words in a sentence, a `stringstream` with the `>>` operator splits on any whitespace automatically:

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::string text = "the quick brown fox";
    std::stringstream ss(text);
    std::vector<std::string> words;

    std::string word;
    while (ss >> word) {          // >> skips whitespace
        words.push_back(word);
    }

    for (const std::string& w : words)
        std::cout << w << "\n";
    return 0;
}
```

The `>>` operator reads one whitespace-separated token at a time and stops at the end, so `words` ends up holding `the`, `quick`, `brown`, `fox`. This is the cleanest option when your separator is spaces or tabs.

---

## Method 2: Split by a Single Character (like a comma)

For a specific delimiter such as a comma, use `std::getline` with a third argument — the character to split on:

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, char delim) {
    std::vector<std::string> parts;
    std::stringstream ss(s);
    std::string item;
    while (std::getline(ss, item, delim)) {
        parts.push_back(item);
    }
    return parts;
}

int main() {
    for (const std::string& p : split("apple,banana,cherry", ','))
        std::cout << p << "\n";
    return 0;
}
```

`std::getline(ss, item, ',')` reads characters until it hits a comma, stores everything before it in `item`, and discards the comma. Looping until it returns false walks through the whole string. Pulling this into a reusable `split` function keeps your code clean — this is the workhorse method you'll use most.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: Split by a Multi-Character Delimiter

`getline` only splits on a single character. To split on a longer separator like `"::"` or `", "`, use `find` and `substr` to walk through the string manually:

```cpp
#include <iostream>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, const std::string& delim) {
    std::vector<std::string> parts;
    size_t start = 0;
    size_t pos;
    while ((pos = s.find(delim, start)) != std::string::npos) {
        parts.push_back(s.substr(start, pos - start));
        start = pos + delim.length();   // jump past the delimiter
    }
    parts.push_back(s.substr(start));   // the final piece
    return parts;
}

int main() {
    for (const std::string& p : split("a::bb::ccc", "::"))
        std::cout << p << "\n";
    return 0;
}
```

`find` locates the next delimiter; `substr` grabs the text before it. We advance `start` by the full delimiter length so multi-character separators work correctly. The last `substr` after the loop captures the piece after the final delimiter.

---

## Which Method to Use

| Your delimiter | Best method |
|----------------|-------------|
| Spaces / tabs | `stringstream >>` |
| Single char (comma, `;`) | `getline` with delimiter |
| Multi-char string (`::`, `", "`) | `find` + `substr` |

Start with the simplest method that fits your data. For most CSV-style and config parsing, the `getline` approach in Method 2 is all you need.

---

## Related Articles

- [C++ String Handling](/posts/cpp-string-handling/) — methods, substr, find, and more
- [C++ stringstream](/posts/cpp-stringstream/) — the stream that powers splitting
- [C++ getline](/posts/cpp-getline-string-input/) — reading lines and tokens
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — storing the split pieces
- [C++ String to int](/posts/cpp-string-to-int/) — converting split fields to numbers

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
