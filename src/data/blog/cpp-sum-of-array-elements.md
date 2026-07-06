---
title: "Sum of Array Elements in C++: Loops and std::accumulate"
description: "Learn how to find the sum of array or vector elements in C++. Add up numbers with a simple loop, a range-based for loop, and std::accumulate, explained clearly."
pubDatetime: 2026-07-06T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "tutorial"]
faqSchema:
  - question: "How do you find the sum of elements in an array in C++?"
    answer: "Create a variable set to 0, then loop through the array adding each element to it. A range-based for loop like for (int v : arr) sum += v; is the clearest beginner approach."
  - question: "How do I sum a vector in C++ without writing a loop?"
    answer: "Use std::accumulate from the <numeric> header: std::accumulate(v.begin(), v.end(), 0). The third argument is the starting value, and it returns the total of every element."
  - question: "Why is my sum of doubles wrong in C++?"
    answer: "If you pass 0 (an int) as the starting value to std::accumulate on a vector of doubles, it sums using integers and drops the decimals. Use 0.0 instead so the sum stays a double."
draft: false
featured: false
---

# Sum of Array Elements in C++

Adding up the numbers in an array is one of the most common beginner tasks — and it's the perfect way to learn how loops walk through data. We'll do it three ways, from the most explicit loop to a clean one-liner.

---

## The Classic Way: A Counting Loop

The idea behind every summing technique is the same: start a total at `0`, then add each element to it one at a time. The most explicit version uses an index:

```cpp
#include <iostream>

int main() {
    int nums[] = {4, 8, 15, 16, 23, 42};
    int n = sizeof(nums) / sizeof(nums[0]);

    int sum = 0;
    for (int i = 0; i < n; ++i) {
        sum += nums[i];
    }

    std::cout << "Sum = " << sum << "\n";  // 108
    return 0;
}
```

`sum += nums[i]` is shorthand for `sum = sum + nums[i]`. After the loop visits all six values, `sum` holds their total, `108`.

---

## The Cleaner Way: A Range-Based For Loop

If you don't need the index, a range-based `for` loop reads much more naturally. It hands you each value directly:

```cpp
#include <iostream>

int main() {
    int nums[] = {4, 8, 15, 16, 23, 42};

    int sum = 0;
    for (int value : nums) {
        sum += value;
    }

    std::cout << "Sum = " << sum << "\n";  // 108
    return 0;
}
```

No `sizeof`, no counter, no chance of an off-by-one mistake. For simply visiting every element, this is the clearest choice a beginner can make.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The One-Liner: std::accumulate

The standard library already has a function for this. `std::accumulate`, from the `<numeric>` header, adds up a range for you. It works beautifully with a `std::vector`:

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> nums = {4, 8, 15, 16, 23, 42};

    int sum = std::accumulate(nums.begin(), nums.end(), 0);

    std::cout << "Sum = " << sum << "\n";  // 108
    return 0;
}
```

The first two arguments say "from the beginning to the end," and the third — `0` — is the starting total. This is efficient and expresses your intent in a single line: *sum everything*.

---

## Watch Out: Summing Doubles

There's one trap worth knowing. That starting value also sets the **type** of the running total. Pass a plain `int` `0` to a vector of `double`, and every partial sum gets squeezed back into an integer, silently losing the decimals:

```cpp
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<double> prices = {1.5, 2.25, 3.75};

    double wrong = std::accumulate(prices.begin(), prices.end(), 0);    // 6, decimals lost!
    double right = std::accumulate(prices.begin(), prices.end(), 0.0);  // 7.5, correct

    std::cout << wrong << " vs " << right << "\n";
    return 0;
}
```

The rule: match the starting value to your data. Use `0` for integers and `0.0` for doubles.

---

## Bonus: From Sum to Average

Once you have the sum, the average is one more step — but remember to avoid integer division by casting first:

```cpp
double average = static_cast<double>(sum) / n;
```

Without the cast, `sum / n` would truncate the result. (That's a common gotcha covered in the integer-division guide below.)

---

## Quick Reference

| Approach | Best for |
|----------|----------|
| index loop (`for i`) | when you also need the position |
| range-based (`for v : arr`) | clearest way to visit every element |
| `std::accumulate(b, e, 0)` | concise one-liner for integers |
| `std::accumulate(b, e, 0.0)` | summing doubles correctly |

---

## Related Articles

- [C++ Arrays Tutorial](/posts/cpp-arrays-tutorial/) — storing multiple values
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — the resizable array
- [C++ Range-Based For Loop](/posts/cpp-range-based-for-loop/) — the modern way to loop
- [Integer Division in C++](/posts/cpp-integer-division/) — why the average needs a cast
- [Find the Maximum and Minimum in C++](/posts/cpp-find-max-min/) — the sibling task to summing

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
