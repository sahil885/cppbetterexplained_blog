---
title: "C++ Sort Vector of Structs: By Field with std::sort"
description: "Learn how to sort a vector of structs in C++ using std::sort with a lambda comparator. Sort by any field, ascending or descending, and by multiple keys."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "vector", "STL"]
faqSchema:
  - question: "How do you sort a vector of structs in C++?"
    answer: "Call std::sort with a lambda comparator that compares the field you want: std::sort(v.begin(), v.end(), [](const T& a, const T& b){ return a.field < b.field; }). The lambda returns true when a should come before b."
  - question: "How do you sort a vector of structs by multiple fields?"
    answer: "In the comparator, compare the primary field first; if those are equal, compare the secondary field. Using std::tie(a.x, a.y) < std::tie(b.x, b.y) does this cleanly for several fields at once."
  - question: "How do you sort structs in descending order in C++?"
    answer: "Flip the comparison in your lambda: return a.field > b.field instead of <. The greater-than makes larger values come first, giving descending order."
draft: false
featured: false
---

# C++ Sort Vector of Structs: By Field with std::sort

**To sort a vector of structs in C++, pass `std::sort` a lambda that compares the field you care about:** `std::sort(v.begin(), v.end(), [](const auto& a, const auto& b){ return a.field < b.field; })`. The lambda tells `sort` which element should come first.

---

## The Setup

Say we have a struct for people and a vector of them:

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Person {
    std::string name;
    int age;
};

int main() {
    std::vector<Person> people = {
        {"Alice", 30}, {"Bob", 25}, {"Carol", 35}
    };
    // sorting comes next
    return 0;
}
```

By default `std::sort` has no idea how to order a `Person` — there's no built-in rule for "less than" on a struct. We supply that rule with a comparator.

---

## Sort by a Single Field

A lambda comparator takes two elements and returns `true` if the first should come before the second:

```cpp
std::sort(people.begin(), people.end(),
    [](const Person& a, const Person& b) {
        return a.age < b.age;   // youngest first
    });

for (const Person& p : people)
    std::cout << p.name << " (" << p.age << ")\n";
// Bob (25), Alice (30), Carol (35)
```

Reading `a.age < b.age` as "a comes before b when a is younger" makes ascending order. To sort by name instead, just compare `a.name < b.name` — `std::string` already knows alphabetical order.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Descending Order

To reverse the order, flip the comparison operator:

```cpp
std::sort(people.begin(), people.end(),
    [](const Person& a, const Person& b) {
        return a.age > b.age;   // oldest first
    });
```

Using `>` instead of `<` puts larger values first. That single character is the only difference between ascending and descending.

---

## Sort by Multiple Fields

To sort by age, then break ties by name, compare the second field only when the first is equal. The clean way is `std::tie`, which compares fields in order:

```cpp
#include <tuple>

std::sort(people.begin(), people.end(),
    [](const Person& a, const Person& b) {
        return std::tie(a.age, a.name) < std::tie(b.age, b.name);
    });
```

`std::tie` groups the fields into a tuple, and tuples compare left to right: first by age, and only if ages match, by name. This scales to as many fields as you like without nested `if` statements.

---

## Tip: Define operator< for a Natural Order

If a struct has one obvious default ordering, define `operator<` on it. Then plain `std::sort(v.begin(), v.end())` works with no comparator:

```cpp
struct Person {
    std::string name;
    int age;
    bool operator<(const Person& other) const {
        return age < other.age;
    }
};
```

This is handy when you'll sort the same way repeatedly, but a lambda is more flexible when you sort by different fields in different places.

---

## Related Articles

- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — std::sort in full detail
- [C++ Structs Explained](/posts/cpp-structs-explained/) — defining and using structs
- [C++ Lambda Functions](/posts/cpp-lambda-functions/) — the comparator syntax
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the container being sorted
- [C++ Struct vs Class](/posts/cpp-struct-vs-class/) — when to use each

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
