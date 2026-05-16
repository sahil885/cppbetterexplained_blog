---
title: "C++ do-while Loop: How It Works and When to Use It"
description: "Learn how the C++ do-while loop works, how it differs from a while loop, and the practical cases where it's the right choice — like input validation and menu loops."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "loops", "tutorial"]
faqSchema:
  - question: "What is a do-while loop in C++?"
    answer: "A do-while loop executes its body at least once, then checks the condition. Syntax: do { statements; } while (condition); — the body runs first, then the condition is checked. If the condition is true, it loops again. This is the opposite of a while loop, which checks the condition before executing."
  - question: "When should I use a do-while loop instead of a while loop?"
    answer: "Use a do-while loop when you need the body to execute at least once before checking the condition. The most common case is input validation — you always need to ask for input at least once, then repeat if the input is invalid. A while loop would require duplicating the input code outside the loop."
  - question: "What is the difference between while and do-while in C++?"
    answer: "A while loop checks the condition before each iteration — if the condition is false initially, the body never executes. A do-while loop checks the condition after each iteration — the body always executes at least once. For input validation and menu-driven programs, do-while is usually cleaner."
draft: false
featured: false
---

# C++ do-while Loop: How It Works and When to Use It

The `do-while` loop is the third kind of loop in C++ (after `for` and `while`). It has one key difference from the others: **it always runs at least once**, because it checks the condition after executing the body.

---

## Syntax

```cpp
do {
    // body — runs at least once
} while (condition);
//         ^--- note the semicolon — required!
```

Don't forget the semicolon after the closing `while (condition)`. Forgetting it is the #1 syntax mistake with `do-while`.

---

## How It Works

```cpp
int i = 0;
do {
    cout << i << " ";
    i++;
} while (i < 5);
// Output: 0 1 2 3 4
```

Execution order:
1. Run the body: print `0`, increment to `1`
2. Check condition: `1 < 5` → true → repeat
3. Run body: print `1`, increment to `2`
4. Check condition: `2 < 5` → true → repeat
5. ...
6. Run body: print `4`, increment to `5`
7. Check condition: `5 < 5` → false → stop

The body ran 5 times.

---

## The Key Difference: Runs at Least Once

With a `while` loop, if the condition is false from the start, the body never runs:

```cpp
int x = 10;

while (x < 5) {
    cout << "This never prints" << endl;
}

do {
    cout << "This prints once" << endl;
} while (x < 5);
```

The `while` loop body never executes. The `do-while` body executes once, then checks the condition (which is false), so it stops — but it did run once.

---

## The Classic Use Case: Input Validation

The most common reason to reach for `do-while` is asking for user input. You always need to prompt at least once, then repeat if the input is invalid:

```cpp
#include <iostream>
using namespace std;

int main() {
    int age;

    do {
        cout << "Enter your age (must be positive): ";
        cin >> age;

        if (age <= 0) {
            cout << "Invalid age. Try again." << endl;
        }
    } while (age <= 0);

    cout << "Your age is: " << age << endl;
    return 0;
}
```

Sample session:
```
Enter your age (must be positive): -5
Invalid age. Try again.
Enter your age (must be positive): 0
Invalid age. Try again.
Enter your age (must be positive): 25
Your age is: 25
```

Without `do-while`, you'd need to write the prompt twice — once before the loop and once inside it. `do-while` eliminates that duplication.

---

## Menu-Driven Programs

Another great fit: programs with menus where you always show the menu at least once, then repeat until the user chooses to quit:

```cpp
#include <iostream>
using namespace std;

int main() {
    int choice;

    do {
        cout << "\n--- Menu ---\n";
        cout << "1. Say hello\n";
        cout << "2. Say goodbye\n";
        cout << "3. Quit\n";
        cout << "Choice: ";
        cin >> choice;

        switch (choice) {
            case 1: cout << "Hello!\n"; break;
            case 2: cout << "Goodbye!\n"; break;
            case 3: cout << "Exiting...\n"; break;
            default: cout << "Invalid choice.\n";
        }
    } while (choice != 3);

    return 0;
}
```

The menu always displays at least once. If the user picks 3, the loop exits. Otherwise, it loops back to show the menu again.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Comparing `while` vs `do-while`

```cpp
// while loop: checks first
int n = 0;
while (n > 0) {
    cout << n;
    n--;
}
// Nothing prints — condition was false from the start

// do-while: runs first, then checks
do {
    cout << n;
    n--;
} while (n > 0);
// Prints: 0 (ran once before checking)
```

**Rule of thumb:**
- Use `while` when you might not want to execute the body at all
- Use `do-while` when the body must execute at least once (usually for prompts and menus)

---

## Nested do-while

You can nest `do-while` inside other loops, or vice versa:

```cpp
int i = 1;
do {
    int j = 1;
    do {
        cout << i * j << "\t";
        j++;
    } while (j <= 5);
    cout << "\n";
    i++;
} while (i <= 3);
```

Output (multiplication table):
```
1  2  3  4  5
2  4  6  8  10
3  6  9  12 15
```

---

## Common Mistakes

**Forgetting the semicolon:**
```cpp
do {
    cout << "hi\n";
} while (true)   // Error: missing semicolon
```

**Infinite loop:**
```cpp
do {
    cout << "infinite\n";
} while (true);  // Runs forever — add a break or condition change
```

**Counter not updating:**
```cpp
int i = 0;
do {
    cout << i;
    // Forgot i++; — infinite loop!
} while (i < 5);
```

---

## Summary

The `do-while` loop is simple but has one important property: the body always executes at least once. Use it when you need this guarantee — especially for input validation and menu loops. For everything else, `for` and `while` are more common choices.

---

## Related Articles

- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for, while, and do-while compared in full
- [C++ User Input with cin](/posts/cpp-cin-user-input/) — reading keyboard input (pairs with do-while for validation)
- [C++ Calculator Program](/posts/cpp-calculator-program/) — a project using do-while for looping

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
