---
title: "C++ Functions Tutorial: How to Write and Use Functions"
description: "Learn C++ functions from scratch. Covers function declaration, parameters, return types, overloading, default arguments, and recursion with examples."
pubDatetime: 2026-04-18T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "functions", "tutorial"]
faqSchema:
  - question: "What is a function in C++?"
    answer: "A function in C++ is a named block of code that performs a specific task. Functions take zero or more parameters, optionally return a value, and can be called multiple times from anywhere in the program. They are the primary way to organise and reuse code in C++."
  - question: "What is the difference between pass by value and pass by reference in C++?"
    answer: "Pass by value copies the argument, so changes inside the function don't affect the original. Pass by reference passes the memory address, so the function can modify the original variable. Use const references for large objects you want to read but not modify."
  - question: "What is function overloading in C++?"
    answer: "Function overloading allows you to define multiple functions with the same name but different parameter types or counts. The compiler picks the correct version based on the arguments you pass. For example, you can have add(int, int) and add(double, double) coexist."
draft: false
featured: false
---

# C++ Functions Tutorial: How to Write and Use Functions

Imagine you're building a calculator program. Without functions, your code to add two numbers exists in one place. Then you need addition in three other places, so you copy-paste it. A month later, you find a bug in the addition logic and have to fix it in four places. Except you remember three and miss one, so the bug is still there.

Functions solve this problem. A function is a named, reusable block of code. You write the logic once, give it a name, and call it from anywhere. Fix it in one place, and every caller gets the fix.

That's the practical case. Functions also make code easier to read, easier to test, and easier to reason about. They're one of the most important concepts in all of programming.

This tutorial explains C++ functions from scratch.

---

## What a Function Is

A function is a block of code with:
- A **name** (so you can call it)
- A **parameter list** (input values it accepts)
- A **return type** (what type of value it gives back)
- A **body** (the code that runs when it's called)

The syntax:

```cpp
return_type function_name(parameter_list) {
    // function body
    return value;
}
```

A concrete example:

```cpp
int add(int a, int b) {
    return a + b;
}
```

- `int` — return type (this function gives back an integer)
- `add` — function name
- `int a, int b` — two parameters, both integers
- `return a + b` — the result it returns

To use (call) this function:

```cpp
int result = add(3, 4);   // result = 7
int sum = add(10, 20);    // sum = 30
```

---

## The `void` Return Type

Not every function needs to return a value. When a function performs an action without returning anything, its return type is `void`.

```cpp
void printGreeting(std::string name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}
```

Calling it:

```cpp
printGreeting("Alice");  // prints: Hello, Alice!
printGreeting("Bob");    // prints: Hello, Bob!
```

With `void` functions, you don't assign their output to anything — because there is no output. You just call them for the action they perform.

---

## A Complete Example

```cpp
#include <iostream>
#include <string>

// Function declarations (before main)
int add(int a, int b);
void printResult(int result);

int main() {
    int x = 10, y = 7;
    int sum = add(x, y);
    printResult(sum);
    return 0;
}

// Function definitions (after main)
int add(int a, int b) {
    return a + b;
}

void printResult(int result) {
    std::cout << "The result is: " << result << std::endl;
}
```

Output:
```
The result is: 17
```

Notice the two-step approach here: **declarations** before `main`, **definitions** after. This is called a **forward declaration**.

---

## Function Declarations vs. Definitions

In C++, you can split a function into two parts:

**Declaration** (also called a prototype): tells the compiler the function exists, its name, return type, and parameters — but not the code.

```cpp
int add(int a, int b);  // declaration — semicolon at the end
```

**Definition**: the actual code.

```cpp
int add(int a, int b) {  // definition — has a body
    return a + b;
}
```

Why does this matter? C++ compiles top to bottom. If `main` calls `add`, but `add` is defined below `main`, the compiler hasn't seen `add` yet when it encounters the call and will produce an error. Forward declarations solve this: you tell the compiler "I promise `add` exists — here's its signature" before you define it.

For small programs, you can just define all functions *before* `main` and skip the declarations:

```cpp
#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << add(3, 4) << std::endl;  // works fine
    return 0;
}
```

---

## Parameters: Pass by Value vs. Pass by Reference

How C++ passes data to functions is one of the most important concepts to understand, because it determines whether the function can modify the caller's variables.

### Pass by Value (the Default)

By default, C++ passes a **copy** of the variable to the function. The function works with the copy, and the original is unchanged.

```cpp
void triple(int x) {
    x = x * 3;
    std::cout << "Inside function: " << x << std::endl;
}

int main() {
    int num = 5;
    triple(num);
    std::cout << "After function: " << num << std::endl;
    return 0;
}
```

Output:
```
Inside function: 15
After function: 5
```

The original `num` is unchanged because `triple` received a copy.

### Pass by Reference

When you pass by **reference** (using `&`), the function receives the actual variable — not a copy. Modifying it inside the function modifies the original.

```cpp
void triple(int& x) {  // note the & 
    x = x * 3;
}

int main() {
    int num = 5;
    triple(num);
    std::cout << "After function: " << num << std::endl;  // prints: 15
    return 0;
}
```

Pass by reference is used when:
- You want to modify the original variable
- The variable is large (like a big struct or string) and copying it is expensive

### Pass by Const Reference

If you want to pass a large object without copying it, but you don't need to modify it, use const reference:

```cpp
void printName(const std::string& name) {
    std::cout << "Name: " << name << std::endl;
    // name = "changed";  // This would be a compile error — const prevents it
}
```

This is the idiomatic way to pass strings and other large objects to functions in C++.

---

## Return Values

A function can return exactly one value. The return type must match the declared type.

```cpp
double average(int a, int b) {
    return (double)(a + b) / 2;  // cast to double before dividing
}
```

The function exits immediately when it hits `return`. Any code after a `return` statement is unreachable:

```cpp
int max(int a, int b) {
    if (a > b) {
        return a;  // function exits here if a > b
    }
    return b;      // otherwise exits here
}
```

### Returning Multiple Values

C++ functions return one value, but you can work around this several ways:

**Using a struct:**

```cpp
struct MinMax {
    int min;
    int max;
};

MinMax findMinMax(int a, int b, int c) {
    MinMax result;
    result.min = std::min({a, b, c});
    result.max = std::max({a, b, c});
    return result;
}
```

**Using output parameters (pass by reference):**

```cpp
void divide(int a, int b, int& quotient, int& remainder) {
    quotient = a / b;
    remainder = a % b;
}

int main() {
    int q, r;
    divide(17, 5, q, r);
    std::cout << "Quotient: " << q << ", Remainder: " << r << std::endl;
    // prints: Quotient: 3, Remainder: 2
    return 0;
}
```

---

## Default Parameters

You can provide default values for parameters, making them optional when calling the function:

```cpp
void greet(std::string name, std::string greeting = "Hello") {
    std::cout << greeting << ", " << name << "!" << std::endl;
}

int main() {
    greet("Alice");           // prints: Hello, Alice!
    greet("Bob", "Hi");       // prints: Hi, Bob!
    greet("Carol", "Hey");    // prints: Hey, Carol!
    return 0;
}
```

Default parameters must come at the **end** of the parameter list:

```cpp
// Valid:
void foo(int a, int b = 10, int c = 20);

// Invalid — non-default after default:
void bar(int a = 5, int b, int c);  // Compile error
```

---

## Function Overloading

C++ allows multiple functions with the same name, as long as they have different parameter types or a different number of parameters. This is called **overloading**.

```cpp
int multiply(int a, int b) {
    return a * b;
}

double multiply(double a, double b) {
    return a * b;
}

int multiply(int a, int b, int c) {
    return a * b * c;
}

int main() {
    std::cout << multiply(3, 4) << std::endl;        // calls int version: 12
    std::cout << multiply(2.5, 3.0) << std::endl;    // calls double version: 7.5
    std::cout << multiply(2, 3, 4) << std::endl;     // calls 3-param version: 24
    return 0;
}
```

The compiler automatically picks the right version based on the arguments you pass. This makes code cleaner — instead of `multiplyInts`, `multiplyDoubles`, `multiplyThree`, you just call `multiply`.

---

## Recursion

A function can call itself. This is called **recursion** and it's useful for problems that can be broken down into smaller versions of the same problem.

The classic example is factorial (5! = 5 × 4 × 3 × 2 × 1):

```cpp
int factorial(int n) {
    if (n <= 1) {
        return 1;  // base case — stops the recursion
    }
    return n * factorial(n - 1);  // recursive case
}

int main() {
    std::cout << factorial(5) << std::endl;  // 120
    std::cout << factorial(6) << std::endl;  // 720
    return 0;
}
```

How it works:
- `factorial(5)` = 5 × `factorial(4)`
- `factorial(4)` = 4 × `factorial(3)`
- `factorial(3)` = 3 × `factorial(2)`
- `factorial(2)` = 2 × `factorial(1)`
- `factorial(1)` = 1 (base case — returns directly)

Every recursive function needs a **base case** that stops the recursion. Without it, the function calls itself forever until the program crashes with a stack overflow.

---

## Scope: Where Variables Live

Variables declared inside a function exist only within that function. This is called **local scope**.

```cpp
int calculateArea(int width, int height) {
    int area = width * height;  // 'area' is local to this function
    return area;
}

int main() {
    int result = calculateArea(5, 3);
    // std::cout << area;  // Error: 'area' doesn't exist here
    return 0;
}
```

Parameters are also local to the function. They stop existing when the function returns.

---

## Common Mistakes

**Forgetting to return a value:**

```cpp
int add(int a, int b) {
    int result = a + b;
    // Missing: return result;
}
// Calling this causes undefined behavior
```

**Mismatched types:**

```cpp
int divide(int a, int b) {
    return a / b;  // integer division! 7/2 = 3, not 3.5
}
// Fix: use double parameters or cast
double divide(double a, double b) {
    return a / b;  // 7.0/2.0 = 3.5
}
```

**Infinite recursion:**

```cpp
int badRecursion(int n) {
    return n * badRecursion(n - 1);  // no base case! runs forever
}
// Fix: add if (n <= 1) return 1;
```

**Modifying a copy when you wanted to modify the original:**

```cpp
void reset(int x) {  // pass by value
    x = 0;           // only changes the copy
}
// Fix: use void reset(int& x) — pass by reference
```

---

## A Practical Example: Student Grade Calculator

```cpp
#include <iostream>
#include <vector>
#include <numeric>

double calculateAverage(const std::vector<int>& grades) {
    if (grades.empty()) return 0.0;
    int total = std::accumulate(grades.begin(), grades.end(), 0);
    return (double)total / grades.size();
}

char getLetterGrade(double average) {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
}

void printReport(const std::string& name, const std::vector<int>& grades) {
    double avg = calculateAverage(grades);
    char letter = getLetterGrade(avg);
    std::cout << name << ": Average = " << avg
              << ", Grade = " << letter << std::endl;
}

int main() {
    std::vector<int> aliceGrades = {88, 92, 85, 90, 94};
    std::vector<int> bobGrades   = {72, 68, 75, 70, 65};

    printReport("Alice", aliceGrades);
    printReport("Bob", bobGrades);

    return 0;
}
```

Output:
```
Alice: Average = 89.8, Grade = B
Bob: Average = 70, Grade = C
```

Notice how each function does one thing. `calculateAverage` computes averages. `getLetterGrade` converts a number to a letter. `printReport` coordinates both and handles output. This separation makes each function easy to test, modify, and reuse.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

Functions are named, reusable blocks of code. In C++, every function has a return type, a name, parameters, and a body. Key concepts:

- **Pass by value** — function gets a copy; original unchanged
- **Pass by reference (`&`)** — function gets the original; can modify it
- **`void` return type** — function does something without returning a value
- **Default parameters** — make some arguments optional
- **Overloading** — same name, different parameters
- **Recursion** — a function calling itself (always needs a base case)

Write functions that do one thing clearly. Keep them short. Use descriptive names. These habits make code that's easy to read, test, and fix.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/) — variables are the inputs and outputs of functions; make sure you understand them first.
- [C++ Conditionals Tutorial: if, else, and switch Explained](/posts/cpp-conditionals-tutorial/) — conditional logic lives inside functions; learn how to branch based on inputs.
- [C++ Loops Tutorial: for, while, and do-while Explained](/posts/cpp-loops-tutorial/) — loops and functions are used together constantly; wrapping a loop in a function is a core pattern.
- [C++ Arrays Tutorial: Store and Access Multiple Values](/posts/cpp-arrays-tutorial/) — passing arrays to functions is the next important concept to learn.
