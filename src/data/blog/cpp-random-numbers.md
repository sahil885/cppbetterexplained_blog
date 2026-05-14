---
title: "C++ Random Numbers: rand() vs mt19937 (and Which to Use)"
description: "Learn how to generate random numbers in C++. Covers the old rand() approach, its problems, and the modern mt19937 random engine that you should use in new code."
pubDatetime: 2026-05-14T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "random", "tutorial"]
faqSchema:
  - question: "How do you generate a random number in C++?"
    answer: "The modern way is to use the <random> header with mt19937 and a distribution. Example: mt19937 rng(random_device{}()); uniform_int_distribution<int> dist(1, 100); int n = dist(rng); This gives a well-distributed random number between 1 and 100."
  - question: "What is wrong with rand() in C++?"
    answer: "rand() has several problems: it uses a poor algorithm with predictable patterns, its range is limited (RAND_MAX is often only 32767), seeding with time(0) is not truly random, and the common modulo trick (rand() % n) produces a biased distribution. Use mt19937 instead."
  - question: "What is mt19937 in C++?"
    answer: "mt19937 is the Mersenne Twister pseudorandom number generator, available in C++11's <random> header. It produces high-quality random numbers, has a period of 2^19937-1, and passes statistical tests that rand() fails. It is the recommended random number engine for most C++ applications."
draft: false
featured: false
---

# C++ Random Numbers: rand() vs mt19937 (and Which to Use)

Random numbers appear in games (dice rolls, spawn locations), simulations (stock price modelling, physics), algorithms (shuffling, randomised testing), and security (generating tokens). C++ has two main approaches: the old `rand()` function and the modern `<random>` library introduced in C++11.

This tutorial explains both, why `rand()` is problematic, and how to use `mt19937` properly.

---

## The Old Way: rand()

`rand()` is a C-era function that returns a pseudorandom integer between 0 and `RAND_MAX` (usually 32767 or 2147483647 depending on the platform).

```cpp
#include <iostream>
#include <cstdlib>   // rand, srand
#include <ctime>     // time
using namespace std;

int main() {
    srand(time(0));  // Seed with current time

    for (int i = 0; i < 5; i++) {
        cout << rand() << endl;
    }
    return 0;
}
```

To get a number in a specific range, the traditional approach is the modulo trick:

```cpp
int dice = (rand() % 6) + 1;  // 1 to 6
```

This looks reasonable. The problem is it's wrong in several ways.

---

## What's Wrong with rand()?

**1. Biased distribution**  
The modulo trick produces a skewed distribution when `RAND_MAX` isn't evenly divisible by your range. Some outcomes are slightly more likely than others. For six-sided dice it's barely noticeable, but for large ranges, the bias becomes significant.

**2. Poor algorithm**  
`rand()` typically uses a Linear Congruential Generator — a fast but low-quality algorithm that produces patterns. Statistical tests reveal structure in the output that shouldn't be there.

**3. Limited range**  
On some platforms, `RAND_MAX` is only 32767. If you want a random number larger than that, `rand()` alone can't give you one.

**4. Seed predictability**  
`srand(time(0))` seeds with the current second. If two instances of your program start within the same second, they produce identical sequences. That's a security problem and a testing headache.

**5. Global state**  
`rand()` uses a single global state. In multithreaded programs, multiple threads calling `rand()` concurrently causes race conditions.

For casual learning purposes, `rand()` is fine. For anything that actually matters — games, simulations, security — use the modern approach.

---

## The Modern Way: \<random\>

C++11 introduced a proper random number library in `<random>`. The design separates two concerns:

1. **The engine** — generates raw pseudorandom bits
2. **The distribution** — maps those bits to the range and shape you want

This is cleaner and more correct than the old approach.

### The mt19937 Engine

`mt19937` is the Mersenne Twister — a widely used, well-studied random number algorithm. Its period is 2^19937 - 1 (an astronomically large number), and it passes the statistical tests that `rand()` fails.

```cpp
#include <iostream>
#include <random>
using namespace std;

int main() {
    mt19937 rng(42);  // 42 is the seed

    for (int i = 0; i < 5; i++) {
        cout << rng() << endl;  // Raw random numbers
    }
    return 0;
}
```

But you usually don't want raw numbers — you want them in a specific range. That's where distributions come in.

---

## Generating Integers in a Range

```cpp
#include <iostream>
#include <random>
using namespace std;

int main() {
    mt19937 rng(random_device{}());  // True random seed

    uniform_int_distribution<int> dist(1, 6);  // Dice: 1 to 6

    for (int i = 0; i < 10; i++) {
        cout << dist(rng) << " ";
    }
    cout << endl;
    return 0;
}
```

`uniform_int_distribution<int>(1, 6)` guarantees each value from 1 to 6 is equally likely — no modulo bias.

`random_device{}()` gets a seed from the operating system's entropy source (hardware randomness, timing events). It's much better than `time(0)`.

---

## Generating Floating-Point Numbers

```cpp
#include <iostream>
#include <random>
using namespace std;

int main() {
    mt19937 rng(random_device{}());
    uniform_real_distribution<double> dist(0.0, 1.0);

    for (int i = 0; i < 5; i++) {
        cout << dist(rng) << endl;
    }
    return 0;
}
```

This gives values in [0.0, 1.0). Useful for probabilities, physics simulations, or any continuous range.

You can use any range:

```cpp
uniform_real_distribution<double> dist(-5.0, 5.0);  // -5 to 5
```

---

## Other Distributions

The `<random>` library includes more than uniform distributions:

```cpp
// Normal (Gaussian) distribution — for height, noise, etc.
normal_distribution<double> norm(0.0, 1.0);  // mean=0, std_dev=1
double val = norm(rng);

// Bernoulli — true/false with a given probability
bernoulli_distribution coin(0.5);  // 50/50 coin flip
bool result = coin(rng);

// Poisson — for event counts
poisson_distribution<int> poisson(3.0);  // average of 3 events
int events = poisson(rng);
```

Most beginners only ever need `uniform_int_distribution` and `uniform_real_distribution`, but knowing these exist is useful.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Shuffling a Vector

A very common task: randomly shuffling a collection. Use `std::shuffle` with a modern engine:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
using namespace std;

int main() {
    vector<int> deck = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    mt19937 rng(random_device{}());
    shuffle(deck.begin(), deck.end(), rng);

    for (int card : deck) cout << card << " ";
    cout << endl;
    return 0;
}
```

`std::shuffle` requires a uniform random bit generator, and `mt19937` fits the bill perfectly. The old `std::random_shuffle` (deprecated in C++17) used `rand()` — avoid it.

---

## Making a Reusable Random Helper

It's useful to set up the engine once and reuse it rather than creating a new one each time:

```cpp
#include <iostream>
#include <random>
using namespace std;

// Global engine, seeded once
mt19937& globalRng() {
    static mt19937 rng(random_device{}());
    return rng;
}

int randomInt(int min, int max) {
    uniform_int_distribution<int> dist(min, max);
    return dist(globalRng());
}

double randomDouble(double min, double max) {
    uniform_real_distribution<double> dist(min, max);
    return dist(globalRng());
}

int main() {
    for (int i = 0; i < 5; i++) {
        cout << "Dice: " << randomInt(1, 6) << endl;
    }
    return 0;
}
```

This is the pattern you'd use in a real project — encapsulate the engine and provide clean helper functions.

---

## Seeding for Reproducibility

Sometimes you want reproducible results — the same sequence every run. This is valuable for debugging and testing:

```cpp
mt19937 rng(12345);  // Fixed seed — same output every time
```

And when you need actual randomness:

```cpp
mt19937 rng(random_device{}());  // Different each run
```

Choose the right seeding strategy for your use case.

---

## Quick Comparison: rand() vs mt19937

| Feature | `rand()` | `mt19937` |
|---------|---------|-----------|
| Quality | Poor | Excellent |
| Distribution control | Manual (biased) | Built-in distributions |
| Range | 0 to RAND_MAX | Any |
| Thread safety | No | Yes (with separate engines) |
| Seeding | `srand(time(0))` | `random_device{}()` |
| Available since | C | C++11 |
| Recommended? | No | Yes |

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — understand int and double before using distributions
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — generating multiple random numbers
- [C++ STL Containers](/posts/stl-containers-cpp/) — use random numbers with vectors and other containers
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — wrapping random generation in reusable functions

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
