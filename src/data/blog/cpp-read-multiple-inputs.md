---
title: "How to Read Multiple Inputs on One Line in C++"
description: "Read several values from one line in C++ with cin, getline and stringstream. Handle unknown counts, comma-separated input, and reading until the user stops."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "input", "beginner", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you read multiple values on one line in C++?"
    answer: "Chain the extraction operator: std::cin >> a >> b >> c. Whitespace including spaces, tabs and newlines separates the values, so the user can type them on one line or several."
  - question: "How do you read an unknown number of values in C++?"
    answer: "Read the whole line with getline, feed it into an istringstream, then loop with while (ss >> value) pushing each into a vector. The loop ends when the line runs out."
  - question: "How do you read comma-separated values from one line in C++?"
    answer: "Read the line with getline, then use the three-argument getline on a stringstream with a comma delimiter: while (std::getline(ss, field, ',')). That splits on commas rather than whitespace."
  - question: "Why does cin stop reading at the space?"
    answer: "The >> operator treats whitespace as a separator, so it reads one token and stops. To capture a whole line including spaces you need std::getline instead."
---

# How to Read Multiple Inputs on One Line in C++

**Short answer:** chain `>>` for a known count, or read the line and parse it with a `stringstream` when the count is unknown.

```cpp
std::cin >> a >> b >> c;                       // known count

std::string line;                              // unknown count
std::getline(std::cin, line);
std::istringstream ss(line);
int v;
while (ss >> v) values.push_back(v);
```

---

## Reading a Known Number of Values

```cpp
#include <iostream>

int main() {
    int a, b, c;
    std::cout << "Enter three numbers: ";
    std::cin >> a >> b >> c;

    std::cout << a + b + c << '\n';
}
```

Typing `1 2 3` and pressing Enter fills all three. So does typing each on its own line — `>>` skips over any whitespace, newlines included, so it cannot tell the difference. That is occasionally surprising but usually convenient.

Mixed types work the same way:

```cpp
std::string name;
int age;
double height;
std::cin >> name >> age >> height;    // "Ana 30 1.72"
```

Note `name` stops at the first space, so this cannot read "Ana Maria". For that you need `getline` — the distinction is covered in [cin vs getline](/posts/cpp-getline-vs-cin/).

## Reading an Unknown Number of Values

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::cout << "Enter numbers separated by spaces: ";
    std::string line;
    std::getline(std::cin, line);

    std::istringstream ss(line);
    std::vector<int> values;
    int v;
    while (ss >> v) {
        values.push_back(v);
    }

    std::cout << "Read " << values.size() << " values\n";
    int sum = 0;
    for (int x : values) sum += x;
    std::cout << "Sum: " << sum << '\n';
}
```

This is the pattern worth memorising. Reading the line first means the console buffer is fully consumed, and parsing happens on a string you control — so nothing is left behind to break later reads.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers input, strings and the STL in plain English — 87 pages, just $19.</div>

## Reading Comma-Separated Values

```cpp
#include <sstream>

std::string line = "12,34,56";
std::istringstream ss(line);
std::string field;
std::vector<int> values;

while (std::getline(ss, field, ',')) {
    values.push_back(std::stoi(field));
}
```

The three-argument `getline` splits on whatever delimiter you give it. If the fields might have spaces around them — `12, 34, 56` — [trim each field](/posts/cpp-trim-string/) before converting, or `stoi` will still work since it skips leading whitespace but `stod` on `"34 "` leaves the trailing space harmlessly.

This is the same technique used for [reading a CSV file](/posts/cpp-read-csv-file/), just applied to one line instead of many.

## Reading Until the User Stops

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> values;
    int v;

    std::cout << "Enter numbers (Ctrl+D / Ctrl+Z to finish):\n";
    while (std::cin >> v) {
        values.push_back(v);
    }

    std::cout << "Read " << values.size() << " values\n";
}
```

The loop ends when extraction fails — either at end of input or on non-numeric text. If you want to stop on a sentinel word instead:

```cpp
std::string token;
while (std::cin >> token && token != "done") {
    values.push_back(std::stoi(token));
}
```

## Reading a Fixed Count into a Vector

```cpp
int n;
std::cin >> n;                       // how many follow

std::vector<int> values(n);
for (int i = 0; i < n; ++i) {
    std::cin >> values[i];
}
```

This is the standard competitive-programming input format. Note `std::vector<int> values(n)` creates `n` elements up front, so indexing is safe — using `push_back` on an empty vector would also work but reserves repeatedly.

## The Leftover Newline Trap

If you mix the two styles, the newline bites:

```cpp
int n;
std::cin >> n;                       // leaves '\n' in the buffer

std::string line;
std::getline(std::cin, line);        // reads the leftover newline — empty!
```

Fix it by discarding the rest of the line first:

```cpp
#include <limits>
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
```

The full explanation is in [cin.ignore and clearing the input buffer](/posts/cpp-cin-ignore-clear-buffer/).

## Validating as You Read

```cpp
std::istringstream ss(line);
int v;
std::vector<int> values;

while (ss >> v) values.push_back(v);

if (!ss.eof()) {
    std::cout << "Warning: input contained something that is not a number\n";
}
```

After the loop, `ss.eof()` is true only if the whole line parsed cleanly. If parsing stopped early on junk, the stream is in a fail state instead. For a full retry loop, see [input validation](/posts/cpp-input-validation/).

## Quick Reference

| Situation | Approach |
|---|---|
| Known count | `cin >> a >> b >> c` |
| Unknown count, spaces | `getline` + `istringstream` + `while (ss >> v)` |
| Comma-separated | `getline(ss, field, ',')` |
| Until end of input | `while (cin >> v)` |
| Count given first | read `n`, then loop `n` times |
| Mixing `>>` and `getline` | `cin.ignore(max, '\n')` between them |

---

## Take Your C++ Further

If you want input handling and the rest of the fundamentals explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [cin vs getline: Why getline Gets Skipped](/posts/cpp-getline-vs-cin/) — the difference between the two.
- [cin.ignore() and Clearing the Input Buffer](/posts/cpp-cin-ignore-clear-buffer/) — fixing leftover newlines.
- [C++ Input Validation](/posts/cpp-input-validation/) — handling bad input safely.
- [C++ stringstream Explained](/posts/cpp-stringstream/) — the parsing workhorse.
- [How to Split a String in C++](/posts/cpp-split-string/) — splitting by any delimiter.
