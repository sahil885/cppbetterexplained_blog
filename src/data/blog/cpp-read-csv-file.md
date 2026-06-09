---
title: "C++ Read CSV File: Parse Comma-Separated Data (with Examples)"
description: "Learn how to read a CSV file in C++ with ifstream and getline. Parse rows into a vector, skip the header, and convert fields to numbers, with examples."
pubDatetime: 2026-06-09T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "file-handling", "tutorial"]
faqSchema:
  - question: "How do you read a CSV file in C++?"
    answer: "Open the file with std::ifstream, read it one line at a time with std::getline, then split each line on commas using a stringstream and getline with a comma delimiter. Store each row as a vector of strings."
  - question: "How do you skip the header row of a CSV in C++?"
    answer: "Call std::getline once before your main loop to read and discard the first line. Then loop over the remaining lines as data rows. This is the simplest way to ignore column titles."
  - question: "How do you convert CSV fields to numbers in C++?"
    answer: "After splitting a line into string fields, use std::stoi for integers or std::stod for doubles on the fields you need as numbers. Wrap them in a try/catch if the data might be malformed."
draft: false
featured: false
---

# C++ Read CSV File: Parse Comma-Separated Data

**To read a CSV file in C++, open it with `std::ifstream`, read each line with `std::getline`, then split the line on commas.** There's no built-in CSV parser in the standard library, but combining file reading with string splitting handles the common cases in a few lines.

---

## A Sample CSV

Imagine a file called `people.csv`:

```
name,age,city
Alice,30,London
Bob,25,Paris
```

The first line is a header (column names), and each following line is a record with fields separated by commas.

---

## Reading and Splitting Line by Line

The core pattern is: read each line, then feed that line into a `stringstream` and pull out comma-separated fields with `getline`:

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::ifstream file("people.csv");
    if (!file.is_open()) {
        std::cerr << "Could not open file\n";
        return 1;
    }

    std::string line;
    std::getline(file, line);   // read and discard the header

    while (std::getline(file, line)) {       // one record per line
        std::stringstream ss(line);
        std::string field;
        std::vector<std::string> row;

        while (std::getline(ss, field, ',')) // split on commas
            row.push_back(field);

        std::cout << "Name: " << row[0]
                  << ", Age: " << row[1]
                  << ", City: " << row[2] << "\n";
    }
    return 0;
}
```

There are two loops: the outer `getline` reads a whole line from the file, and the inner `getline` with `','` splits that line into fields. Always check `is_open()` first — trying to read a missing file is a common beginner crash.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Storing the Whole File in a 2D Vector

Often you want the entire table in memory. Store each row as a `vector<string>`, giving a `vector<vector<string>>`:

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::ifstream file("people.csv");
    std::vector<std::vector<std::string>> data;
    std::string line;

    while (std::getline(file, line)) {
        std::stringstream ss(line);
        std::string field;
        std::vector<std::string> row;
        while (std::getline(ss, field, ','))
            row.push_back(field);
        data.push_back(row);
    }

    std::cout << "Read " << data.size() << " rows\n";
    return 0;
}
```

Now `data[1][0]` is `"Alice"` and `data[2][2]` is `"Paris"`. This structure is flexible, but remember every field is a string for now.

---

## Converting Fields to Numbers

The age column is text like `"30"`. To do math with it, convert with `std::stoi` (string to int) or `std::stod` (string to double):

```cpp
int age = std::stoi(row[1]);   // "30" becomes 30
```

If a field might be empty or malformed, guard the conversion so one bad row doesn't crash the program:

```cpp
try {
    int age = std::stoi(row[1]);
} catch (const std::exception& e) {
    std::cerr << "Bad number: " << row[1] << "\n";
}
```

---

## A Note on Quoted Fields

This simple parser splits on every comma, which breaks if a field itself contains a comma inside quotes, like `"Smith, John"`. For clean, controlled data it's perfectly fine. For messy real-world CSVs with quotes and escapes, consider a small library, but the techniques above cover the large majority of beginner tasks.

---

## Related Articles

- [C++ Read File Line by Line](/posts/cpp-file-handling/) — fstream reading and writing
- [C++ Split String](/posts/cpp-split-string/) — the splitting logic in depth
- [C++ stringstream](/posts/cpp-stringstream/) — parsing fields out of a line
- [C++ Vector Tutorial](/posts/cpp-vector-tutorial/) — storing rows and columns
- [C++ String to int](/posts/cpp-string-to-int/) — converting fields to numbers

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
