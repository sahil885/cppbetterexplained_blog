---
title: "Function Pointers in C++: A Beginner's Guide with Examples"
description: "Learn how function pointers work in C++. Store functions in variables, pass them as arguments, build a callback, and see why std::function is often simpler."
pubDatetime: 2026-07-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "pointers", "tutorial"]
faqSchema:
  - question: "What is a function pointer in C++?"
    answer: "A function pointer is a variable that stores the memory address of a function instead of the address of data. Once assigned, you can call the function through the pointer, or pass the pointer to another function so it can decide which function to run."
  - question: "How do you declare a function pointer in C++?"
    answer: "The syntax is returnType (*name)(parameterTypes). For example, int (*op)(int, int); declares a pointer named op that can hold any function taking two ints and returning an int. The parentheses around *name are required."
  - question: "Should I use function pointers or std::function?"
    answer: "Prefer std::function from the functional header in modern C++. It has readable syntax and can also hold lambdas and function objects that capture state, which raw function pointers cannot. Raw function pointers are still useful for C APIs and zero-overhead code."
draft: false
featured: false
---

# Function Pointers in C++: A Beginner's Guide

You already know a pointer can hold the address of a variable. Functions also live in memory at an address — so a pointer can hold that too.

This turns functions into data you can store, pass around, and swap at runtime. It's the mechanism behind callbacks, custom sort orders, and plugin systems.

---

## Declaring Your First Function Pointer

The syntax looks strange the first time. Here it is next to the function it points to:

```cpp
int add(int a, int b);        // a function
int (*op)(int, int);          // a pointer to that kind of function
```

Read it from the inside out: `op` is a pointer (`*op`), to a function taking `(int, int)`, returning `int`.

The parentheses around `*op` are **not optional**. Without them, `int *op(int, int)` declares a function that returns `int*` — a completely different thing.

Here's a full working example:

```cpp
#include <iostream>

int add(int a, int b)      { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }

int main() {
    int (*op)(int, int);   // declare

    op = add;              // assign (the & is optional)
    std::cout << "add:      " << op(10, 3) << "\n";

    op = subtract;         // point at a different function
    std::cout << "subtract: " << op(10, 3) << "\n";

    op = multiply;
    std::cout << "multiply: " << op(10, 3) << "\n";

    return 0;
}
```

Output:
```
add:      13
subtract: 7
multiply: 30
```

The same line, `op(10, 3)`, produces three different results. That's the whole point — the behaviour is chosen at runtime, not compile time.

Note that a function's name decays to its address automatically, so `op = add;` and `op = &add;` are equivalent. Likewise `op(10, 3)` and `(*op)(10, 3)` both work. Use the short forms.

---

## Passing Functions as Arguments

This is where function pointers become genuinely useful. Instead of hardcoding *what* to do, a function can accept it as a parameter:

```cpp
#include <iostream>

int add(int a, int b)      { return a + b; }
int multiply(int a, int b) { return a * b; }

// The third parameter IS a function
int applyOperation(int a, int b, int (*operation)(int, int)) {
    return operation(a, b);
}

int main() {
    std::cout << "5 + 7 = " << applyOperation(5, 7, add) << "\n";
    std::cout << "5 * 7 = " << applyOperation(5, 7, multiply) << "\n";
    return 0;
}
```

Output:
```
5 + 7 = 12
5 * 7 = 35
```

`applyOperation` doesn't know or care what the operation does. You've made the *behaviour* a parameter, the same way you'd make a number a parameter.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Real-World Example: Custom Sorting

You've probably used this without realising it. `std::sort` accepts a comparison function, which is how you control the sort order:

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

bool ascending(int a, int b)  { return a < b; }
bool descending(int a, int b) { return a > b; }

void print(const std::vector<int>& v) {
    for (int n : v) std::cout << n << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> numbers = {42, 7, 19, 3, 88, 25};

    std::sort(numbers.begin(), numbers.end(), ascending);
    std::cout << "Ascending:  "; print(numbers);

    std::sort(numbers.begin(), numbers.end(), descending);
    std::cout << "Descending: "; print(numbers);

    return 0;
}
```

Output:
```
Ascending:  3 7 19 25 42 88
Descending: 88 42 25 19 7 3
```

`std::sort` was written years before you wrote `descending`, yet it can use it. That's the flexibility function pointers buy.

---

## Making the Syntax Readable

Function pointer declarations get ugly fast, especially as parameters or return types. A type alias fixes that:

```cpp
#include <iostream>

// Without an alias — hard to read
// void registerHandler(void (*callback)(int, const char*));

using Handler = void (*)(int, const char*);   // much better

void onError(int code, const char* message) {
    std::cout << "Error " << code << ": " << message << "\n";
}

void runTask(Handler onFailure) {
    onFailure(404, "not found");
}

int main() {
    runTask(onError);
    return 0;
}
```

Output:
```
Error 404: not found
```

Modern C++ prefers `using` over `typedef` here — the alias name appears first, which is far easier to read for function types.

---

## Why `std::function` Is Usually Better

Raw function pointers have a hard limitation: **they can only point at plain functions.** They can't hold a lambda that captures variables, and they can't hold a member function directly.

`std::function` from `<functional>` handles all of it:

```cpp
#include <functional>
#include <iostream>
#include <vector>

int triple(int x) { return x * 3; }

int main() {
    std::vector<std::function<int(int)>> pipeline;

    pipeline.push_back(triple);                    // a plain function
    pipeline.push_back([](int x) { return x + 1; }); // a lambda

    int offset = 100;
    pipeline.push_back([offset](int x) { return x + offset; }); // captures!

    int value = 5;
    for (const auto& step : pipeline) {
        value = step(value);
        std::cout << "-> " << value << "\n";
    }

    return 0;
}
```

Output:
```
-> 15
-> 16
-> 116
```

That third lambda captures `offset` from the surrounding scope. A raw `int (*)(int)` cannot store it — capturing lambdas aren't convertible to function pointers, because they carry state alongside the code.

The trade-off: `std::function` may allocate memory and adds a small indirection cost. For most application code that's irrelevant. For tight loops or embedded work, raw function pointers stay useful.

---

## When to Use Each

| Use case | Best choice |
|----------|-------------|
| Calling into a C library API | Raw function pointer |
| Short inline behaviour | [Lambda](/posts/cpp-lambda-functions/) |
| Storing callbacks that may capture state | `std::function` |
| Zero-overhead, compile-time dispatch | [Template](/posts/cpp-templates-explained/) parameter |

The practical rule: if you're writing new C++ and need to store or pass behaviour, start with a lambda, and use `std::function` when you need to store it in a variable or container. Reach for raw function pointers when a C API demands one.

---

## Common Mistakes

**Forgetting the parentheses.** `int *f(int)` is a function returning a pointer. `int (*f)(int)` is a pointer to a function. Only the second is a function pointer.

**Mismatched signatures.** The pointer's parameter types and return type must match the function exactly. `int (*p)(int)` cannot hold a `double(double)` function — and unlike some conversions, the compiler will reject this outright.

**Trying to store a capturing lambda.** `int (*p)(int) = [x](int a){ return a + x; };` fails to compile. Non-capturing lambdas convert fine; capturing ones need `std::function`.

**Calling a null function pointer.** An uninitialised function pointer holds garbage. Initialise to `nullptr` and check before calling.

---

## Related Articles

- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — the fundamentals underneath all of this
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — pointers to data vs pointers to code
- [C++ Lambda Functions](/posts/cpp-lambda-functions/) — the modern replacement for most function pointers
- [typedef vs using in C++](/posts/cpp-typedef-vs-using/) — making the syntax readable
- [C++ Sort Algorithm](/posts/cpp-sort-algorithm/) — custom comparators in practice

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
