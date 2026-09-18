---
title: "How to Get the Size of a File in C++"
description: "Get a file's size in C++ with std::filesystem::file_size, or with seekg and tellg on older compilers. Includes error handling and formatting bytes as KB and MB."
pubDatetime: 2026-09-18T00:00:00Z
author: "Sahil"
tags: ["C++", "file-handling", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do you get the size of a file in C++?"
    answer: "In C++17 use std::filesystem::file_size(path), which returns the size in bytes without opening the file. On older compilers open the file with ios::ate and call tellg() to read the position at the end."
  - question: "Why does tellg give the wrong file size?"
    answer: "Because the file was opened in text mode, where line-ending translation on Windows makes the reported position differ from the real byte count. Open with std::ios::binary to get an accurate size."
  - question: "How do you check if a file is empty in C++?"
    answer: "Compare the size to zero with std::filesystem::file_size(path) == 0, or call file.peek() == EOF after opening it. The filesystem version avoids opening the file at all."
  - question: "Does file_size throw if the file does not exist?"
    answer: "Yes. std::filesystem::file_size throws filesystem_error for a missing file. Use the overload taking a std::error_code if you prefer to check a value instead of catching an exception."
---

# How to Get the Size of a File in C++

**Short answer (C++17):**

```cpp
#include <filesystem>
auto bytes = std::filesystem::file_size("data.txt");
```

No opening, no seeking, no stream state to manage. On older compilers, use the `seekg`/`tellg` approach further down.

---

## The Modern Way: std::filesystem

```cpp
#include <iostream>
#include <filesystem>

int main() {
    std::filesystem::path p = "data.txt";

    if (!std::filesystem::exists(p)) {
        std::cerr << "File does not exist\n";
        return 1;
    }

    std::uintmax_t bytes = std::filesystem::file_size(p);
    std::cout << bytes << " bytes\n";
}
```

`file_size` asks the operating system directly, so it does not read the contents and costs the same whether the file is 1 KB or 1 GB.

Note the return type: `std::uintmax_t`, the largest unsigned integer the platform has. Files can exceed what an `int` holds, so do not narrow it casually.

## Handling Errors Without Exceptions

`file_size` throws `std::filesystem::filesystem_error` if the path is missing or unreadable. If you would rather not use try/catch, there is an overload that reports through an error code:

```cpp
#include <filesystem>
#include <system_error>

std::error_code ec;
auto bytes = std::filesystem::file_size("data.txt", ec);

if (ec) {
    std::cerr << "Error: " << ec.message() << '\n';
} else {
    std::cout << bytes << " bytes\n";
}
```

This is the version I would reach for in real code — a missing file is an ordinary situation, not an exceptional one.

<div class="inline-cta"><strong>Learning C++ properly?</strong> The <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> covers file handling, strings and the STL in plain English — 87 pages, just $19.</div>

## The Pre-C++17 Way: seekg and tellg

```cpp
#include <iostream>
#include <fstream>

std::streamsize fileSize(const std::string& path) {
    std::ifstream file(path, std::ios::binary | std::ios::ate);
    if (!file) return -1;
    return file.tellg();
}

int main() {
    auto size = fileSize("data.txt");
    if (size < 0) std::cerr << "Could not open\n";
    else std::cout << size << " bytes\n";
}
```

`std::ios::ate` positions the read head at the **end** on open, and `tellg()` reports that position — which is the length.

**The `std::ios::binary` flag is not optional here.** In text mode on Windows, `\r\n` sequences are translated during reading, so the position you get back does not match the actual byte count on disk. Binary mode disables that translation.

If you need the size and then want to read from the start:

```cpp
std::ifstream file("data.txt", std::ios::binary | std::ios::ate);
auto size = file.tellg();
file.seekg(0);                 // rewind before reading
```

## Checking if a File Is Empty

```cpp
// C++17
if (std::filesystem::file_size(p) == 0) {
    std::cout << "Empty\n";
}

// any version, using the stream
std::ifstream file("data.txt");
if (file.peek() == std::ifstream::traits_type::eof()) {
    std::cout << "Empty\n";
}
```

`peek()` looks at the next character without consuming it, so the stream is still usable afterwards.

## Formatting Bytes as KB and MB

Raw byte counts are hard to read:

```cpp
#include <iomanip>
#include <sstream>
#include <string>

std::string humanSize(std::uintmax_t bytes) {
    const char* units[] = {"B", "KB", "MB", "GB", "TB"};
    int i = 0;
    double size = static_cast<double>(bytes);

    while (size >= 1024.0 && i < 4) {
        size /= 1024.0;
        ++i;
    }

    std::ostringstream ss;
    ss << std::fixed << std::setprecision(i == 0 ? 0 : 1)
       << size << ' ' << units[i];
    return ss.str();
}

int main() {
    std::cout << humanSize(2048)     << '\n';   // 2.0 KB
    std::cout << humanSize(1536000)  << '\n';   // 1.5 MB
}
```

## Reading a Whole File Using Its Size

A common reason to want the size is pre-allocating a buffer:

```cpp
#include <fstream>
#include <string>

std::string readWholeFile(const std::string& path) {
    std::ifstream file(path, std::ios::binary | std::ios::ate);
    if (!file) return "";

    auto size = file.tellg();
    std::string content(static_cast<size_t>(size), '\0');

    file.seekg(0);
    file.read(&content[0], size);
    return content;
}
```

Allocating once up front is much faster than appending line by line for large files. For line-oriented processing, [reading line by line](/posts/cpp-read-file-line-by-line/) is still the right tool.

## Quick Reference

| Goal                | Code                                    |
| ------------------- | --------------------------------------- |
| Size (C++17)        | `std::filesystem::file_size(p)`         |
| Size, no exceptions | `file_size(p, ec)`                      |
| Size (older C++)    | open with `binary\|ate`, then `tellg()` |
| Is it empty         | `file_size(p) == 0`                     |
| Does it exist       | `std::filesystem::exists(p)`            |
| Rewind after sizing | `file.seekg(0)`                         |

---

## Take Your C++ Further

If you want file handling and the rest of the fundamentals explained properly rather than gathered from snippets, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** covers it in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [C++ File Handling: Reading and Writing Files](/posts/cpp-file-handling/) — the complete streams picture.
- [How to Check if a File Exists in C++](/posts/cpp-check-if-file-exists/) — the check to do first.
- [How to Read a File Line by Line in C++](/posts/cpp-read-file-line-by-line/) — processing contents.
- [How to Write to a File in C++](/posts/cpp-write-to-file/) — the output side.
- [How to Append to a File in C++](/posts/cpp-append-to-file/) — adding without erasing.
