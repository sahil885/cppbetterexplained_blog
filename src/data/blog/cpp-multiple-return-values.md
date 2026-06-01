---
title: "How to Return Multiple Values from a C++ Function: 5 Practical Methods"
description: "C++ functions return one value by default. Learn five clean ways to return multiple values: structs, pairs, tuples, output parameters, and std::tie."
pubDatetime: 2026-06-01T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "tutorial"]
faqSchema:
  - question: "Can a C++ function return multiple values?"
    answer: "Not directly — C++ functions have a single return type. But you can effectively return multiple values using several techniques: return a struct, return a std::pair or std::tuple, use output parameters (pass variables by reference), or in C++17, use structured bindings with auto. Each approach has trade-offs in readability and verbosity."
  - question: "What is the cleanest way to return two values from a C++ function?"
    answer: "For returning two related values, std::pair is quick and built-in: return {value1, value2} and destructure with auto [a, b] = myFunction() in C++17. For more than two values or when you want named fields, a struct is clearest — it makes the code self-documenting."
  - question: "What are output parameters in C++?"
    answer: "Output parameters are function parameters passed by reference that the function writes to instead of returning. Example: void minMax(vector<int>& v, int& outMin, int& outMax). The caller passes variables by reference, and the function fills them with results. This is an older C-style pattern; prefer struct or tuple in modern C++."
draft: false
featured: false
---

# How to Return Multiple Values from a C++ Function

A C++ function can only `return` one value. But real programs constantly need functions to produce multiple results — the minimum and maximum of a list, a quotient and remainder, a status code and message.

Here are five clean ways to handle this, from simplest to most flexible.

---

## Method 1: Return a Struct (Most Readable)

Define a small struct to bundle related values together:

```cpp
#include <iostream>
using namespace std;

struct MinMax {
    int min;
    int max;
};

MinMax findMinMax(int a, int b, int c) {
    MinMax result;
    result.min = min({a, b, c});
    result.max = max({a, b, c});
    return result;
}

int main() {
    MinMax mm = findMinMax(7, 2, 9);
    cout << "Min: " << mm.min << endl;  // 2
    cout << "Max: " << mm.max << endl;  // 9
    return 0;
}
```

This is the **most readable** approach. The returned struct is self-documenting — `mm.min` and `mm.max` tell you exactly what each value means.

Use this when the returned values have a meaningful relationship and you'll use them together more than once.

---

## Method 2: Return a `std::pair` (Quick for Two Values)

For exactly two values, `std::pair` from `<utility>` is built-in and requires no extra struct definition:

```cpp
#include <iostream>
#include <utility>
using namespace std;

pair<int, int> divideWithRemainder(int a, int b) {
    return {a / b, a % b};
}

int main() {
    auto result = divideWithRemainder(17, 5);
    cout << "Quotient:  " << result.first  << endl;  // 3
    cout << "Remainder: " << result.second << endl;  // 2
    return 0;
}
```

The downside: `.first` and `.second` aren't descriptive. A struct with named fields is usually clearer unless the values are very obvious from context.

**C++17 structured bindings** make this much nicer:

```cpp
auto [quotient, remainder] = divideWithRemainder(17, 5);
cout << quotient << " remainder " << remainder << endl;
```

---

## Method 3: Return a `std::tuple` (Three or More Values)

When you need to return three or more values without defining a struct, `std::tuple` works:

```cpp
#include <iostream>
#include <tuple>
#include <string>
using namespace std;

tuple<string, int, double> getStudentInfo() {
    return {"Alice", 20, 3.8};
}

int main() {
    auto [name, age, gpa] = getStudentInfo();  // C++17 structured bindings
    cout << name << ", age " << age << ", GPA " << gpa << endl;
    return 0;
}
```

Before C++17, you'd use `get<0>()`, `get<1>()`, etc. — which is awkward. Structured bindings made tuples much more usable.

Still, if you find yourself returning four or more values regularly, a struct is probably cleaner and more maintainable.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 4: Output Parameters (Pass by Reference)

The classic C-style approach: pass variables by reference and have the function fill them in:

```cpp
#include <iostream>
#include <vector>
using namespace std;

void findMinMax(const vector<int>& nums, int& outMin, int& outMax) {
    outMin = nums[0];
    outMax = nums[0];
    for (int n : nums) {
        if (n < outMin) outMin = n;
        if (n > outMax) outMax = n;
    }
}

int main() {
    vector<int> data = {4, 8, 1, 9, 3, 7};
    int minVal, maxVal;

    findMinMax(data, minVal, maxVal);

    cout << "Min: " << minVal << endl;  // 1
    cout << "Max: " << maxVal << endl;  // 9
    return 0;
}
```

This works, but it's less idiomatic in modern C++. The caller has to declare variables beforehand, and the function signature doesn't make clear which parameters are inputs and which are outputs.

---

## Method 5: Aggregate Initialization (Clean Modern Style)

In modern C++, returning a struct is even more concise with aggregate initialization:

```cpp
#include <iostream>
#include <string>
using namespace std;

struct ParsedInput {
    bool valid;
    int value;
    string error;
};

ParsedInput parseNumber(const string& input) {
    try {
        int n = stoi(input);
        return {true, n, ""};
    } catch (...) {
        return {false, 0, "Invalid number: " + input};
    }
}

int main() {
    auto result = parseNumber("42");
    if (result.valid) {
        cout << "Got: " << result.value << endl;
    }

    auto bad = parseNumber("abc");
    if (!bad.valid) {
        cout << bad.error << endl;
    }

    return 0;
}
```

This pattern — returning a struct that includes a success/error indicator along with the result — is very common in real codebases.

---

## Quick Comparison

| Method             | Best for                              | Readability |
|--------------------|---------------------------------------|-------------|
| Struct             | 2+ related values used together       | ★★★★★       |
| `std::pair`        | Exactly two values, quick and built-in | ★★★☆☆      |
| `std::tuple`       | 3+ values without a dedicated struct  | ★★★☆☆       |
| Output parameters  | Compatibility with older C++ code     | ★★☆☆☆       |

For new code, the struct approach is almost always the clearest. `pair` is fine for simple two-value returns. Avoid output parameters unless you're working with legacy code.

---

## Related Articles

- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/)
- [C++ Pass by Value vs Pass by Reference](/posts/cpp-pass-by-value-reference/)
- [C++ Structs Explained](/posts/cpp-structs-explained/)
- [C++ std::pair Tutorial](/posts/cpp-pair-tutorial/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
