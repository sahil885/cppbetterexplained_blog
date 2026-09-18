---
title: "How to Use a Vector of Pairs in C++"
description: "Create, fill, sort and iterate a std::vector of std::pair in C++. Sort by first or second element, use structured bindings, and know when to use a map instead."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "vectors", "STL", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you declare a vector of pairs in C++?"
    answer: "Declare a std::vector whose element type is a std::pair, for example a pair of int and std::string, after including the vector and utility headers. Add elements with v.emplace_back(1, \"one\") or v.push_back({1, \"one\"})."
  - question: "How do you sort a vector of pairs by the second element?"
    answer: "Pass a comparator to std::sort: std::sort(v.begin(), v.end(), [](auto& a, auto& b){ return a.second < b.second; }). By default sort compares the first element and uses the second only to break ties."
  - question: "How do you access elements of a pair in C++?"
    answer: "Use .first and .second. Since C++17 you can also destructure with structured bindings: for (const auto& [id, name] : v), which is far more readable than repeating .first and .second."
  - question: "Should you use a vector of pairs or a map in C++?"
    answer: "Use a map when you look items up by key frequently, since lookup is logarithmic. Use a vector of pairs when you mostly iterate, need to keep insertion order, want duplicate keys, or care about memory locality and speed of iteration."
---

# How to Use a Vector of Pairs in C++

**Short answer:**

```cpp
#include <vector>
#include <utility>
#include <string>

std::vector<std::pair<int, std::string>> v;
v.emplace_back(1, "one");
v.push_back({2, "two"});

for (const auto& [num, word] : v) {          // C++17
    std::cout << num << " = " << word << '\n';
}
```

---

## Creating and Filling

```cpp
#include <iostream>
#include <vector>
#include <utility>
#include <string>

int main() {
    // initialise directly
    std::vector<std::pair<std::string, int>> scores = {
        {"Ana", 91},
        {"Bo", 78},
        {"Cy", 85}
    };

    // add more
    scores.emplace_back("Dee", 64);        // constructs in place
    scores.push_back({"Eli", 99});         // builds then moves
    scores.push_back(std::make_pair("Fi", 72));

    std::cout << scores.size();            // 6
}
```

`emplace_back` is the one to prefer — it passes the arguments straight to the pair's constructor rather than building a temporary and copying it.

## Accessing the Elements

```cpp
std::pair<std::string, int> p = scores[0];

std::cout << p.first  << '\n';    // Ana
std::cout << p.second << '\n';    // 91
```

Pairs have no `[]` or named members beyond `first` and `second` — which is exactly their weakness. `p.first` tells a reader nothing about what it holds, so for anything non-trivial a small struct is clearer:

```cpp
struct Score { std::string name; int points; };
std::vector<Score> scores;        // scores[0].name — self-documenting
```

Use pairs for genuinely anonymous two-value groupings; use structs when the fields have meaning worth naming. Sorting a vector of structs is covered in [sorting a vector of structs](/posts/cpp-sort-vector-of-structs/).

<div class="inline-cta"><strong>Want the STL explained properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers vectors, pairs and containers in plain English — 87 pages, just $19.</div>

## Iterating Cleanly with Structured Bindings

```cpp
// C++17 — readable
for (const auto& [name, points] : scores) {
    std::cout << name << ": " << points << '\n';
}

// pre-C++17 — noisier
for (const auto& p : scores) {
    std::cout << p.first << ": " << p.second << '\n';
}
```

To modify while iterating, drop the `const`:

```cpp
for (auto& [name, points] : scores) {
    points += 5;          // bonus for everyone
}
```

## Sorting

By default, `std::sort` on pairs compares `first`, then uses `second` to break ties:

```cpp
#include <algorithm>

std::sort(scores.begin(), scores.end());     // by name, A-Z
```

To sort by the second element, supply a comparator:

```cpp
// by points, lowest first
std::sort(scores.begin(), scores.end(),
          [](const auto& a, const auto& b) { return a.second < b.second; });

// by points, highest first
std::sort(scores.begin(), scores.end(),
          [](const auto& a, const auto& b) { return a.second > b.second; });
```

A common real-world need is sorting by one field descending and another ascending:

```cpp
std::sort(scores.begin(), scores.end(),
          [](const auto& a, const auto& b) {
              if (a.second != b.second) return a.second > b.second;  // points desc
              return a.first < b.first;                              // name asc
          });
```

## Searching

```cpp
// find an exact pair
auto it = std::find(scores.begin(), scores.end(),
                    std::make_pair(std::string("Bo"), 78));

// find by the first element only
auto it2 = std::find_if(scores.begin(), scores.end(),
                        [](const auto& p) { return p.first == "Bo"; });

if (it2 != scores.end()) {
    std::cout << it2->second;
}
```

Always compare the result against `end()` before dereferencing — see [finding an element in a vector](/posts/cpp-find-in-vector/).

## Vector of Pairs vs map

| | vector of pairs | std::map |
|---|---|---|
| Lookup by key | O(n) | O(log n) |
| Keeps insertion order | yes | no (sorted by key) |
| Duplicate keys | allowed | not allowed |
| Iteration speed | faster (contiguous) | slower (node-based) |
| Memory overhead | low | higher |

The rule of thumb: if you look things up by key often, use a [map](/posts/cpp-map-unordered-map/). If you mostly iterate, want duplicates, or need to preserve insertion order, a vector of pairs is both simpler and faster.

## Converting Between Them

```cpp
#include <map>

// map -> vector of pairs (to sort by value)
std::map<std::string, int> m = {{"Ana", 91}, {"Bo", 78}};
std::vector<std::pair<std::string, int>> v(m.begin(), m.end());

// vector of pairs -> map
std::map<std::string, int> m2(v.begin(), v.end());
```

Copying a map into a vector is the standard way to sort map entries by value, since a map is always ordered by key.

## Quick Reference

| Goal | Code |
|---|---|
| Declare | `std::vector<std::pair<A,B>> v;` |
| Add | `v.emplace_back(a, b);` |
| Access | `v[i].first`, `v[i].second` |
| Iterate (C++17) | `for (auto& [a, b] : v)` |
| Sort by first | `std::sort(v.begin(), v.end())` |
| Sort by second | `std::sort(..., cmp on .second)` |
| Find by first | `std::find_if(...)` |

---

## Take Your C++ Further

If you want vectors, pairs and the STL explained properly instead of looked up piecemeal, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ pair Tutorial](/posts/cpp-pair-tutorial/) — std::pair on its own.
- [C++ Vector Tutorial: A Complete Guide](/posts/cpp-vector-tutorial/) — the container reference.
- [How to Sort a Vector of Structs](/posts/cpp-sort-vector-of-structs/) — when named fields beat pairs.
- [C++ map vs unordered_map](/posts/cpp-map-unordered-map/) — the key-lookup alternative.
- [How to Find an Element in a Vector](/posts/cpp-find-in-vector/) — searching safely.
