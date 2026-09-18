---
title: "How to Sort a Map by Value in C++"
description: "A std::map always sorts by key, never by value. Here is the standard way to sort map entries by value in C++ using a vector of pairs, plus ties and top-N."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "STL", "map", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "Can you sort a std::map by value in C++?"
    answer: "Not in place. A std::map is always ordered by key, and that ordering is what makes lookups fast. To get entries ordered by value you copy them into a std::vector of pairs and sort that vector."
  - question: "How do you sort a map by value in C++?"
    answer: "Copy the map into a std::vector of pairs holding the key and value, using the vector's iterator constructor, then call std::sort with a comparator that compares the .second members."
  - question: "How do you sort a map by value in descending order?"
    answer: "Use a comparator that returns a.second > b.second instead of <. Everything else stays the same, since the sort happens on the copied vector rather than the map."
  - question: "Can you use a multimap to sort by value instead?"
    answer: "Yes. Insert each entry into a std::multimap keyed by the value with the value as the key, and it will be ordered by value automatically. A multimap allows duplicate keys, so tied values are kept."
---

# How to Sort a Map by Value in C++

**Short answer:** you can't sort a `std::map` by value. Copy it into a `std::vector` of pairs and sort that.

```cpp
std::vector<std::pair<std::string, int>> v(m.begin(), m.end());
std::sort(v.begin(), v.end(),
          [](const auto& a, const auto& b) { return a.second < b.second; });
```

---

## Why a Map Can't Be Sorted by Value

A `std::map` keeps its entries in order **by key**, permanently. That ordering is not a display choice — it's the structure that makes `find()` logarithmic instead of linear. If entries could be reshuffled by value, key lookup would break.

So "sorting a map by value" always means producing a *separate* sequence that is ordered by value. The map itself stays as it is.

## The Standard Approach

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::map<std::string, int> scores = {
        {"Ana", 88}, {"Ben", 95}, {"Cara", 72}, {"Dan", 95}
    };

    // 1. Copy into a vector of pairs
    std::vector<std::pair<std::string, int>> v(scores.begin(), scores.end());

    // 2. Sort by the second member
    std::sort(v.begin(), v.end(),
              [](const auto& a, const auto& b) { return a.second < b.second; });

    // 3. Read it back
    for (const auto& [name, score] : v) {
        std::cout << name << ": " << score << '\n';
    }
}
```

Output:

```
Cara: 72
Ana: 88
Ben: 95
Dan: 95
```

Three steps, and the middle one is the only part that changes between problems. The vector's range constructor does the copying, because `std::map`'s iterators yield `std::pair<const Key, Value>` — which converts cleanly to `std::pair<Key, Value>`.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers the STL, containers and algorithms in plain English — 87 pages, just $19.</div>

## Descending Order

Flip the comparison:

```cpp
std::sort(v.begin(), v.end(),
          [](const auto& a, const auto& b) { return a.second > b.second; });
```

That is almost always what you want for leaderboards, word counts and frequency tables — highest first.

## Breaking Ties Sensibly

Above, Ben and Dan both scored 95 and their order is arbitrary. `std::sort` is not stable, so it can put either first. To make the result predictable, compare the key as a tiebreaker:

```cpp
std::sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
    if (a.second != b.second) return a.second > b.second;   // score, high to low
    return a.first < b.first;                               // then name, A to Z
});
```

Now equal scores always come out alphabetically. This two-level comparator is worth learning as a pattern — it's the same shape used for [sorting a vector of structs](/posts/cpp-sort-vector-of-structs/).

The shorter version with `std::tie`:

```cpp
#include <tuple>

std::sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
    return std::tie(b.second, a.first) < std::tie(a.second, b.first);
});
```

Readable once you've seen it, cryptic the first time. The explicit `if` version is usually the better choice in real code.

## Getting Just the Top N

Sorting the whole thing to read three entries is wasteful. Use `std::partial_sort`:

```cpp
const int N = 3;
std::partial_sort(v.begin(), v.begin() + N, v.end(),
                  [](const auto& a, const auto& b) { return a.second > b.second; });

for (int i = 0; i < N; ++i) {
    std::cout << v[i].first << ": " << v[i].second << '\n';
}
```

Only the first `N` elements end up in order; the rest are left unspecified. On a large map that's a real saving.

Guard the size first, or `v.begin() + N` runs past the end:

```cpp
int n = std::min<int>(N, v.size());
```

## The Multimap Alternative

If you want the value-ordered view to stay in sync, flip the pair into a `std::multimap` keyed by value:

```cpp
#include <map>

std::multimap<int, std::string> byScore;
for (const auto& [name, score] : scores) {
    byScore.emplace(score, name);
}

for (const auto& [score, name] : byScore) {
    std::cout << name << ": " << score << '\n';   // ascending by score
}
```

`multimap` rather than `map`, because two people can share a score and a `std::map` would silently drop one of them.

For descending order, give it a reversed comparator:

```cpp
std::multimap<int, std::string, std::greater<int>> byScore;
```

**Vector or multimap?** Use the vector when you sort once and read the result. Use the multimap when entries keep arriving and you want the order maintained as they do — insertion is logarithmic, versus re-sorting the whole vector each time.

## A Word Frequency Example

The classic use case — count words, then show the most common:

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::string text = "the quick brown fox jumps over the lazy dog the end";

    std::map<std::string, int> freq;
    std::istringstream ss(text);
    std::string word;
    while (ss >> word) {
        ++freq[word];
    }

    std::vector<std::pair<std::string, int>> v(freq.begin(), freq.end());
    std::sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });

    for (const auto& [w, count] : v) {
        std::cout << w << ": " << count << '\n';
    }
}
```

Note `++freq[word]` — accessing a missing key in a `std::map` default-constructs the value, which for `int` is `0`, so the first `++` makes it `1`. Convenient here, but a trap elsewhere: it silently inserts. See [map and unordered_map](/posts/cpp-map-unordered-map/) for when to use `find()` instead.

## Quick Reference

| Goal | Approach |
|---|---|
| Sort by value, once | copy to `vector<pair>` + `std::sort` |
| Descending | comparator uses `>` |
| Predictable ties | compare key as a second criterion |
| Top N only | `std::partial_sort` |
| Keep it ordered as entries arrive | `std::multimap<Value, Key>` |
| Sort by key | already done — `std::map` does it for you |

---

## Take Your C++ Further

If you want the STL explained properly rather than pieced together from Stack Overflow answers, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ Vector of Pairs](/posts/cpp-vector-of-pairs/) — the container this technique relies on.
- [C++ map and unordered_map Tutorial](/posts/cpp-map-unordered-map/) — the container itself.
- [How to Sort a Vector of Structs in C++](/posts/cpp-sort-vector-of-structs/) — the same comparator pattern.
- [C++ std::pair Explained](/posts/cpp-pair-tutorial/) — what `.first` and `.second` actually are.
- [C++ sort() Explained](/posts/cpp-sort-algorithm/) — comparators in depth.
