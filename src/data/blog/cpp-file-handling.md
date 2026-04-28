---
title: "C++ File Handling: Reading and Writing Files with fstream"
description: "Learn C++ file handling with fstream. Covers reading, writing, and appending to files with ifstream, ofstream, and fstream with practical examples."
pubDatetime: 2026-04-28T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "tutorial", "files", "fstream"]
draft: false
featured: false
faqSchema:
  - question: "How do you read a file in C++?"
    answer: "Use ifstream to read a file in C++. Include <fstream>, create an ifstream object with the filename, then use getline() to read line by line or the >> operator to read word by word. Always check that the file opened successfully before reading."
  - question: "How do you write to a file in C++?"
    answer: "Use ofstream to write to a file in C++. Create an ofstream object with the filename, then use the << operator to write data — the same way you use cout. By default ofstream overwrites the file. Use ios::app to append instead."
  - question: "What is the difference between ifstream, ofstream, and fstream in C++?"
    answer: "ifstream is for reading files only. ofstream is for writing files only. fstream handles both reading and writing. For most tasks, use the specific type (ifstream or ofstream) as it makes your intent clear."
  - question: "How do you check if a file exists in C++?"
    answer: "Open the file with ifstream and call .is_open() to check if it opened successfully. If the file does not exist, is_open() returns false. In C++17 you can also use std::filesystem::exists() from the <filesystem> header."
---

# C++ File Handling: Reading and Writing Files with fstream

Almost every real C++ program needs to read from or write to files at some point — whether it is loading configuration, saving game state, processing data, or writing logs. C++ makes this straightforward through the `<fstream>` library.

This article covers everything you need to know: reading files line by line, writing and appending data, and handling errors.

---

## The Three File Stream Classes

The `<fstream>` header gives you three classes:

| Class | Purpose |
|-------|---------|
| `ifstream` | Input file stream — **read** from files |
| `ofstream` | Output file stream — **write** to files |
| `fstream` | Both reading and writing |

For most tasks, use `ifstream` or `ofstream`. Only use `fstream` when you genuinely need to both read and write the same file.

---

## Writing to a File with ofstream

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ofstream outFile("scores.txt");

    if (!outFile.is_open()) {
        cout << "Error: could not open file" << endl;
        return 1;
    }

    outFile << "Alice: 95" << endl;
    outFile << "Bob: 87" << endl;
    outFile << "Charlie: 92" << endl;

    outFile.close();
    cout << "File written successfully" << endl;

    return 0;
}
```

This creates `scores.txt` (or overwrites it if it exists) and writes three lines. The `<<` operator works exactly like `cout`.

**Always call `.close()`** when you are done — this flushes the buffer and releases the file handle. (Or use a block scope so the destructor closes it automatically.)

---

## Reading a File with ifstream

### Reading Line by Line

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream inFile("scores.txt");

    if (!inFile.is_open()) {
        cout << "Error: could not open file" << endl;
        return 1;
    }

    string line;
    while (getline(inFile, line)) {
        cout << line << endl;
    }

    inFile.close();
    return 0;
}
```

**Output:**
```
Alice: 95
Bob: 87
Charlie: 92
```

`getline(inFile, line)` reads one line at a time into the `string` variable `line`. The while loop continues until the end of the file.

### Reading Word by Word

```cpp
ifstream inFile("scores.txt");
string word;

while (inFile >> word) {
    cout << word << " ";
}
```

The `>>` operator reads whitespace-delimited tokens, so it is useful for reading individual words or numbers.

---

## Appending to a File

By default, `ofstream` overwrites the file. To add to the end without destroying existing content, use `ios::app`:

```cpp
#include <fstream>
using namespace std;

int main() {
    ofstream outFile("scores.txt", ios::app);

    if (outFile.is_open()) {
        outFile << "Diana: 98" << endl;
        outFile.close();
    }

    return 0;
}
```

Now `scores.txt` will have four lines — the original three plus Diana's score.

---

## File Open Modes

You can combine modes using the `|` operator:

| Mode | Meaning |
|------|---------|
| `ios::in` | Open for reading |
| `ios::out` | Open for writing (default for ofstream) |
| `ios::app` | Append to end of file |
| `ios::trunc` | Truncate (clear) file on open (default for ofstream) |
| `ios::binary` | Open in binary mode |

```cpp
// Open for both reading and writing, without truncating
fstream file("data.txt", ios::in | ios::out);
```

---

## Reading Numbers from a File

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    // First write some numbers
    ofstream outFile("numbers.txt");
    outFile << "10 20 30 40 50" << endl;
    outFile.close();

    // Now read them back
    ifstream inFile("numbers.txt");
    int num;
    int total = 0;

    while (inFile >> num) {
        total += num;
    }

    inFile.close();
    cout << "Total: " << total << endl; // Output: Total: 150

    return 0;
}
```

---

## Practical Example: Simple Student Grade Logger

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

void saveGrade(const string& name, int grade) {
    ofstream file("grades.txt", ios::app);
    if (file.is_open()) {
        file << name << " " << grade << endl;
        file.close();
    }
}

void showAllGrades() {
    ifstream file("grades.txt");
    if (!file.is_open()) {
        cout << "No grades recorded yet." << endl;
        return;
    }

    string name;
    int grade;
    cout << "--- Grade Record ---" << endl;
    while (file >> name >> grade) {
        cout << name << ": " << grade << endl;
    }
    file.close();
}

int main() {
    saveGrade("Alice", 92);
    saveGrade("Bob", 85);
    saveGrade("Charlie", 78);

    showAllGrades();
    return 0;
}
```

**Output:**
```
--- Grade Record ---
Alice: 92
Bob: 85
Charlie: 78
```

---

## Error Handling Best Practices

Always check that a file opened successfully before using it:

```cpp
ifstream file("data.txt");

if (!file) {  // Equivalent to !file.is_open()
    cerr << "Error: could not open data.txt" << endl;
    return 1;
}
```

Use `cerr` for error messages — it goes to the error stream rather than standard output.

You can also check for specific error states:

```cpp
if (file.fail()) { /* read/write error */ }
if (file.eof())  { /* end of file reached */ }
if (file.bad())  { /* unrecoverable error */ }
```

---

## Using RAII — Let the Destructor Close the File

You do not have to call `.close()` manually if you scope the file stream correctly — the destructor closes it automatically when it goes out of scope:

```cpp
{
    ofstream file("log.txt");
    file << "Log entry" << endl;
} // file.close() called automatically here
```

This is the preferred modern C++ approach — it guarantees the file is closed even if an exception is thrown.

---

## Related Articles
- [C++ Variables and Data Types](/posts/cpp-variables-data-types/) — understand the types you will be reading and writing to files.
- [C++ String Handling: std::string & string_view Guide](/posts/cpp-string-handling/) — strings are the most common data type when working with files.
- [C++ Functions Tutorial](/posts/cpp-functions-tutorial/) — organise your file I/O logic into clean, reusable functions.
- [Exception Handling in C++: try, catch & throw](/posts/exception-handling-cpp/) — handle file errors gracefully with exceptions.
- [C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP](/posts/cpp-cheat-sheet/) — a quick reference for file stream syntax and modes.
