---
title: "How to Append to a File in C++ (std::ios::app)"
description: "Append text to an existing file in C++ with ofstream and std::ios::app. Learn app vs ate vs trunc, how to avoid overwriting your file, and how to log safely."
pubDatetime: 2026-09-11T00:00:00Z
author: "Sahil"
tags: ["C++", "file-handling", "tutorial", "beginner"]
draft: false
featured: false
faqSchema:
  - question: "How do you append to a file in C++?"
    answer: 'Open the file with std::ofstream and the std::ios::app flag: std::ofstream file("log.txt", std::ios::app). Every write then goes to the end of the existing file instead of erasing it.'
  - question: "Why does ofstream erase my file?"
    answer: "Because the default mode for ofstream is std::ios::trunc, which truncates the file to zero length when it opens. If you want to keep the existing contents you must pass std::ios::app explicitly."
  - question: "What is the difference between ios::app and ios::ate?"
    answer: "ios::app forces every write to the end of the file, no matter where you seek. ios::ate only positions you at the end when the file opens, and you can seek elsewhere afterwards and overwrite data."
  - question: "Does appending create the file if it does not exist?"
    answer: "Yes. Opening with std::ios::app creates an empty file if none exists, so you do not need to check first or create it separately."
---

# How to Append to a File in C++

**Short answer:** pass `std::ios::app` when you open the stream. Without it, `ofstream` wipes the file the moment it opens.

```cpp
std::ofstream file("log.txt", std::ios::app);
file << "another line\n";
```

---

## The Default Behaviour That Catches Everyone

This innocent-looking code destroys your file:

```cpp
std::ofstream file("log.txt");   // file is now EMPTY
file << "new entry\n";
```

`ofstream` defaults to `std::ios::out | std::ios::trunc`. **Truncate** means "set the length to zero" — and it happens at open time, before you write anything. If your program crashes on the next line, the file is already gone.

This is the single most common file-handling mistake in C++, and it is silent: no error, no warning, just an empty file.

## Appending Correctly

```cpp
#include <iostream>
#include <fstream>

int main() {
    std::ofstream file("log.txt", std::ios::app);

    if (!file) {
        std::cerr << "Could not open log.txt\n";
        return 1;
    }

    file << "Program started\n";
    file << "Value: " << 42 << '\n';
}
```

Run it three times and you get six lines, not two. The file is created automatically if it does not exist yet.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers file handling, strings and the STL in plain English — 87 pages, just $19.</div>

## app vs ate vs trunc

| Flag               | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `std::ios::trunc`  | Empties the file on open (the `ofstream` default)    |
| `std::ios::app`    | Every write goes to the end, always                  |
| `std::ios::ate`    | Seeks to the end on open, but you can move elsewhere |
| `std::ios::in`     | Open for reading                                     |
| `std::ios::out`    | Open for writing                                     |
| `std::ios::binary` | No text translation of line endings                  |

The `app` versus `ate` distinction matters more than it looks:

```cpp
// app — the seek is ignored, text still lands at the end
std::ofstream a("f.txt", std::ios::app);
a.seekp(0);
a << "X";          // appended at the end

// ate — the seek works, and this OVERWRITES the first byte
std::ofstream b("f.txt", std::ios::ate);
b.seekp(0);
b << "X";          // overwrites position 0
```

Use `app` for logs. Use `ate` only when you genuinely intend to move around inside an existing file.

## Combining Flags

Flags are bit masks, combined with `|`:

```cpp
// read and append
std::fstream f("data.txt", std::ios::in | std::ios::app);

// append in binary mode
std::ofstream b("data.bin", std::ios::app | std::ios::binary);
```

## A Small Logging Helper

```cpp
#include <fstream>
#include <string>
#include <ctime>

void log(const std::string& message) {
    std::ofstream file("app.log", std::ios::app);
    if (!file) return;

    std::time_t now = std::time(nullptr);
    char stamp[20];
    std::strftime(stamp, sizeof(stamp), "%Y-%m-%d %H:%M:%S",
                  std::localtime(&now));

    file << "[" << stamp << "] " << message << '\n';
}

int main() {
    log("Program started");
    log("Something happened");
}
```

Opening and closing per call is slightly slower but much safer — the data is flushed to disk each time, so a crash does not lose your log.

## Making Sure Data Is Written

Stream output is buffered. If you keep one stream open for a long time, force a flush at the points that matter:

```cpp
std::ofstream file("log.txt", std::ios::app);
file << "important\n";
file.flush();            // or: file << std::endl;
```

`std::endl` writes a newline **and** flushes, which is why it is slower than `'\n'` in loops. Use `'\n'` for ordinary output and flush deliberately when you need durability.

## Checking a Write Succeeded

Writes can fail — a full disk, a read-only file, a vanished network drive:

```cpp
std::ofstream file("log.txt", std::ios::app);
file << "data\n";

if (!file) {
    std::cerr << "Write failed\n";
}
```

The stream stays in a failed state once something goes wrong, so a single check after a batch of writes is usually enough.

## Quick Reference

| Goal               | Code                                                |
| ------------------ | --------------------------------------------------- |
| Append text        | `std::ofstream f("x.txt", std::ios::app);`          |
| Overwrite the file | `std::ofstream f("x.txt");`                         |
| Read and append    | `std::fstream f(p, std::ios::in \| std::ios::app);` |
| Append binary      | `std::ios::app \| std::ios::binary`                 |
| Force to disk      | `f.flush();`                                        |

---

## Take Your C++ Further

If you want file handling and the rest of C++ explained properly rather than one snippet at a time, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers the fundamentals in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ File Handling: Reading and Writing Files](/posts/cpp-file-handling/) — the complete ifstream and ofstream picture.
- [How to Read a File Line by Line in C++](/posts/cpp-read-file-line-by-line/) — the reading side of the same job.
- [How to Check if a File Exists in C++](/posts/cpp-check-if-file-exists/) — test before you open.
- [C++ endl vs \n](/posts/cpp-endl-vs-newline/) — why one of them flushes and the other does not.
- [How to Read a CSV File in C++](/posts/cpp-read-csv-file/) — structured data on disk.
