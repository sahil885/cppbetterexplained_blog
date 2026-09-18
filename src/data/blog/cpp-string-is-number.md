---
title: "How to Check if a String Is a Number in C++"
description: "Check whether a C++ string is a valid number using stoi with exceptions, stringstream, or from_chars. Handles negatives, decimals and trailing junk correctly."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "strings", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you check if a string is a number in C++?"
    answer: "Feed the string into a stringstream and confirm both that the extraction succeeded and that nothing is left over: ss >> value && ss.eof(). That correctly rejects inputs like 12abc, which a plain stoi call would accept."
  - question: "Why does stoi accept 12abc in C++?"
    answer: "stoi parses as far as it can and stops at the first character it cannot use, returning 12 and ignoring the rest. To reject trailing junk you must pass the optional pos argument and check that it equals the string length."
  - question: "How do you check if a string is an integer versus a decimal?"
    answer: "Parse into the type you want to allow. Extracting into an int rejects 3.14 at the decimal point, while extracting into a double accepts it. Choosing the target type is how you decide which formats count as valid."
  - question: "Is isdigit enough to validate a number in C++?"
    answer: "No. Looping with isdigit rejects valid numbers with a minus sign, a decimal point or scientific notation, and it silently accepts strings too large to fit the type. Use stringstream or from_chars for real validation."
---

# How to Check if a String Is a Number in C++

**Short answer:** parse it and check that the whole string was consumed. The shortest correct version:

```cpp
#include <sstream>

bool isNumber(const std::string& s) {
    std::istringstream ss(s);
    double d;
    return (ss >> d) && ss.eof();
}
```

Both halves matter — `ss >> d` proves it parsed, `ss.eof()` proves nothing was left over.

---

## Why the Obvious Approaches Fail

**isdigit on every character** is the first thing most people try:

```cpp
// BROKEN — too strict and too lenient at once
bool isNumber(const std::string& s) {
    for (char c : s) {
        if (!std::isdigit(static_cast<unsigned char>(c))) return false;
    }
    return !s.empty();
}
```

This rejects `-42`, `3.14` and `1e5`, all of which are perfectly good numbers. It also accepts `99999999999999999999`, which does not fit in an `int` — so you "validate" it and then overflow when you convert.

**stoi on its own** is the second attempt, and it is too permissive:

```cpp
int n = std::stoi("12abc");   // returns 12 — no error!
```

`stoi` parses as far as it can and quietly ignores the rest. For user input that is usually wrong: someone typing `12abc` made a mistake, and you should say so.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers strings, input and the STL in plain English — 87 pages, just $19.</div>

## The stringstream Method

```cpp
#include <iostream>
#include <sstream>
#include <string>

bool isInteger(const std::string& s) {
    std::istringstream ss(s);
    int value;
    return (ss >> value) && ss.eof();
}

bool isDecimal(const std::string& s) {
    std::istringstream ss(s);
    double value;
    return (ss >> value) && ss.eof();
}

int main() {
    std::cout << isInteger("42")    << '\n';  // 1
    std::cout << isInteger("-42")   << '\n';  // 1
    std::cout << isInteger("3.14")  << '\n';  // 0 — stops at the dot
    std::cout << isInteger("12abc") << '\n';  // 0 — leftover characters
    std::cout << isInteger("")      << '\n';  // 0
    std::cout << isDecimal("3.14")  << '\n';  // 1
    std::cout << isDecimal("1e5")   << '\n';  // 1
}
```

Notice you pick the rules by picking the type. Want to allow decimals? Parse into a `double`. Integers only? Parse into an `int`.

One subtlety: leading whitespace is skipped by `>>`, so `"  42"` passes. Trailing whitespace fails the `eof()` check, so `"42  "` does not. If you want both accepted, [trim the string](/posts/cpp-trim-string/) first.

## The stoi Method, Done Correctly

`stoi` takes an optional second argument that reports how many characters it consumed:

```cpp
#include <string>

bool isInteger(const std::string& s) {
    if (s.empty()) return false;
    try {
        size_t pos;
        std::stoi(s, &pos);
        return pos == s.size();     // the whole string was used
    } catch (const std::invalid_argument&) {
        return false;               // no number at all
    } catch (const std::out_of_range&) {
        return false;               // too big for int
    }
}
```

This version has a real advantage over stringstream: **it catches out-of-range values**. `"99999999999999999999"` throws `std::out_of_range` rather than silently misbehaving.

The cost is exception handling, which is slow if you are validating thousands of strings in a loop.

## The Modern Method: from_chars (C++17)

```cpp
#include <charconv>
#include <string>

bool isInteger(const std::string& s) {
    int value;
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), value);
    return ec == std::errc() && ptr == s.data() + s.size();
}
```

`from_chars` is the fastest option — no exceptions, no allocations, no locale. The return gives you an error code and a pointer to where parsing stopped, so you check both exactly as before.

Note it does **not** skip leading whitespace and does not accept a leading `+`, which makes it stricter than the alternatives. That is usually a feature for machine-readable data.

## Validating User Input

In practice you usually want to combine this with a retry loop:

```cpp
#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::string line;
    int n;
    while (true) {
        std::cout << "Enter a whole number: ";
        std::getline(std::cin, line);

        std::istringstream ss(line);
        if ((ss >> n) && ss.eof()) break;

        std::cout << "That is not a whole number.\n";
    }
    std::cout << "Got " << n << '\n';
}
```

Reading whole lines with `getline` and parsing afterwards avoids the buffer problems that come from mixing `cin >>` with `getline`. The full treatment is in [C++ input validation](/posts/cpp-input-validation/).

## Quick Reference

| Method               | Rejects `12abc` | Catches overflow | Speed             |
| -------------------- | --------------- | ---------------- | ----------------- |
| `isdigit` loop       | yes             | no               | fast but wrong    |
| `stringstream`       | yes             | no               | moderate          |
| `stoi` + `pos`       | yes             | yes              | slow (exceptions) |
| `from_chars` (C++17) | yes             | yes              | fastest           |

For user input, use stringstream or `stoi`. For parsing large files, use `from_chars`.

---

## Take Your C++ Further

If you want strings, input handling and the STL explained properly rather than looked up one function at a time, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Input Validation: Handling Bad cin Input](/posts/cpp-input-validation/) — the retry loop this belongs in.
- [How to Convert a String to an int in C++](/posts/cpp-string-to-int/) — once you know it is a number.
- [How to Trim Whitespace from a String in C++](/posts/cpp-trim-string/) — clean the input before validating.
- [C++ stringstream Explained](/posts/cpp-stringstream/) — the parsing tool used above.
- [C++ String Handling: A Complete Guide](/posts/cpp-string-handling/) — the wider std::string picture.
