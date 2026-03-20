---
title: "How to Create a Lottery Program in C++ - Step by Step with Source Code"
description: "Learn how to create a lottery program in C++ using arrays, for loops, and random number generation. Full source code with a step by step explanation."
pubDatetime: 2024-10-02T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "arrays", "random numbers", "project", "for loop"]
draft: false
featured: true
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/cf8t7kbaSDE" title="C++ Lottery Program" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This C++ practice assignment requires us to write a lottery program that randomly generates the numbers of a lottery ticket and outputs the values. It is a great exercise for practising arrays, for loops, and random number generation in C++.

## Requirements

The specific requirements for this program are:

- Use arrays to generate **12 rows and 6 columns** — the columns generate random lottery numbers and the rows display each ticket line
- Use a **for loop** to display the numbers stored in the arrays
- Restrict random number generation to between **1 and 45**

## Concepts Covered

- Arrays in C++
- For loops
- Random number generation with `rand()` and `srand()`
- Function prototypes and implementation
- Duplicate number detection

## Full Source Code

```cpp
// Lottery ticket generator
// Author: Sahil Bora
// File: main.cpp

#include <cstdlib>
#include <iostream>
#include <ctime>
using namespace std;

// Constants
const int MIN  = 1;
const int MAX  = 45;
const int COLS = 6;
const int ROWS = 12;

// Function prototypes
void getLine(int line[]);
void printLine(int line[]);
bool duplicates(int num, int arr[], int size);

int main() {
    int row[COLS] = {0};
    srand(time(NULL));

    cout << "Your Tattslotto ticket\n\n";

    for (int i = 0; i < ROWS; i++) {
        getLine(row);
        printLine(row);
    }

    return 0;
}

// Check if a number already exists in the array
bool duplicates(int num, int arr[], int size) {
    for (int j = 0; j < size; j++) {
        if (arr[j] == num)
            return true;
    }
    return false;
}

// Generate a single lottery line with no duplicate numbers
void getLine(int line[]) {
    int rNum;
    for (int i = 0; i < COLS; i++) {
        rNum = rand() % (MAX - MIN + 1) + MIN;
        while (duplicates(rNum, line, i) == true)
            rNum = rand() % (MAX - MIN + 1) + MIN;
        line[i] = rNum;
    }
}

// Print a single lottery line
void printLine(int line[]) {
    for (int i = 0; i < COLS; i++)
        cout << "\n" << line[i];
    cout << endl << endl;
}
```

## Step by Step Breakdown

### Constants

```cpp
const int MIN  = 1;
const int MAX  = 45;
const int COLS = 6;
const int ROWS = 12;
```

Using constants makes the program easy to modify. If you want to change the range or the number of rows, you only need to update these four values rather than hunting through the code.

### Seeding the Random Number Generator

```cpp
srand(time(NULL));
```

`srand()` seeds the random number generator with the current time. Without this, `rand()` would produce the same sequence of numbers every time the program runs. Seeding with `time(NULL)` ensures a different sequence on each run.

### Generating Random Numbers Without Duplicates

```cpp
void getLine(int line[]) {
    int rNum;
    for (int i = 0; i < COLS; i++) {
        rNum = rand() % (MAX - MIN + 1) + MIN;
        while (duplicates(rNum, line, i) == true)
            rNum = rand() % (MAX - MIN + 1) + MIN;
        line[i] = rNum;
    }
}
```

The formula `rand() % (MAX - MIN + 1) + MIN` generates a random number between 1 and 45. After generating a number, it checks whether that number already exists in the current row using the `duplicates()` function. If it does, it generates a new number and checks again — repeating until a unique number is found.

### Duplicate Detection

```cpp
bool duplicates(int num, int arr[], int size) {
    for (int j = 0; j < size; j++) {
        if (arr[j] == num)
            return true;
    }
    return false;
}
```

This function loops through the array up to the current position and returns `true` if the number already exists, or `false` if it is unique. Only the filled portion of the array is checked — the `size` parameter controls how far to look.

### The Main Loop

```cpp
for (int i = 0; i < ROWS; i++) {
    getLine(row);
    printLine(row);
}
```

This loop runs 12 times — once for each lottery ticket row. Each iteration generates a fresh set of 6 unique numbers and prints them.

## Example Output

```
Your Tattslotto ticket

3
17
42
8
31
25

12
6
39
44
2
19

...
```

## Summary

This C++ lottery program covers some essential beginner concepts — arrays, for loops, random number generation, and function design. The duplicate detection logic is a good introduction to writing utility functions that keep your main code clean and readable.

Key takeaways:
- Use `srand(time(NULL))` to seed random numbers differently each run
- Use `rand() % (MAX - MIN + 1) + MIN` to generate numbers within a range
- Break logic into small focused functions like `getLine()`, `printLine()`, and `duplicates()`

---

**Want more C++ projects like this?** [C++ Better Explained](https://start.cppbetterexplained.com/tw-sales-page) walks you through real-world C++ from beginner to advanced — grab the book and start building today.
