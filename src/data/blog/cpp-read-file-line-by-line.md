---
title: "How to Read a File Line by Line in C++"
description: "Read a text file line by line in C++ with ifstream and getline. Includes error handling, reading into a vector, parsing each line, and the common gotchas."
modDatetime: 2026-09-18T00:00:00Z
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "file-handling", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you read a file line by line in C++?"
    answer: "Open the file with std::ifstream, then loop with while (std::getline(file, line)). Each iteration puts the next line into the string without its newline character. The loop ends automatically at end of file."
  - question: "Why should you use while (getline(file, line)) instead of while (!file.eof())?"
    answer: "eof() only becomes true after a read has already failed, so the eof loop processes the last line twice or reads one empty line too many. Putting getline in the condition tests the result of the read itself, which is always correct."
  - question: "Does getline include the newline character?"
    answer: "No. std::getline consumes the newline from the stream but does not store it in the string. On Windows files read on Linux you may still see a trailing carriage return, which you can strip with a small check."
  - question: "How do you check if a file opened successfully in C++?"
    answer: "Test the stream: if (!file) or if (!file.is_open()). If you skip this and the file is missing, the read loop simply never runs and your program silently does nothing, which is a hard bug to spot."
---

# How to Read a File Line by Line in C++

**Short answer:** open an `std::ifstream` and loop with `while (std::getline(file, line))`. That reads one line per iteration, strips the newline, and stops cleanly at the end of the file.

---

## The Minimal Version

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream file("data.txt");

    if (!file) {
        std::cerr << "Could not open data.txt\n";
        return 1;
    }

    std::string line;
    while (std::getline(file, line)) {
        std::cout << line << '\n';
    }
}
```

That is the whole pattern, and it is the one to memorise. `getline` returns the stream, which converts to `false` when a read fails — including at end of file — so the loop terminates on its own.

## Always Check the File Opened

Skipping the `if (!file)` check is the most common reason a beginner's file program "does nothing". If the path is wrong, `ifstream` fails silently, the `getline` loop never executes even once, and the program exits with no output and no error.

```cpp
std::ifstream file("data.txt");
if (!file.is_open()) {          // same thing as if (!file)
    std::cerr << "Open failed\n";
    return 1;
}
```

Relative paths are resolved from the directory you **run** the program in, not where the source file lives — which explains most mysterious open failures inside IDEs.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers file handling, strings and the STL in plain English — 87 pages, just $19.</div>

## Never Use while (!file.eof())

You will see this in old tutorials. It is wrong:

```cpp
// BROKEN — processes the last line twice
while (!file.eof()) {
    std::getline(file, line);
    std::cout << line << '\n';
}
```

`eof()` only turns true **after** a read has already run off the end. So the final iteration reads nothing, leaves `line` holding the previous value (or empty), and you print one line too many. Putting `getline` in the loop condition tests the read itself, which is why the correct version has no such bug.

## Reading All Lines into a Vector

Often you want the whole file in memory:

```cpp
#include <vector>

std::vector<std::string> readLines(const std::string& path) {
    std::vector<std::string> lines;
    std::ifstream file(path);
    std::string line;
    while (std::getline(file, line)) {
        lines.push_back(line);
    }
    return lines;
}

int main() {
    auto lines = readLines("data.txt");
    std::cout << "Read " << lines.size() << " lines\n";
    for (const auto& l : lines) std::cout << l << '\n';
}
```

Now you can index, sort or search the lines like any other [vector](/posts/cpp-vector-tutorial/).

## Parsing Each Line

Lines usually contain fields. Feed each one into a `stringstream`:

```cpp
#include <sstream>

std::string line;
while (std::getline(file, line)) {
    std::istringstream ss(line);
    std::string name;
    int score;
    if (ss >> name >> score) {
        std::cout << name << " scored " << score << '\n';
    }
}
```

For comma-separated fields, use the three-argument `getline` with a delimiter:

```cpp
std::istringstream ss(line);
std::string field;
while (std::getline(ss, field, ',')) {
    std::cout << "[" << field << "] ";
}
```

That is the core of [reading a CSV file](/posts/cpp-read-csv-file/).

## Skipping Blank Lines and Comments

```cpp
while (std::getline(file, line)) {
    if (line.empty()) continue;
    if (line[0] == '#') continue;   // comment line
    process(line);
}
```

If the file came from Windows and you are reading it on Linux, each line may end with a stray `\r`. Strip it:

```cpp
if (!line.empty() && line.back() == '\r') {
    line.pop_back();
}
```

This one causes genuinely baffling bugs — string comparisons fail for no visible reason because the invisible carriage return is still there.

## Counting Lines

```cpp
int count = 0;
std::string line;
while (std::getline(file, line)) ++count;
std::cout << "Lines: " << count << '\n';
```

Note that you cannot then read the file again without rewinding — the stream is sitting at the end. Either reopen it, or rewind:

```cpp
file.clear();               // clear the eof flag
file.seekg(0);              // back to the start
```

Forgetting `clear()` is a classic trap: `seekg` does nothing while the eof flag is still set.

## Do You Need to Close the File?

No. `ifstream` closes itself when it goes out of scope, which is the whole point of RAII. Call `file.close()` explicitly only if you need the handle released earlier than the end of the block.

## Quick Reference

| Goal                  | Code                                        |
| --------------------- | ------------------------------------------- |
| Read line by line     | `while (std::getline(file, line))`          |
| Check open succeeded  | `if (!file) { ... }`                        |
| Read into a vector    | `lines.push_back(line)` in the loop         |
| Split a line by comma | `std::getline(ss, field, ',')`              |
| Strip Windows `\r`    | `if (line.back() == '\r') line.pop_back();` |
| Rewind to the start   | `file.clear(); file.seekg(0);`              |

---

## Take Your C++ Further

If you want file handling, strings and the STL explained properly rather than pieced together from snippets, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Write to a File in C++](/posts/cpp-write-to-file/) — ofstream, formatting and flushing explained.
- [How to Get the Size of a File in C++](/posts/cpp-file-size/) — filesystem::file_size and the seekg fallback.
- [C++ File Handling: Reading and Writing Files](/posts/cpp-file-handling/) — the complete ifstream and ofstream picture.
- [How to Check if a File Exists in C++](/posts/cpp-check-if-file-exists/) — verify before you open.
- [How to Read a CSV File in C++](/posts/cpp-read-csv-file/) — parsing comma-separated data line by line.
- [C++ stringstream Explained](/posts/cpp-stringstream/) — the tool for parsing each line.
- [How to Split a String in C++](/posts/cpp-split-string/) — breaking lines into fields.
