---
title: "How to Set Up C++: Install a Compiler and Write Your First Program"
description: "Step-by-step C++ setup guide for Windows, Mac, and Linux. Install a compiler, set up VS Code, and run your first C++ program in under 15 minutes."
pubDatetime: 2026-04-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "getting-started", "tools", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What do I need to install to run C++?"
    answer: "You need two things: a C++ compiler (which turns your code into a runnable program) and a code editor or IDE. On Windows, install MinGW-w64 for the compiler and VS Code as your editor. On Mac, install Xcode Command Line Tools (which includes the clang compiler). On Linux, install g++ via your package manager. VS Code with the C++ extension works well on all platforms."
  - question: "What is the best IDE for C++ beginners?"
    answer: "VS Code with the Microsoft C/C++ extension is the most popular choice for beginners — it's free, lightweight, and works on Windows, Mac, and Linux. CLion is a more fully-featured option but requires a paid licence. Code::Blocks is a free alternative that's simpler to configure on Windows. For absolute beginners, an online compiler like godbolt.org or onlinegdb.com lets you try C++ without installing anything."
  - question: "How do I compile and run a C++ program?"
    answer: "Open a terminal in the folder where your .cpp file lives and run: g++ filename.cpp -o output then ./output (on Mac/Linux) or output.exe (on Windows). This compiles your code into an executable and runs it. Most IDEs have a Run button that does this automatically."
  - question: "Why won't my C++ code compile?"
    answer: "The most common causes are: missing semicolons at the end of statements, mismatched curly braces, using a variable before declaring it, or a typo in a function or type name. Read the first error message carefully — compilers often report one root error plus several follow-on errors caused by the first. Fix the first error and recompile."
  - question: "Can I learn C++ online without installing anything?"
    answer: "Yes. Online compilers like onlinegdb.com and godbolt.org let you write and run C++ in your browser with no installation needed. This is great for experimenting with small code snippets, but for building real projects you'll eventually want a local setup."
---

# How to Set Up C++: Install a Compiler and Write Your First Program

Before you can write C++, you need two things: a **compiler** (which turns your `.cpp` source file into a runnable program) and a **code editor** to write in. This guide walks you through the full setup on Windows, Mac, and Linux — and gets you to a working "Hello, World!" in under 15 minutes.


## Video Walkthrough

<iframe width="560" height="315" src="https://www.youtube.com/embed/hGNqwO5EAMI" title="The Best IDE for C++ Programming" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Option 0: Try It Online First (No Install Needed)

If you just want to experiment before committing to a local setup, use an online compiler:

- **[onlinegdb.com](https://www.onlinegdb.com/online_c++_compiler)** — full compiler with debugger, no account needed
- **[godbolt.org](https://godbolt.org/)** — shows you assembly output alongside your C++ code, great for learning

These are fine for learning and small snippets. When you're ready to build real projects, come back and do the local setup below.

---

## Setup on Windows

### Step 1: Install the Compiler (MinGW-w64)

Windows doesn't come with a C++ compiler. The most straightforward option for beginners is **MinGW-w64**, which gives you `g++` (the GCC compiler for Windows).

1. Go to [winlibs.com](https://winlibs.com/) and download the latest **GCC** release for Windows (choose the `x86_64` UCRT version, `.zip` format)
2. Extract the zip to `C:\mingw64`
3. Add `C:\mingw64\bin` to your system PATH:
   - Search for "Environment Variables" in the Start menu
   - Click "Environment Variables"
   - Under "System variables", find `Path`, click Edit
   - Click New and add `C:\mingw64\bin`
   - Click OK on all dialogs

4. Open a new Command Prompt and verify it worked:
```
g++ --version
```
You should see something like `g++ (GCC) 13.x.x`.

### Step 2: Install VS Code

1. Download [VS Code](https://code.visualstudio.com/) and install it
2. Open VS Code, go to Extensions (`Ctrl+Shift+X`), search for **C/C++** and install the Microsoft extension
3. Optionally install **C/C++ Extension Pack** for extra features

### Step 3: Write and Run Your First Program

1. Create a new folder called `cpp-projects` somewhere on your computer
2. Open VS Code, click File → Open Folder, and open that folder
3. Create a new file called `hello.cpp`
4. Paste this code:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

5. Open the terminal in VS Code (`Ctrl+`` ` ```)
6. Compile and run:
```
g++ hello.cpp -o hello
./hello
```

You should see `Hello, World!` printed in the terminal. You're up and running.

---

## Setup on Mac

### Step 1: Install the Compiler (Xcode Command Line Tools)

Mac comes with Apple's `clang` compiler, which is fully compatible with modern C++. Install it via the Command Line Tools package:

1. Open **Terminal** (search for it in Spotlight with `Cmd+Space`)
2. Run:
```
xcode-select --install
```
3. A dialog will appear — click Install and wait for it to finish (takes a few minutes)
4. Verify the install:
```
g++ --version
```
On Mac, `g++` is aliased to `clang++`. Either command works.

### Step 2: Install VS Code

1. Download [VS Code](https://code.visualstudio.com/) and drag it to your Applications folder
2. Open VS Code, go to Extensions (`Cmd+Shift+X`), search for **C/C++** and install the Microsoft extension

### Step 3: Write and Run Your First Program

1. Create a folder called `cpp-projects` in your home directory
2. Open VS Code and open that folder (File → Open Folder)
3. Create `hello.cpp` and paste:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

4. Open the integrated terminal (`Ctrl+`` ` ```) and run:
```
g++ hello.cpp -o hello
./hello
```

`Hello, World!` should appear. You're ready to code.

---

## Setup on Linux

Linux is the most straightforward platform for C++ development.

### Step 1: Install g++

Open a terminal and run the appropriate command for your distribution:

**Ubuntu / Debian / Linux Mint:**
```
sudo apt update && sudo apt install g++ build-essential
```

**Fedora / RHEL:**
```
sudo dnf install gcc-c++ make
```

**Arch Linux:**
```
sudo pacman -S gcc base-devel
```

Verify:
```
g++ --version
```

### Step 2: Install VS Code (optional)

VS Code is available for Linux via [code.visualstudio.com](https://code.visualstudio.com/). Install the C/C++ extension as described above. Alternatively, any text editor works — `nano`, `vim`, `gedit`, etc.

### Step 3: Write and Run

```cpp
// hello.cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

```
g++ hello.cpp -o hello
./hello
```

---

## Understanding What Just Happened

When you ran `g++ hello.cpp -o hello`, here's what the compiler did:

1. **Preprocessed** your file — expanded `#include <iostream>` to pull in the iostream header
2. **Compiled** your `.cpp` source into an object file
3. **Linked** it with the standard library to produce the final executable `hello`

The `-o hello` flag tells the compiler what to name the output file. Without it, the output is called `a.out` on Mac/Linux or `a.exe` on Windows.

## Useful Compiler Flags for Beginners

As you start writing more code, these flags are worth knowing:

```bash
# Enable warnings — catches common mistakes
g++ hello.cpp -o hello -Wall -Wextra

# Compile for C++17 (recommended modern standard)
g++ hello.cpp -o hello -std=c++17

# Both together (recommended default)
g++ hello.cpp -o hello -std=c++17 -Wall -Wextra
```

Adding `-Wall -Wextra` is particularly valuable when learning — the compiler will warn you about things that aren't errors but are often bugs.

## Next Steps

Now that your environment is working, the logical next step is understanding exactly what every line of that Hello World program means. The [C++ Hello World explained line by line](/posts/cpp-hello-world-explained/) breaks it down completely.

Or if you want the full structured path from here, follow the [C++ learning roadmap →](/learn-cpp/)