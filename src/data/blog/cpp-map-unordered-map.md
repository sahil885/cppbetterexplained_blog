---
title: "C++ map vs unordered_map: Differences and When to Use Each"
description: "C++ map vs unordered_map: the performance differences, how each stores key-value pairs, and exactly when to use unordered_map vs map, with clear examples."
pubDatetime: 2026-04-19T00:00:00Z
author: "Sahil"
tags: ["C++", "STL", "map", "unordered_map", "beginner", "tutorial"]
faqSchema:
  - question: "What is the difference between map and unordered_map in C++?"
    answer: "std::map stores keys in sorted order using a red-black tree with O(log n) operations. std::unordered_map uses a hash table with O(1) average operations but no ordering. Use map when you need sorted keys or ordered iteration; use unordered_map when speed matters most."
  - question: "How do you iterate over a map in C++?"
    answer: "Use a range-based for loop: for (const auto& [key, value] : myMap) to iterate over all key-value pairs. In older C++ you can use for (const auto& pair : myMap) and access pair.first and pair.second."
  - question: "How do you check if a key exists in a C++ map?"
    answer: "Use the find() method: if (myMap.find(key) != myMap.end()) — this returns an iterator to the element if found, or end() if not. Alternatively, use count(key) which returns 1 if the key exists or 0 if not."
draft: false
featured: false
---

# C++ map vs unordered_map: Key-Value Storage Explained

**C++ map vs unordered_map in short:** `std::map` keeps keys sorted with O(log n) operations, while `std::unordered_map` uses a hash table for average O(1) lookups but no ordering.

Imagine you want to store the ages of everyone in your class. You could use a vector of pairs, but then every lookup requires scanning the whole list. What if you could just write `ages["Alice"]` and instantly get her age back? That's exactly what C++'s map containers give you.

C++ provides two key-value containers: `std::map` and `std::unordered_map`. Both let you look up a value by a key in constant or logarithmic time — but they work differently under the hood, and knowing when to use each matters.

---

## What Is a Key-Value Container?

A key-value container (also called a dictionary or associative array in other languages) stores pairs of data: a **key** and a **value**.

- **Key**: the thing you use to look something up (e.g., a name, an ID, a word)
- **Value**: the data associated with that key (e.g., an age, a score, a count)

Examples of key-value relationships:
- Word → its definition
- Student name → their grade
- Username → login count
- Item name → inventory count

---

## std::map

`std::map` is the ordered associative container. It keeps keys sorted at all times. Internally it uses a red-black tree.

### Including the header

```cpp
#include <map>
#include <iostream>
```

### Declaring a map

```cpp
std::map<KeyType, ValueType> myMap;
```

```cpp
std::map<std::string, int> ages;      // string key → int value
std::map<int, std::string> players;   // int key → string value
std::map<std::string, double> prices; // string key → double value
```

### Inserting elements

There are several ways to insert into a map:

**Using `operator[]` (most common):**

```cpp
std::map<std::string, int> ages;

ages["Alice"] = 30;
ages["Bob"] = 25;
ages["Carol"] = 28;
```

**Using `insert()` with a pair:**

```cpp
ages.insert({"Dave", 35});
ages.insert(std::make_pair("Eve", 22));
```

**Using `emplace()` (most efficient):**

```cpp
ages.emplace("Frank", 40);
```

**Important:** If you use `operator[]` with a key that doesn't exist, it creates the key with a default value (0 for int, "" for string). This is a common source of bugs — be careful.

### Looking up values

```cpp
std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;

// Direct access (only if you know the key exists)
std::cout << ages["Alice"] << "\n"; // 30

// Safe access with find()
auto it = ages.find("Bob");
if (it != ages.end()) {
    std::cout << "Bob's age: " << it->second << "\n"; // 25
} else {
    std::cout << "Bob not found.\n";
}
```

`find()` returns an iterator. If the key exists, the iterator points to the key-value pair. If not, it returns `ages.end()`. Always use `find()` when you're not sure the key exists — `operator[]` will silently insert a default value.

### Checking if a key exists: count()

```cpp
if (ages.count("Alice") > 0) {
    std::cout << "Alice is in the map.\n";
}
```

`count()` returns 1 if the key exists, 0 if not (maps don't allow duplicate keys). In C++20, you can use `contains()` instead:

```cpp
if (ages.contains("Alice")) {  // C++20
    std::cout << "Alice is in the map.\n";
}
```

### Deleting elements

```cpp
std::map<std::string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;

// Remove by key
ages.erase("Bob");

// Remove by iterator
auto it = ages.find("Alice");
if (it != ages.end()) {
    ages.erase(it);
}

// Clear the entire map
ages.clear();
```

### Iterating over a map

Because `std::map` keeps keys sorted, iterating always visits keys in ascending order:

```cpp
std::map<std::string, int> ages;
ages["Charlie"] = 32;
ages["Alice"] = 30;
ages["Bob"] = 25;

for (const auto& [name, age] : ages) {  // C++17 structured bindings
    std::cout << name << ": " << age << "\n";
}
// Output (sorted alphabetically):
// Alice: 30
// Bob: 25
// Charlie: 32
```

Without structured bindings (pre-C++17):

```cpp
for (const auto& pair : ages) {
    std::cout << pair.first << ": " << pair.second << "\n";
}
```

Each element in a map is a `std::pair<const KeyType, ValueType>`. Use `.first` for the key and `.second` for the value.

### Size and empty check

```cpp
std::map<std::string, int> ages;
ages["Alice"] = 30;

std::cout << ages.size();   // 1
std::cout << ages.empty();  // false (0)
```

---

## std::unordered_map

`std::unordered_map` is the hash-based associative container. It does not keep keys sorted. Internally it uses a hash table, which gives it average O(1) lookup and insertion — faster than `std::map`'s O(log n).

### Including the header

```cpp
#include <unordered_map>
```

### Declaring an unordered_map

```cpp
std::unordered_map<std::string, int> ages;
```

The interface is almost identical to `std::map` — all the same methods work:

```cpp
std::unordered_map<std::string, int> word_count;

// Insert
word_count["hello"] = 1;
word_count["world"] = 1;
word_count["hello"]++;  // Increment count

// Lookup
auto it = word_count.find("hello");
if (it != word_count.end()) {
    std::cout << "hello appears " << it->second << " times\n"; // 2
}

// Iteration (order is NOT guaranteed)
for (const auto& [word, count] : word_count) {
    std::cout << word << ": " << count << "\n";
}

// Delete
word_count.erase("world");
```

### A practical example: word frequency counter

```cpp
#include <iostream>
#include <unordered_map>
#include <sstream>
#include <string>

int main() {
    std::string text = "the quick brown fox jumps over the lazy dog the fox";
    std::unordered_map<std::string, int> freq;

    std::istringstream stream(text);
    std::string word;

    while (stream >> word) {
        freq[word]++;  // Creates entry with 0 if missing, then increments
    }

    for (const auto& [w, count] : freq) {
        std::cout << w << ": " << count << "\n";
    }

    return 0;
}
// Output (order varies):
// the: 3
// fox: 2
// quick: 1
// ...
```

---

## std::map vs std::unordered_map: Which to Use?

| Feature | `std::map` | `std::unordered_map` |
|---|---|---|
| Internal structure | Red-black tree | Hash table |
| Key order | Sorted ascending | No guaranteed order |
| Lookup time | O(log n) | O(1) average |
| Insertion time | O(log n) | O(1) average |
| Worst-case lookup | O(log n) | O(n) (hash collisions) |
| Memory usage | Lower | Higher (hash table overhead) |
| Key requirements | Must support `<` operator | Must support `==` and `std::hash` |
| Iteration order | Always sorted | Undefined |

**Use `std::map` when:**
- You need keys to be in sorted order (e.g., printing alphabetically, range queries)
- You need stable, predictable performance (no hash collision worst cases)
- Your keys don't have a built-in hash function

**Use `std::unordered_map` when:**
- You only need fast lookup/insertion and don't care about order
- Performance is critical and average O(1) matters
- You're counting frequencies, caching results, or doing frequent lookups

In practice, `std::unordered_map` is the better default when order doesn't matter — it's typically 3–5x faster for large datasets.

---

## Practical Examples

### Example 1: Counting votes

```cpp
#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> votes;

    // Record votes
    std::vector<std::string> ballot = {
        "Alice", "Bob", "Alice", "Carol", "Bob", "Alice"
    };

    for (const std::string& name : ballot) {
        votes[name]++;
    }

    // Find winner
    std::string winner;
    int max_votes = 0;
    for (const auto& [name, count] : votes) {
        if (count > max_votes) {
            max_votes = count;
            winner = name;
        }
    }

    std::cout << "Winner: " << winner << " with " << max_votes << " votes\n";
    // Winner: Alice with 3 votes

    return 0;
}
```

### Example 2: Phone book (sorted output)

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, std::string> phone_book;

    phone_book["Alice"] = "555-0101";
    phone_book["Bob"] = "555-0142";
    phone_book["Carol"] = "555-0189";

    // Look up a number
    std::string name = "Bob";
    auto it = phone_book.find(name);
    if (it != phone_book.end()) {
        std::cout << name << "'s number: " << it->second << "\n";
    }

    // Print all contacts (sorted by name)
    std::cout << "\n--- All Contacts ---\n";
    for (const auto& [name, number] : phone_book) {
        std::cout << name << ": " << number << "\n";
    }

    return 0;
}
// Output:
// Bob's number: 555-0142
//
// --- All Contacts ---
// Alice: 555-0101
// Bob: 555-0142
// Carol: 555-0189
```

### Example 3: Caching computed results (memoization)

```cpp
#include <iostream>
#include <unordered_map>

std::unordered_map<int, long long> memo;

long long fibonacci(int n) {
    if (n <= 1) return n;

    auto it = memo.find(n);
    if (it != memo.end()) {
        return it->second;  // Return cached result
    }

    long long result = fibonacci(n - 1) + fibonacci(n - 2);
    memo[n] = result;  // Cache the result
    return result;
}

int main() {
    std::cout << fibonacci(40) << "\n";  // 102334155 — very fast with caching
    return 0;
}
```

---

## Common Mistakes

### Mistake 1: Using `operator[]` to check existence

```cpp
std::map<std::string, int> ages;
ages["Alice"] = 30;

// WRONG: Creates "Bob" with value 0 if it doesn't exist!
if (ages["Bob"] == 0) {
    std::cout << "Bob not found\n";  // Always runs, even if Bob was 0
}

// CORRECT: Use find() or count()
if (ages.find("Bob") == ages.end()) {
    std::cout << "Bob not found\n";
}
```

### Mistake 2: Iterating while erasing

```cpp
std::map<std::string, int> ages;
// ...

// WRONG: Erasing in a range-for loop is undefined behavior
for (const auto& [name, age] : ages) {
    if (age < 18) {
        ages.erase(name);  // Invalidates iterator!
    }
}

// CORRECT: Use the iterator-erase idiom
for (auto it = ages.begin(); it != ages.end(); ) {
    if (it->second < 18) {
        it = ages.erase(it);  // erase() returns the next valid iterator
    } else {
        ++it;
    }
}
```

### Mistake 3: Expecting order from unordered_map

```cpp
std::unordered_map<int, std::string> m;
m[3] = "three";
m[1] = "one";
m[2] = "two";

// DON'T assume this prints 1, 2, 3
for (const auto& [k, v] : m) {
    std::cout << k << ": " << v << "\n";
}
// Order is implementation-defined — could be anything

// If you need sorted output, use std::map instead
```

---

## Quick Reference

| Task | `std::map` | `std::unordered_map` |
|---|---|---|
| Insert | `m[key] = val;` or `m.emplace(key, val)` | Same |
| Lookup | `m.find(key)` | Same |
| Check exists | `m.count(key)` or `m.contains(key)` | Same |
| Delete | `m.erase(key)` | Same |
| Iterate | `for (auto& [k,v] : m)` — sorted | Same — unsorted |
| Size | `m.size()` | Same |
| Clear | `m.clear()` | Same |

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

`std::map` and `std::unordered_map` both store key-value pairs. `std::map` keeps keys sorted and has O(log n) operations — great when you need ordered output or range queries. `std::unordered_map` uses a hash table and has O(1) average operations — great when you only need fast lookups and don't care about order.

The interface is nearly identical for both. Use `find()` instead of `operator[]` when checking for a key, and never erase from a container while iterating with a range-based for loop.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Vector Tutorial: The Complete Guide to std::vector for Beginners](/posts/cpp-vector-tutorial/) — vectors and maps are the two most-used STL containers; master both.
- [C++ STL Containers Explained: Choosing the Right Container for Every Situation](/posts/stl-containers-cpp/) — a full comparison of all STL containers and when to use each.
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/) — iterating over maps and vectors uses the same loop patterns.
