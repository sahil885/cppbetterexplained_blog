---
title: "C++ Vector Tutorial: The Complete Guide to std::vector for Beginners"
description: "Master std::vector in C++ with this complete beginner's guide. Covers declaration, initialization, common operations, iteration, memory management, and real-world examples with code."
pubDatetime: 2026-04-14T00:00:00Z
author: "Sahil"
tags: ["C++", "vector", "STL", "beginner", "arrays", "containers", "tutorial"]
draft: false
featured: false
---

# C++ Vector Tutorial: The Complete Guide to std::vector for Beginners

If you've been learning C++, you've probably heard that you should use `std::vector` instead of raw arrays. But what exactly *is* a vector, and how does it work?

By the end of this guide, you'll understand `std::vector` deeply — what it does, how to use it, when to use it, and the common mistakes to avoid. You'll also see plenty of real, runnable code examples at every step.

## What Is std::vector?

A `std::vector` is a **dynamic array** — an array that can grow and shrink at runtime.

With a regular C++ array, you must decide the size upfront:

```cpp
int scores[10]; // Fixed: can only ever hold 10 scores
```

That's a problem. What if you don't know how many scores you'll have? What if the user can add or remove items? A fixed array can't handle that.

A vector solves this:

```cpp
#include <vector>

std::vector<int> scores; // Can hold any number of scores
scores.push_back(95);    // Add one
scores.push_back(87);    // Add another
scores.push_back(100);   // And another...
```

The vector automatically handles the memory for you — allocating more space when needed, keeping everything contiguous, and cleaning up when done. That's why `std::vector` is the **most-used container in all of C++**, and usually your first choice when you need to store a collection of items.

## Setting Up: Including the Header

To use `std::vector`, include the `<vector>` header:

```cpp
#include <vector>
#include <iostream> // For std::cout

int main() {
    std::vector<int> numbers;
    return 0;
}
```

That's it. No extra setup needed.

## Declaring and Initializing a Vector

There are several ways to create a vector, depending on what you need.

### Empty vector (add elements later)

```cpp
std::vector<int> numbers;        // Empty, holds integers
std::vector<std::string> names;  // Empty, holds strings
std::vector<double> prices;      // Empty, holds doubles
```

### Initialize with values

```cpp
std::vector<int> scores = {95, 87, 100, 72, 88};
```

This creates a vector with 5 elements already inside. It's the cleanest way to initialize a vector when you know the values upfront.

### Initialize with a size and default value

```cpp
std::vector<int> zeros(5);        // 5 elements, all 0 by default
std::vector<int> fives(5, 5);    // 5 elements, all 5
std::vector<std::string> empty_names(3, "Unknown"); // 3 elements, all "Unknown"
```

### Copy from another vector

```cpp
std::vector<int> original = {1, 2, 3};
std::vector<int> copy = original; // copy has {1, 2, 3}
```

### The syntax: what does `<int>` mean?

`std::vector<int>` is a **template**. The type inside `< >` tells the vector what it holds. You can create a vector of any type:

```cpp
std::vector<int>         // integers
std::vector<double>      // floating-point numbers
std::vector<char>        // characters
std::vector<std::string> // strings
std::vector<MyClass>     // your own custom classes
```

## Adding and Removing Elements

### Adding elements to the end: push_back()

`push_back()` adds an element to the **end** of the vector. It's the most common way to build up a vector:

```cpp
std::vector<int> scores;
scores.push_back(95);
scores.push_back(87);
scores.push_back(100);
// scores is now {95, 87, 100}
```

This is an **O(1) amortized** operation — very fast. (More on what this means in the memory section below.)

### Adding with emplace_back() (modern C++)

`emplace_back()` is like `push_back()` but constructs the element in place — slightly more efficient for complex objects:

```cpp
std::vector<std::string> names;
names.emplace_back("Alice");  // Preferred for strings and complex types
names.emplace_back("Bob");
```

For simple types like `int`, `push_back` and `emplace_back` are equivalent. For custom classes or strings, prefer `emplace_back`.

### Inserting at a specific position

```cpp
std::vector<int> numbers = {10, 20, 30, 40};

// Insert 15 at position 1 (second element)
numbers.insert(numbers.begin() + 1, 15);
// numbers is now {10, 15, 20, 30, 40}
```

**Warning:** Inserting in the middle is **O(n)** — the vector must shift all elements after the insertion point. Use this sparingly on large vectors.

### Removing the last element: pop_back()

```cpp
std::vector<int> scores = {95, 87, 100};
scores.pop_back(); // Removes 100
// scores is now {95, 87}
```

`pop_back()` is **O(1)** — fast.

### Removing from a specific position: erase()

```cpp
std::vector<int> numbers = {10, 20, 30, 40};
numbers.erase(numbers.begin() + 1); // Remove element at index 1
// numbers is now {10, 30, 40}
```

Like inserting, erasing from the middle is **O(n)** because elements must shift.

### Removing all elements: clear()

```cpp
std::vector<int> scores = {95, 87, 100};
scores.clear(); // Removes all elements
// scores is now empty: {}
// scores.size() == 0
```

## Accessing Elements

### Access by index with [ ]

```cpp
std::vector<int> scores = {95, 87, 100, 72};

std::cout << scores[0]; // 95 (first element)
std::cout << scores[1]; // 87
std::cout << scores[3]; // 72 (last element)
```

This is **O(1)** — instant, regardless of vector size. Exactly like a regular array.

**Important:** `operator[]` does **not** check bounds. Accessing `scores[10]` on a 4-element vector is undefined behavior (crash or garbage). If you need safety, use `at()`.

### Safe access with at()

```cpp
std::vector<int> scores = {95, 87, 100, 72};

try {
    std::cout << scores.at(1);  // 87 — safe, checks bounds
    std::cout << scores.at(10); // Throws std::out_of_range exception
} catch (const std::out_of_range& e) {
    std::cout << "Index out of range: " << e.what() << "\n";
}
```

Use `at()` during development and debugging; use `[]` in performance-critical code once you've verified correctness.

### First and last elements: front() and back()

```cpp
std::vector<int> scores = {95, 87, 100, 72};

std::cout << scores.front(); // 95 — first element
std::cout << scores.back();  // 72 — last element
```

### Getting a raw pointer to the data: data()

Sometimes you need to pass the vector's contents to a C-style function:

```cpp
std::vector<int> numbers = {1, 2, 3, 4};
int* ptr = numbers.data(); // Raw pointer to the first element
// Now you can pass ptr to any C function expecting int*
```

## Checking Size and Capacity

### How many elements? size()

```cpp
std::vector<int> scores = {95, 87, 100};
std::cout << scores.size(); // 3
```

### Is the vector empty? empty()

```cpp
std::vector<int> scores;

if (scores.empty()) {
    std::cout << "No scores yet!\n";
}

scores.push_back(95);

if (!scores.empty()) {
    std::cout << "We have scores.\n";
}
```

Always use `empty()` instead of `size() == 0` — it's more readable and equally fast.

### Capacity vs. size

This is an important distinction many beginners miss:

- **size** = how many elements are currently stored
- **capacity** = how much memory the vector has allocated (always >= size)

```cpp
std::vector<int> v;
v.push_back(1);
v.push_back(2);
v.push_back(3);

std::cout << v.size();     // 3 — three elements stored
std::cout << v.capacity(); // Often 4 — space for 4 elements allocated
```

When you add an element that exceeds capacity, the vector automatically allocates a larger block of memory (typically doubling) and copies everything over. This is what makes `push_back` O(1) *amortized* — usually instant, occasionally slow during reallocation.

### Reserve capacity upfront: reserve()

If you know roughly how many elements you'll add, use `reserve()` to avoid repeated reallocations:

```cpp
std::vector<int> numbers;
numbers.reserve(1000); // Allocate space for 1000 elements now

for (int i = 0; i < 1000; i++) {
    numbers.push_back(i); // No reallocations — much faster
}
```

This is a significant performance optimization when adding large numbers of elements.

### Shrink to fit: shrink_to_fit()

After removing many elements, the capacity stays high. Use `shrink_to_fit()` to release unused memory:

```cpp
std::vector<int> numbers(1000, 0); // 1000 elements
numbers.clear();                    // 0 elements, but capacity still 1000
numbers.shrink_to_fit();           // Now capacity matches size (0)
```

## Iterating Through a Vector

### Range-based for loop (recommended)

The cleanest way to iterate in modern C++:

```cpp
std::vector<int> scores = {95, 87, 100, 72};

for (int score : scores) {
    std::cout << score << "\n";
}
```

To modify elements during iteration, use a reference:

```cpp
std::vector<int> scores = {95, 87, 100, 72};

for (int& score : scores) {
    score += 5; // Add 5 to each score
}
// scores is now {100, 92, 105, 77}
```

### Traditional index-based loop

Use this when you need the index:

```cpp
std::vector<int> scores = {95, 87, 100, 72};

for (int i = 0; i < scores.size(); i++) {
    std::cout << "Score " << i << ": " << scores[i] << "\n";
}
```

**Note:** Use `size_t` or cast when comparing index to `.size()` to avoid signed/unsigned warnings:

```cpp
for (size_t i = 0; i < scores.size(); i++) { ... }
```

### Iterator-based loop

Iterators are objects that point to elements, similar to pointers. They're used heavily in STL algorithms:

```cpp
std::vector<int> scores = {95, 87, 100, 72};

for (auto it = scores.begin(); it != scores.end(); ++it) {
    std::cout << *it << "\n"; // Dereference iterator to get value
}
```

`begin()` points to the first element. `end()` points one-past-the-last element. You'll use this form when working with STL algorithms.

## Sorting and Searching

The STL's `<algorithm>` header provides powerful functions that work seamlessly with vectors.

### Sorting a vector

```cpp
#include <vector>
#include <algorithm>

std::vector<int> scores = {72, 100, 87, 95, 88};
std::sort(scores.begin(), scores.end());
// scores is now {72, 87, 88, 95, 100}
```

Sort in descending order:

```cpp
std::sort(scores.begin(), scores.end(), std::greater<int>());
// scores is now {100, 95, 88, 87, 72}
```

Sort with a custom comparator (sort structs by a field):

```cpp
struct Student {
    std::string name;
    int grade;
};

std::vector<Student> students = {{"Alice", 92}, {"Bob", 85}, {"Carol", 97}};

// Sort by grade, lowest first
std::sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
    return a.grade < b.grade;
});

for (const auto& s : students) {
    std::cout << s.name << ": " << s.grade << "\n";
}
// Bob: 85
// Alice: 92
// Carol: 97
```

### Finding an element: std::find()

```cpp
#include <algorithm>

std::vector<int> scores = {95, 87, 100, 72};

auto it = std::find(scores.begin(), scores.end(), 100);

if (it != scores.end()) {
    std::cout << "Found 100 at index: " << (it - scores.begin()) << "\n";
} else {
    std::cout << "100 not found.\n";
}
```

### Counting occurrences: std::count()

```cpp
std::vector<int> rolls = {1, 6, 3, 6, 2, 6, 5};
int sixes = std::count(rolls.begin(), rolls.end(), 6);
std::cout << "Rolled a 6: " << sixes << " times\n"; // 3
```

### Binary search (on sorted vector): std::binary_search()

```cpp
std::vector<int> sorted = {10, 20, 30, 40, 50};

if (std::binary_search(sorted.begin(), sorted.end(), 30)) {
    std::cout << "30 is in the vector\n";
}
```

The vector **must be sorted first** for `binary_search` to work correctly.

## Common Patterns and Real Examples

### Example 1: Reading user input into a vector

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> scores;
    int input;

    std::cout << "Enter scores (enter -1 to stop):\n";

    while (std::cin >> input && input != -1) {
        scores.push_back(input);
    }

    std::cout << "You entered " << scores.size() << " scores.\n";

    // Calculate the average
    if (!scores.empty()) {
        int total = 0;
        for (int score : scores) {
            total += score;
        }
        double average = static_cast<double>(total) / scores.size();
        std::cout << "Average: " << average << "\n";
    }

    return 0;
}
```

### Example 2: Filtering elements into a new vector

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> all_scores = {95, 43, 87, 55, 100, 62, 72, 38};
    std::vector<int> passing;       // scores >= 60
    std::vector<int> failing;       // scores < 60

    for (int score : all_scores) {
        if (score >= 60) {
            passing.push_back(score);
        } else {
            failing.push_back(score);
        }
    }

    std::cout << "Passing scores: ";
    for (int s : passing) std::cout << s << " ";

    std::cout << "\nFailing scores: ";
    for (int s : failing) std::cout << s << " ";

    return 0;
}
// Output:
// Passing scores: 95 87 100 62 72
// Failing scores: 43 55 38
```

### Example 3: 2D vector (vector of vectors)

A vector of vectors works like a 2D grid or matrix:

```cpp
#include <vector>
#include <iostream>

int main() {
    // Create a 3x4 grid initialized to 0
    int rows = 3, cols = 4;
    std::vector<std::vector<int>> grid(rows, std::vector<int>(cols, 0));

    // Set some values
    grid[0][0] = 1;
    grid[1][2] = 7;
    grid[2][3] = 5;

    // Print the grid
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            std::cout << grid[r][c] << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
// Output:
// 1 0 0 0
// 0 0 7 0
// 0 0 0 5
```

### Example 4: Removing duplicates

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> numbers = {4, 2, 7, 2, 4, 9, 7, 1};

    // Sort first — std::unique requires sorted input
    std::sort(numbers.begin(), numbers.end());

    // std::unique moves duplicates to the end; returns iterator to first duplicate
    auto last = std::unique(numbers.begin(), numbers.end());

    // Erase the duplicates
    numbers.erase(last, numbers.end());

    for (int n : numbers) std::cout << n << " ";
    // Output: 1 2 4 7 9

    return 0;
}
```

## Vector vs. Array: When to Use Each

| Feature | std::vector | C-style array |
|---|---|---|
| Size | Dynamic (grows/shrinks) | Fixed at compile time |
| Memory management | Automatic | Manual (for heap arrays) |
| Bounds checking | Via `.at()` | None |
| Works with STL algorithms | Yes | Needs extra work |
| Pass to functions | Easy (by reference) | Decays to pointer (loses size) |
| Performance | Nearly identical | Slightly faster in some edge cases |
| Modern C++ best practice | **Yes — default choice** | Avoid unless required |

**Bottom line:** Use `std::vector` by default. Only use raw arrays when you have a specific reason (e.g., interfacing with a C library, stack-allocated fixed-size data where you're certain of the size, or performance-critical hot paths where profiling shows a difference).

## Common Mistakes to Avoid

### Mistake 1: Out-of-bounds access with [ ]

```cpp
std::vector<int> v = {1, 2, 3};
std::cout << v[5]; // Undefined behavior — no error, just garbage or crash

// Fix: use .at() to get a proper error, or check size first
if (5 < v.size()) {
    std::cout << v[5];
}
```

### Mistake 2: Modifying a vector while iterating over it

```cpp
std::vector<int> nums = {1, 2, 3, 4, 5};

// WRONG: Adding to a vector while iterating invalidates iterators
for (auto it = nums.begin(); it != nums.end(); ++it) {
    if (*it == 3) {
        nums.push_back(10); // Undefined behavior!
    }
}

// FIX: Collect indices/values first, then modify
std::vector<int> to_add;
for (int n : nums) {
    if (n == 3) to_add.push_back(10);
}
for (int n : to_add) nums.push_back(n);
```

### Mistake 3: Forgetting to reserve when building a large vector

```cpp
// SLOW: may reallocate many times
std::vector<int> nums;
for (int i = 0; i < 1000000; i++) {
    nums.push_back(i);
}

// FAST: allocate once
std::vector<int> nums;
nums.reserve(1000000);
for (int i = 0; i < 1000000; i++) {
    nums.push_back(i);
}
```

### Mistake 4: Using signed/unsigned comparison with size()

```cpp
std::vector<int> v = {1, 2, 3};

// Warning: comparing int and size_t (unsigned)
for (int i = 0; i < v.size(); i++) { ... }

// Fix: use size_t or auto
for (size_t i = 0; i < v.size(); i++) { ... }

// Or better yet, use range-based for loop
for (int x : v) { ... }
```

### Mistake 5: Calling front() or back() on an empty vector

```cpp
std::vector<int> v;
int x = v.front(); // Undefined behavior — vector is empty!

// Fix: always check first
if (!v.empty()) {
    int x = v.front();
}
```

## Quick Reference: Most Used Vector Operations

| Operation | Code | Time Complexity |
|---|---|---|
| Declare empty | `std::vector<int> v;` | O(1) |
| Declare with values | `std::vector<int> v = {1, 2, 3};` | O(n) |
| Add to end | `v.push_back(x);` | O(1) amortized |
| Remove from end | `v.pop_back();` | O(1) |
| Access by index | `v[i]` or `v.at(i)` | O(1) |
| Get size | `v.size()` | O(1) |
| Check if empty | `v.empty()` | O(1) |
| First element | `v.front()` | O(1) |
| Last element | `v.back()` | O(1) |
| Clear all | `v.clear()` | O(n) |
| Insert at position | `v.insert(v.begin() + i, x)` | O(n) |
| Remove at position | `v.erase(v.begin() + i)` | O(n) |
| Sort | `std::sort(v.begin(), v.end())` | O(n log n) |
| Find element | `std::find(v.begin(), v.end(), x)` | O(n) |
| Reserve capacity | `v.reserve(n)` | O(n) |

## Conclusion: You Now Know std::vector

`std::vector` is the workhorse of C++ programming. Once you're comfortable with it, you'll reach for it instinctively whenever you need a collection of items.

Here's what you can now do:
- Declare and initialize vectors in multiple ways
- Add and remove elements safely
- Access elements by index with and without bounds checking
- Iterate using range-based for loops, index loops, and iterators
- Sort, search, and filter with STL algorithms
- Manage memory efficiently with `reserve()`
- Recognize and avoid common mistakes

The next step is practice. Try building a small project — a grade calculator, a to-do list, or a simple card game — using `std::vector` as your primary data structure. You'll solidify your understanding fast.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **C++ Better Explained Ebook** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. It covers vectors, pointers, OOP, and the entire language with the same intuitive, beginner-first approach used in this guide.

**Just $19.** 👉 [Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)

## Related Articles
