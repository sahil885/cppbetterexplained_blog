---
title: "How to Write to a File in C++ (ofstream Explained)"
description: "Write text and numbers to a file in C++ with ofstream. Covers creating files, overwriting vs appending, writing a vector, formatting output and checking for errors."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "file-handling", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you write to a file in C++?"
    answer: "Create an std::ofstream with the filename, then use the << operator exactly as you would with cout: std::ofstream file(\"out.txt\"); file << \"text\\n\". The file is created if it does not exist and closed automatically."
  - question: "Does ofstream create the file if it does not exist?"
    answer: "Yes. Opening an ofstream for writing creates the file. If the file already exists it is emptied by default, so pass std::ios::app when you want to keep the existing contents."
  - question: "Why is my C++ output file empty?"
    answer: "Usually because the stream was still buffered when the program ended abnormally, or because the open failed and you never checked. Verify the open with if (!file) and remember the destructor flushes on normal scope exit."
  - question: "How do you write numbers to a file in C++?"
    answer: "The << operator converts numbers to text automatically, so file << 42 << ' ' << 3.14 works. Use std::fixed and std::setprecision from <iomanip> to control decimal formatting."
---

# How to Write to a File in C++

**Short answer:** open an `std::ofstream` and use `<<` exactly like `std::cout`.

```cpp
std::ofstream file("output.txt");
file << "Hello, file!\n";
```

The file is created if it does not exist, and closed automatically when the stream goes out of scope.

---

## The Complete Minimal Program

```cpp
#include <iostream>
#include <fstream>

int main() {
    std::ofstream file("output.txt");

    if (!file) {
        std::cerr << "Could not open output.txt for writing\n";
        return 1;
    }

    file << "Line one\n";
    file << "Line two\n";
    file << "The answer is " << 42 << '\n';
}
```

Three things to notice: `ofstream` means _output_ file stream, `<<` behaves identically to `cout`, and there is no `close()` call because the destructor handles it.

## Always Check the Open Succeeded

Writes can fail for ordinary reasons — a read-only directory, a path that does not exist, a full disk:

```cpp
std::ofstream file("/some/missing/dir/out.txt");
if (!file) {
    std::cerr << "Open failed\n";
    return 1;
}
```

Without that check your program runs happily and produces nothing, which is a genuinely confusing bug to chase. Note that `ofstream` will create a **file** but not the **directories** leading to it.

## Overwrite vs Append

This is the single biggest gotcha:

```cpp
std::ofstream file("log.txt");                    // ERASES log.txt
std::ofstream file("log.txt", std::ios::app);     // keeps it, adds to the end
```

The default mode truncates the file to zero length the moment it opens — before you have written anything. If you want to add to an existing file, see [appending to a file with std::ios::app](/posts/cpp-append-to-file/).

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers file handling, strings and the STL in plain English — 87 pages, just $19.</div>

## Writing Numbers and Formatting

The `<<` operator converts numbers to text for you:

```cpp
int count = 42;
double price = 19.5;

file << count << '\n';
file << price << '\n';          // 19.5
```

For fixed decimal places, use `<iomanip>` just as you would for console output:

```cpp
#include <iomanip>

file << std::fixed << std::setprecision(2);
file << price << '\n';          // 19.50
```

## Writing a Vector or Array

```cpp
#include <vector>

std::vector<int> scores = {90, 85, 77};

std::ofstream file("scores.txt");
for (int s : scores) {
    file << s << '\n';
}
```

For comma-separated output, write the separator between items rather than after each one:

```cpp
for (size_t i = 0; i < scores.size(); ++i) {
    file << scores[i];
    if (i + 1 < scores.size()) file << ',';
}
file << '\n';                   // 90,85,77
```

That trailing-comma detail matters if anything will [read the CSV back](/posts/cpp-read-csv-file/).

## Writing Structured Records

```cpp
struct Student {
    std::string name;
    int score;
};

std::vector<Student> students = {{"Ana", 91}, {"Bo", 78}};

std::ofstream file("students.csv");
file << "name,score\n";
for (const auto& s : students) {
    file << s.name << ',' << s.score << '\n';
}
```

Keep one record per line — that is what makes the file easy to [read back line by line](/posts/cpp-read-file-line-by-line/).

## When Data Actually Reaches the Disk

Output is buffered. It is written when the buffer fills, when you flush, or when the stream closes. If your program crashes before any of those, the file can be empty even though the writes "happened":

```cpp
file << "important\n";
file.flush();                   // force it out now
```

`std::endl` writes a newline **and** flushes, which is why it is slower than `'\n'` inside loops. Use `'\n'` normally and flush deliberately when durability matters — the difference is covered in [endl vs newline](/posts/cpp-endl-vs-newline/).

## Closing Early

You rarely need to, but sometimes you want the file released before the end of the block — for example to read it back:

```cpp
{
    std::ofstream out("data.txt");
    out << "content\n";
}                               // closed here automatically

std::ifstream in("data.txt");   // safe to read now
```

Using a scope block is cleaner than calling `close()` manually, because it still works correctly if an exception is thrown.

## Checking a Write Succeeded

```cpp
std::ofstream file("out.txt");
file << "data\n";

if (!file) {
    std::cerr << "Write failed\n";
}
```

Once a stream enters a failed state it stays there, so a single check after a batch of writes catches any problem in the batch.

## Quick Reference

| Goal               | Code                                         |
| ------------------ | -------------------------------------------- |
| Create / overwrite | `std::ofstream f("out.txt");`                |
| Append instead     | `std::ofstream f("out.txt", std::ios::app);` |
| Write text         | `f << "text\n";`                             |
| Write a number     | `f << 42;`                                   |
| Two decimal places | `f << std::fixed << std::setprecision(2);`   |
| Force to disk      | `f.flush();`                                 |
| Check for errors   | `if (!f) { ... }`                            |

---

## Take Your C++ Further

If you want file handling and the rest of the fundamentals explained properly rather than pieced together, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ File Handling: Reading and Writing Files](/posts/cpp-file-handling/) — the complete streams picture.
- [How to Append to a File in C++](/posts/cpp-append-to-file/) — adding without erasing.
- [How to Read a File Line by Line in C++](/posts/cpp-read-file-line-by-line/) — reading what you wrote.
- [How to Read a CSV File in C++](/posts/cpp-read-csv-file/) — structured data round-trip.
- [C++ endl vs \n](/posts/cpp-endl-vs-newline/) — why one flushes and the other does not.
