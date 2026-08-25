---
title: "Menu Driven Program in C++: Build a Clean Interactive Menu"
description: "Learn to write a menu driven program in C++ with a do-while loop and a switch. Includes full working code plus how to handle invalid user input safely."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "programs", "loops", "tutorial"]
faqSchema:
  - question: "What is a menu driven program in C++?"
    answer: "A menu driven program prints a list of numbered options, reads the user's choice, runs the matching action, and then shows the menu again. It is built from a do-while loop that repeats until the user picks the exit option, with a switch statement inside that dispatches to the right function."
  - question: "Why use do-while instead of while for a menu?"
    answer: "A do-while loop runs its body once before checking the condition, which is exactly what a menu needs since you always want to show the options at least one time. A regular while loop would force you to duplicate the menu code or set up a dummy starting value."
  - question: "How do I stop my C++ menu from looping infinitely on bad input?"
    answer: "If the user types letters where cin expects a number, cin enters a fail state and stops reading, so the loop spins forever. Fix it by calling cin.clear() to reset the error flag and cin.ignore() to throw away the bad characters still sitting in the input buffer."
draft: false
featured: false
---

# Menu Driven Program in C++: Build a Clean Interactive Menu

Almost every beginner assignment eventually asks for one: show a list of options, let the user pick, do the thing, ask again. It sounds trivial, and the happy path is — but the version most tutorials show breaks the moment someone types a letter instead of a number.

Here is how to build one properly.

---

## The Structure: do-while Plus switch

Every menu program has the same skeleton:

```
do {
    print the menu
    read the choice
    switch on the choice
} while the user has not chosen to exit
```

The [do-while loop](/posts/cpp-do-while-loop/) is the right choice here, not a plain `while`. A `do-while` runs its body **before** testing the condition, which matches what a menu needs: you always want to display the options at least once. With a `while` loop you would have to either print the menu twice or invent a fake starting value just to get in.

Inside, a [switch statement](/posts/cpp-switch-statement/) reads better than a chain of `if / else if` because every branch tests the same variable against a constant.

---

## A Basic Working Menu

```cpp
#include <iostream>

int main() {
    int choice;

    do {
        std::cout << "\n===== Calculator Menu =====\n";
        std::cout << "1. Add\n";
        std::cout << "2. Subtract\n";
        std::cout << "3. Multiply\n";
        std::cout << "4. Exit\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        double a, b;

        switch (choice) {
            case 1:
                std::cout << "Enter two numbers: ";
                std::cin >> a >> b;
                std::cout << "Result: " << a + b << "\n";
                break;
            case 2:
                std::cout << "Enter two numbers: ";
                std::cin >> a >> b;
                std::cout << "Result: " << a - b << "\n";
                break;
            case 3:
                std::cout << "Enter two numbers: ";
                std::cin >> a >> b;
                std::cout << "Result: " << a * b << "\n";
                break;
            case 4:
                std::cout << "Goodbye!\n";
                break;
            default:
                std::cout << "Invalid choice, try again.\n";
        }
    } while (choice != 4);

    return 0;
}
```

This works, and it is a fine first version. Two things about it are worth noticing before we improve it.

The `break` at the end of each case is not optional. Leave it out and C++ **falls through** into the next case, so choosing "Add" would also run subtract and multiply. That is the single most common bug in menu code.

The `default` case catches every number that is not on the menu. Without it, typing `9` would silently do nothing and just redraw the menu, which looks broken to the user.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Infinite Loop Bug (and the Fix)

Run the program above and type `abc` at the menu prompt. It will spew "Invalid choice" forever and you will have to kill it.

Here is why. `std::cin >> choice` expects digits. When it finds `a`, it fails, sets an internal **fail flag**, and — critically — **leaves `abc` sitting in the input buffer**. On the next loop iteration `cin` is still in its failed state, so it refuses to read anything at all, `choice` keeps its old value, and the same bad characters are still waiting. Nothing ever changes.

The fix is two calls:

```cpp
if (std::cin.fail()) {
    std::cin.clear();                                            // reset the error flag
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');  // discard the bad input
    std::cout << "Please enter a number.\n";
    continue;
}
```

`clear()` resets the flag so `cin` will read again. `ignore()` throws away everything up to and including the next newline, removing the offending characters. You need `#include <limits>` for `numeric_limits`. There is a fuller treatment of this in [cin.ignore and clearing the buffer](/posts/cpp-cin-ignore-clear-buffer/).

---

## The Complete, Robust Version

Real menu code also pulls each action into its own [function](/posts/cpp-functions-tutorial/). Once the menu has six options, a switch with six inline bodies becomes unreadable — and functions let you test each action separately.

```cpp
#include <iostream>
#include <limits>
#include <vector>
#include <string>

std::vector<std::string> tasks;

void showMenu() {
    std::cout << "\n===== Task Manager =====\n";
    std::cout << "1. Add a task\n";
    std::cout << "2. List all tasks\n";
    std::cout << "3. Remove a task\n";
    std::cout << "4. Exit\n";
    std::cout << "Enter your choice: ";
}

void addTask() {
    std::cout << "Task description: ";
    std::cin.ignore();                 // drop the newline left by >>
    std::string task;
    std::getline(std::cin, task);
    tasks.push_back(task);
    std::cout << "Added.\n";
}

void listTasks() {
    if (tasks.empty()) {
        std::cout << "No tasks yet.\n";
        return;
    }
    for (size_t i = 0; i < tasks.size(); i++)
        std::cout << i + 1 << ". " << tasks[i] << "\n";
}

void removeTask() {
    if (tasks.empty()) {
        std::cout << "Nothing to remove.\n";
        return;
    }
    listTasks();
    std::cout << "Which number? ";
    size_t n;
    std::cin >> n;

    if (n >= 1 && n <= tasks.size()) {
        tasks.erase(tasks.begin() + (n - 1));
        std::cout << "Removed.\n";
    } else {
        std::cout << "No task with that number.\n";
    }
}

int main() {
    int choice = 0;

    do {
        showMenu();

        if (!(std::cin >> choice)) {
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "Please enter a number between 1 and 4.\n";
            continue;
        }

        switch (choice) {
            case 1: addTask();    break;
            case 2: listTasks();  break;
            case 3: removeTask(); break;
            case 4: std::cout << "Goodbye!\n"; break;
            default: std::cout << "Invalid choice, try again.\n";
        }
    } while (choice != 4);

    return 0;
}
```

Sample run:

```
===== Task Manager =====
1. Add a task
2. List all tasks
3. Remove a task
4. Exit
Enter your choice: 1
Task description: Buy milk
Added.
```

A few deliberate choices in this version:

- **`if (!(std::cin >> choice))`** — the stream converts to `false` when the read fails, so this is a shorter way to write `cin.fail()`. The `continue` jumps straight back to redrawing the menu.
- **`std::cin.ignore()` before `getline`** — after `cin >> choice` reads the digit, the Enter key is still in the buffer. Without the `ignore`, `getline` would immediately grab that empty newline and store a blank task.
- **`n >= 1 && n <= tasks.size()`** — never trust an index from the user. `tasks.erase(tasks.begin() + n - 1)` with `n` out of range is undefined behaviour, not an error message.

---

## Where to Take It Next

The switch-plus-functions pattern scales well up to about eight options. Beyond that, look at storing the actions in a `std::map<int, void(*)()>` of [function pointers](/posts/cpp-function-pointers/), which lets you add an option by adding one map entry instead of editing the switch. That is also how you would let the menu be built at runtime rather than hard-coded.

---

## Related Articles

- [C++ switch Statement Explained](/posts/cpp-switch-statement/)
- [do-while Loop in C++](/posts/cpp-do-while-loop/)
- [cin.ignore and Clearing the Input Buffer](/posts/cpp-cin-ignore-clear-buffer/)
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/)
- [Calculator Program in C++](/posts/cpp-calculator-program/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
