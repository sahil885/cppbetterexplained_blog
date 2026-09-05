---
title: "How to Remove Duplicates From a Vector in C++ (3 Working Methods)"
description: "Learn three ways to remove duplicate elements from a vector in C++: sort with unique and erase, a set, and an unordered_set that preserves original order."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "vector", "stl", "tutorial"]
faqSchema:
  - question: "How do you remove duplicates from a vector in C++?"
    answer: "The standard approach is the erase-remove idiom for duplicates: call std::sort on the vector, then std::unique to shuffle duplicates to the end, then vector::erase to actually delete them. It takes one line once you know the pattern."
  - question: "Why does std::unique not actually delete the duplicates?"
    answer: "std::unique is an algorithm that only knows about iterators, not about the container, so it cannot change the vector's size. It moves the unique values to the front and returns an iterator to the new logical end. You must call erase yourself to shrink the vector."
  - question: "How do I remove duplicates without sorting the vector?"
    answer: "Loop through the vector and keep an unordered_set of values you have already seen. Copy each element into a result vector only the first time you encounter it. This preserves the original order and runs in roughly O(n) time."
draft: false
featured: false
---

# How to Remove Duplicates From a Vector in C++

You have `{3, 1, 4, 1, 5, 9, 2, 6, 5, 3}` and you want `{1, 2, 3, 4, 5, 6, 9}` — or maybe `{3, 1, 4, 5, 9, 2, 6}` with the original order intact. C++ gives you a one-liner for the first case and a short loop for the second.

The confusing part is that the function named `unique` doesn't remove anything. Let's fix that misunderstanding first.

---

## Method 1: sort + unique + erase (The Standard Way)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};

    std::sort(nums.begin(), nums.end());
    nums.erase(std::unique(nums.begin(), nums.end()), nums.end());

    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";           // 1 2 3 4 5 6 9

    return 0;
}
```

Three things happen, and it's worth pulling them apart because that middle line trips up nearly everyone.

**Step 1 — `std::sort`.** After sorting, the vector is `{1, 1, 2, 3, 3, 4, 5, 5, 6, 9}`. Every duplicate is now sitting next to its twin. This matters because `std::unique` only compares *adjacent* elements — it has no memory of what it saw earlier.

**Step 2 — `std::unique`.** It walks the range and overwrites duplicates by moving later unique values forward. The vector becomes:

```
{1, 2, 3, 4, 5, 6, 9, ?, ?, ?}
                     ^
                     returned iterator
```

The `?` slots still exist and still hold *something* (unspecified values), and `nums.size()` is still 10. `unique` returns an iterator to the first junk element.

**Why can't it just delete them?** Because algorithms in `<algorithm>` only receive iterators. An iterator has no idea which container it belongs to, so it has no way to call `resize()`. This is the same reason [std::remove doesn't remove](/posts/cpp-remove-from-vector/).

**Step 3 — `erase`.** `nums.erase(first_junk, nums.end())` chops off the tail, and now `size()` is 7.

---

## Sorting Custom Types

The same pattern works for your own structs — you just have to tell C++ what "less than" and "equal" mean:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Student {
    std::string name;
    int id;
};

int main() {
    std::vector<Student> students = {
        {"Ana", 3}, {"Ben", 1}, {"Ana", 3}, {"Cara", 2}, {"Ben", 1}
    };

    std::sort(students.begin(), students.end(),
              [](const Student& a, const Student& b) {
                  return a.id < b.id;
              });

    auto last = std::unique(students.begin(), students.end(),
                            [](const Student& a, const Student& b) {
                                return a.id == b.id;
                            });
    students.erase(last, students.end());

    for (const Student& s : students) {
        std::cout << s.id << ": " << s.name << "\n";
    }
    return 0;
}
```

Note the two different comparators: `sort` needs a **less-than**, `unique` needs an **equality**. Passing `<` to `unique` is a common bug that silently produces wrong results. If [lambdas](/posts/cpp-lambda-functions/) are unfamiliar, they're just inline functions written where you need them.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 2: Dump It Through a set

A [std::set](/posts/cpp-set-tutorial/) refuses to store duplicates by definition, so it can do the work for you:

```cpp
#include <iostream>
#include <vector>
#include <set>

int main() {
    std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};

    std::set<int> unique_values(nums.begin(), nums.end());
    nums.assign(unique_values.begin(), unique_values.end());

    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";           // 1 2 3 4 5 6 9

    return 0;
}
```

Shorter to read, but slower in practice: a `std::set` is a balanced binary tree, so building it means a heap allocation per element and a lot of pointer chasing. Method 1 is usually two to five times faster on real data. Reach for this version when clarity matters more than speed, or when you needed a set anyway.

---

## Method 3: Remove Duplicates *and* Keep the Original Order

Both methods above sort your data as a side effect. If the order matters — a list of visitors in arrival order, say — you need a different approach:

```cpp
#include <iostream>
#include <vector>
#include <unordered_set>

std::vector<int> removeDuplicatesKeepOrder(const std::vector<int>& input) {
    std::unordered_set<int> seen;
    std::vector<int> result;
    result.reserve(input.size());

    for (int value : input) {
        // insert returns {iterator, bool}; the bool is false if already present
        if (seen.insert(value).second) {
            result.push_back(value);
        }
    }
    return result;
}

int main() {
    std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
    std::vector<int> cleaned = removeDuplicatesKeepOrder(nums);

    for (int n : cleaned) std::cout << n << " ";
    std::cout << "\n";           // 3 1 4 5 9 2 6

    return 0;
}
```

`seen.insert(value)` returns a `std::pair`. Its `.second` is `true` when the value was genuinely new and `false` when it was already there — so the `if` doubles as both the check and the insert, with no second lookup. That's a neat trick worth remembering.

The `reserve` call isn't decoration either: it allocates once up front instead of letting the vector grow repeatedly. See [reserve vs resize](/posts/cpp-vector-reserve-vs-resize/) for the difference.

---

## Which Method Should You Use?

| Your situation | Use |
|---|---|
| Order doesn't matter, want fastest | sort + unique + erase |
| You already have a sorted vector | just unique + erase (skip the sort) |
| Order must be preserved | unordered_set loop |
| You want a set as the end result anyway | build the set directly |

One last reminder: if your vector is already sorted, **skip the sort**. Calling `std::sort` on sorted data still costs O(n log n) for nothing.

---

## Related Articles

- [How to Remove an Element From a Vector in C++](/posts/cpp-remove-from-vector/)
- [C++ vector Tutorial for Beginners](/posts/cpp-vector-tutorial/)
- [How to Use std::sort in C++](/posts/cpp-sort-algorithm/)
- [C++ set Tutorial](/posts/cpp-set-tutorial/)
- [vector reserve vs resize](/posts/cpp-vector-reserve-vs-resize/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
