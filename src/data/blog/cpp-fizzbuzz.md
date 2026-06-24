---
title: "FizzBuzz in C++: The Classic Beginner Problem Explained Step by Step"
description: "FizzBuzz in C++ explained for beginners: print 1 to 100 with Fizz, Buzz, and FizzBuzz using a simple for loop, the modulo operator, and clear if-else logic."
pubDatetime: 2026-06-24T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "What is the FizzBuzz problem in C++?"
    answer: "FizzBuzz asks you to print the numbers 1 to 100, but replace multiples of 3 with 'Fizz', multiples of 5 with 'Buzz', and multiples of both with 'FizzBuzz'. It is a classic exercise for practicing loops and conditionals."
  - question: "How do you check divisibility in FizzBuzz?"
    answer: "Use the modulo operator %. A number n is divisible by 3 when n % 3 == 0, and divisible by 5 when n % 5 == 0. If both are true, the number is a multiple of 15, so you print 'FizzBuzz'."
  - question: "Why does the order of the if statements matter in FizzBuzz?"
    answer: "You must check the multiple-of-both case first. If you test 3 or 5 before the combined case, the number prints 'Fizz' or 'Buzz' and never reaches 'FizzBuzz'. Order matters because only the first matching branch runs."
draft: false
featured: false
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/Qr7jt1XgDy4" title="FizzBuzz in C++ Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# FizzBuzz in C++

FizzBuzz is the most famous beginner programming exercise — and a question interviewers really do ask to check you can write a simple loop. The task sounds trivial, but it quietly tests loops, conditionals, and the modulo operator all at once. Let's build it from scratch.

---

## The Rules

Print every number from 1 to 100, with three twists:

- If a number is a multiple of **3**, print `Fizz` instead.
- If it's a multiple of **5**, print `Buzz` instead.
- If it's a multiple of **both 3 and 5**, print `FizzBuzz`.
- Otherwise, just print the number.

That's it. The whole challenge is turning those four rules into code in the right order.

---

## Step 1: Loop From 1 to 100

Before worrying about Fizz or Buzz, get a loop printing the plain numbers:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 100; ++i) {
        std::cout << i << "\n";
    }
    return 0;
}
```

This prints 1 through 100, one per line. Now we just need to replace some of those numbers with words.

---

## Step 2: Test Divisibility With Modulo

The modulo operator `%` gives the remainder after division. If the remainder is zero, the number divides evenly. So `i % 3 == 0` means "i is a multiple of 3." That single test is the heart of FizzBuzz.

The trick is the **order** of your checks. A multiple of both 3 and 5 is a multiple of 15, so you must test for 15 *first*. If you don't, `i % 3 == 0` will match first and you'll print `Fizz` when you wanted `FizzBuzz`.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Complete FizzBuzz Program

Putting the loop and the ordered checks together:

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 100; ++i) {
        if (i % 15 == 0)
            std::cout << "FizzBuzz\n";
        else if (i % 3 == 0)
            std::cout << "Fizz\n";
        else if (i % 5 == 0)
            std::cout << "Buzz\n";
        else
            std::cout << i << "\n";
    }
    return 0;
}
```

Because these are `else if` branches, only the **first** matching one runs — which is exactly why checking 15 first works. Run it and you'll see `1 2 Fizz 4 Buzz Fizz 7 ...` all the way to 100.

---

## A Cleaner Version Without Checking 15

There's an elegant alternative that avoids the "test 15 first" rule entirely. Build up a string: add `Fizz` for a multiple of 3, add `Buzz` for a multiple of 5, and if nothing was added, use the number itself.

```cpp
#include <iostream>
#include <string>

int main() {
    for (int i = 1; i <= 100; ++i) {
        std::string output;
        if (i % 3 == 0) output += "Fizz";
        if (i % 5 == 0) output += "Buzz";
        if (output.empty()) output = std::to_string(i);
        std::cout << output << "\n";
    }
    return 0;
}
```

For a multiple of 15, *both* `if` checks fire, so `output` becomes `"FizzBuzz"` automatically. This version is easy to extend — add a `Bazz` rule for multiples of 7 and you don't have to rethink any combined cases.

---

## Common Mistakes

The number-one bug is **checking 3 or 5 before 15** — you'll never see `FizzBuzz`. The second is using `=` (assignment) instead of `==` (comparison) inside the `if`. And remember `%` only works on integers; it's perfect here since every value is a whole number.

---

## Related Articles

- [C++ Modulo Operator](/posts/cpp-modulo-operator/) — the `%` operator that powers FizzBuzz
- [C++ Conditionals Tutorial](/posts/cpp-conditionals-tutorial/) — if, else if, and else explained
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for and while loops in depth
- [C++ Even or Odd Program](/posts/cpp-even-odd-program/) — another modulo classic
- [C++ Ternary Operator](/posts/cpp-ternary-operator/) — tidy up small conditionals

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-p