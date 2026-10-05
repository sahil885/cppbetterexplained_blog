---
title: "How to Open and Run a .cpp File (Windows, Mac and Linux)"
description: "A .cpp file is source code, so opening it won't run it. How to compile and run a .cpp file with g++, VS Code or Visual Studio, and fix the common errors."
pubDatetime: 2026-10-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "setup", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "How do I open a .cpp file?"
    answer: "A .cpp file is plain text, so any text editor can open it. A code editor such as VS Code or an IDE such as Visual Studio is better because it adds syntax highlighting and tools for compiling and running the code."
  - question: "Why doesn't double-clicking a .cpp file run it?"
    answer: "A .cpp file is source code, not a program. It has to be compiled into an executable first, for example with g++ main.cpp -o main, and then you run the executable that the compiler produces."
  - question: "How do I run a .cpp file from the command line?"
    answer: "Compile it with g++ main.cpp -o main, then run the result: ./main on Mac and Linux, or main.exe (.\\main.exe in PowerShell) on Windows. You need a compiler installed first."
  - question: "What does 'g++ is not recognized as an internal or external command' mean?"
    answer: "Windows cannot find the g++ compiler. Either it is not installed, or its folder is not on your PATH. Install a compiler such as MinGW-w64, add its bin folder to PATH, then open a new terminal window."
---

# How to Open and Run a .cpp File

**Short answer:** a `.cpp` file is **source code**, not a program — opening it shows you the code, it doesn't run it. To run it, **compile it first**, then run what the compiler produces:

```
g++ main.cpp -o main
./main          (Mac / Linux)
main.exe        (Windows)
```

---

## Why Double-Clicking Doesn't Run It

C++ isn't run directly. A **compiler** turns your human-readable `.cpp` file into an **executable** — a file your computer can actually run.

```
main.cpp  ──compile──►  main.exe (or main)  ──run──►  output
```

So there are two separate jobs:

1. **Opening** the file — to read or edit the code.
2. **Running** it — which means compiling it and then running the executable.

## How to Open a .cpp File

It's plain text, so anything that edits text will open it:

- **VS Code** — free, works on every platform, and the best all-round choice.
- **Visual Studio** (Windows) — a full IDE with a compiler built in.
- **Xcode** (Mac) — Apple's IDE.
- **Notepad / TextEdit** — work in a pinch, but with no colour highlighting.

Opening it in any of these won't run anything. For that, keep reading.

<div class="inline-cta"><strong>Just getting started?</strong> Once your first program runs, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> takes you through the fundamentals in 87 plain-English pages — with pointers, memory and OOP explained properly. Just $19.</div>

## Method 1: Compile and Run from the Command Line

This works everywhere once a compiler is installed, and it shows you what every other method is doing behind the scenes.

Here's a file to test with — save it as `main.cpp`:

```cpp
#include <iostream>

int main() {
    std::cout << "It works!\n";
    return 0;
}
```

Open a terminal **in the folder containing the file**, then:

**Windows (MinGW-w64), Command Prompt or PowerShell:**

```
g++ main.cpp -o main
.\main.exe
```

**Mac or Linux:**

```
g++ main.cpp -o main
./main
```

You should see `It works!`. The `-o main` part names the output file; without it, you get `a.exe` on Windows or `a.out` elsewhere.

**More than one `.cpp` file?** List them all:

```
g++ main.cpp utils.cpp -o app
```

## Method 2: VS Code

1. Install a compiler first (VS Code doesn't include one) — see the [setup guide](/posts/cpp-setup-guide/).
2. Install Microsoft's **C/C++** extension.
3. Open the folder containing your `.cpp` file (**File → Open Folder**).
4. Open the file and use the run (play) button the extension adds in the top-right corner.

Under the hood, VS Code runs the same `g++` command as Method 1.

## Method 3: Visual Studio (Windows)

1. **Create a new project → Empty Project (C++)**.
2. In Solution Explorer, right-click **Source Files → Add → Existing Item** and pick your `.cpp` file.
3. Press **Ctrl+F5** (Start Without Debugging).

Ctrl+F5 keeps the console window open after the program finishes, which saves a lot of confusion.

## Method 4: No Install at All

Paste the code into an online compiler such as OnlineGDB and press Run. It's the fastest way to try something — see [the best online C++ compilers](/posts/cpp-online-compiler/).

## Common Errors and Fixes

**`'g++' is not recognized as an internal or external command`** (Windows)
Windows can't find the compiler. Either it isn't installed, or its `bin` folder isn't on your PATH. Install MinGW-w64, add its `bin` folder to PATH, then **open a new terminal** — old windows don't pick up the change.

**`command not found: g++`** (Mac)
Install Apple's command line tools:

```
xcode-select --install
```

**`fatal error: main.cpp: No such file or directory`**
The terminal isn't in the folder that contains your file. Use `cd` to move there first, or give the full path.

**The window flashes open and closes instantly** (Windows)
The program ran and finished. Run it from a terminal instead of double-clicking the `.exe`, or use Ctrl+F5 in Visual Studio.

**`undefined reference to ...`**
Usually a missing `.cpp` file in the compile command, or a declared-but-never-defined function. See [undefined reference errors](/posts/undefined-reference-linker-errors-cpp/).

## Quick Reference

| Goal | Command or action |
|---|---|
| Open / edit | VS Code, Visual Studio, Xcode, any text editor |
| Compile | `g++ main.cpp -o main` |
| Run (Mac/Linux) | `./main` |
| Run (Windows) | `.\main.exe` or `main.exe` |
| Several files | `g++ a.cpp b.cpp -o app` |
| Use C++20 | `g++ -std=c++20 main.cpp -o main` |
| No install | An online compiler such as OnlineGDB |

---

## Take Your C++ Further

Getting code to run is step one. Understanding it — pointers, memory and OOP especially — is where most beginners stall. The **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** explains them in plain English. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Set Up C++](/posts/cpp-setup-guide/) — installing a compiler on every platform.
- [Online C++ Compilers](/posts/cpp-online-compiler/) — run C++ with nothing installed.
- [C++ Hello World Explained](/posts/cpp-hello-world-explained/) — what each line does.
- [Undefined Reference Errors](/posts/undefined-reference-linker-errors-cpp/) — the most common linker error.
- [C++ Command Line Arguments](/posts/cpp-command-line-arguments/) — passing input when you run a program.
