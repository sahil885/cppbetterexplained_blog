---
title: "C++ Grade Calculator: Build One Step by Step"
description: "Learn how to build a C++ grade calculator program. This beginner tutorial shows you how to take scores as input, calculate averages, and determine letter grades — with full working code."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "projects", "tutorial"]
faqSchema:
  - question: "How do I calculate the average in C++?"
    answer: "Sum all the values and divide by the count: double average = total / count; — use double for the result to get decimal precision. If you have an array or vector, loop through it accumulating the sum, then divide by the number of elements."
  - question: "How do I make a grade calculator in C++?"
    answer: "A C++ grade calculator reads scores from the user, computes the average, then uses if/else (or a function) to map the average to a letter grade (A, B, C, D, F). The basic version takes a fixed number of scores; a more advanced version uses a vector to accept any number."
  - question: "How do I convert a percentage to a letter grade in C++?"
    answer: "Use if/else or switch to compare the score against thresholds: if (score >= 90) return 'A'; else if (score >= 80) return 'B'; else if (score >= 70) return 'C'; else if (score >= 60) return 'D'; else return 'F';"
draft: false
featured: false
---

# C++ Grade Calculator: Build One Step by Step

A grade calculator is an excellent beginner project — it uses variables, loops, arrays or vectors, functions, and conditionals all in one program. This tutorial builds one from scratch, adding features at each step.

---

## Version 1: Fixed Number of Scores

The simplest version — ask for exactly 5 scores and compute the average and grade:

```cpp
#include <iostream>
using namespace std;

char getLetterGrade(double average) {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
}

int main() {
    const int NUM_SCORES = 5;
    double scores[NUM_SCORES];
    double total = 0;

    cout << "Enter " << NUM_SCORES << " scores:\n";
    for (int i = 0; i < NUM_SCORES; i++) {
        cout << "Score " << (i + 1) << ": ";
        cin >> scores[i];
        total += scores[i];
    }

    double average = total / NUM_SCORES;
    char grade = getLetterGrade(average);

    cout << "\nAverage: " << average << "\n";
    cout << "Grade: " << grade << "\n";

    return 0;
}
```

Sample output:
```
Enter 5 scores:
Score 1: 85
Score 2: 92
Score 3: 78
Score 4: 90
Score 5: 88
Average: 86.6
Grade: B
```

---

## Version 2: Any Number of Scores Using a Vector

More flexible — uses a `vector` so you can enter as many scores as you like:

```cpp
#include <iostream>
#include <vector>
#include <numeric>  // for accumulate
using namespace std;

char getLetterGrade(double avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

string getGradeDescription(char grade) {
    switch (grade) {
        case 'A': return "Excellent";
        case 'B': return "Good";
        case 'C': return "Average";
        case 'D': return "Below Average";
        default:  return "Failing";
    }
}

int main() {
    vector<double> scores;
    double score;

    cout << "Enter scores one at a time. Type -1 to finish.\n";

    while (true) {
        cout << "Score: ";
        cin >> score;
        if (score == -1) break;
        if (score < 0 || score > 100) {
            cout << "Invalid score. Enter a value between 0 and 100.\n";
            continue;
        }
        scores.push_back(score);
    }

    if (scores.empty()) {
        cout << "No scores entered.\n";
        return 0;
    }

    double total = 0;
    for (double s : scores) total += s;
    double average = total / scores.size();

    char grade = getLetterGrade(average);

    cout << "\n=== Grade Report ===\n";
    cout << "Scores entered: " << scores.size() << "\n";
    cout << "Average: " << average << "\n";
    cout << "Grade: " << grade << " (" << getGradeDescription(grade) << ")\n";

    return 0;
}
```

This version validates input, handles any number of scores, and gives a description with the grade.

---

## Version 3: Full Report with Statistics

A more complete version that adds highest score, lowest score, and shows each score with its individual letter grade:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>  // min_element, max_element
#include <iomanip>    // setprecision, fixed
using namespace std;

char letterGrade(double score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

int main() {
    int n;
    cout << "How many scores? ";
    cin >> n;

    if (n <= 0) {
        cout << "Must enter at least one score.\n";
        return 1;
    }

    vector<double> scores(n);
    for (int i = 0; i < n; i++) {
        cout << "Score " << (i + 1) << " (0-100): ";
        cin >> scores[i];
    }

    // Calculate stats
    double total = 0;
    for (double s : scores) total += s;
    double average = total / n;

    double highest = *max_element(scores.begin(), scores.end());
    double lowest  = *min_element(scores.begin(), scores.end());

    // Print report
    cout << fixed << setprecision(1);
    cout << "\n======= Grade Report =======\n";
    cout << left << setw(10) << "Score" << setw(8) << "Grade" << "\n";
    cout << "----------------------------\n";
    for (int i = 0; i < n; i++) {
        cout << setw(10) << scores[i] << setw(8) << letterGrade(scores[i]) << "\n";
    }
    cout << "----------------------------\n";
    cout << "Average: " << average << "  (" << letterGrade(average) << ")\n";
    cout << "Highest: " << highest << "\n";
    cout << "Lowest:  " << lowest << "\n";

    return 0;
}
```

Sample output for 4 scores (85, 92, 73, 68):
```
======= Grade Report =======
Score     Grade
----------------------------
85.0      B
92.0      A
73.0      C
68.0      D
----------------------------
Average: 79.5  (C)
Highest: 92.0
Lowest:  68.0
```

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Weighted Grade Calculator

Many courses weight exams, homework, and participation differently:

```cpp
#include <iostream>
using namespace std;

int main() {
    double homework, midterm, finalExam;
    double hwWeight = 0.30, midWeight = 0.30, finalWeight = 0.40;

    cout << "Homework score (0-100): ";
    cin >> homework;
    cout << "Midterm score (0-100): ";
    cin >> midterm;
    cout << "Final exam score (0-100): ";
    cin >> finalExam;

    double weighted = (homework  * hwWeight)
                    + (midterm   * midWeight)
                    + (finalExam * finalWeight);

    char grade;
    if (weighted >= 90) grade = 'A';
    else if (weighted >= 80) grade = 'B';
    else if (weighted >= 70) grade = 'C';
    else if (weighted >= 60) grade = 'D';
    else grade = 'F';

    cout << "\nWeighted average: " << weighted << "\n";
    cout << "Final grade: " << grade << "\n";

    return 0;
}
```

---

## Key Concepts Used

- **`vector<double>`** — stores variable number of scores
- **Range-based for loop** — iterates over all scores cleanly
- **`max_element` / `min_element`** — from `<algorithm>`, finds highest/lowest
- **`setprecision` / `fixed`** — formats decimal output
- **Functions** — `letterGrade()` separates grading logic from I/O
- **Input validation** — rejects scores outside 0-100

---

## Related Articles

- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — types used in the calculator
- [C++ Loops Tutorial](/posts/cpp-loops-tutorial/) — for loops and range-based for
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — using vectors to store scores
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — organizing code into functions
- [C++ Calculator Program](/posts/cpp-calculator-program/) — another beginner project

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
