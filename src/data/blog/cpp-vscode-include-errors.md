---
title: "How to Fix '#include errors detected' in VS Code (C++)"
description: "Fix #include errors detected and cannot open source file iostream in VS Code: install a compiler, then point the C/C++ extension at it. Step by step."
pubDatetime: 2026-10-17T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "setup", "errors"]
draft: false
featured: false
faqSchema:
  - question: "What does #include errors detected. Please update your includePath mean?"
    answer: "The C/C++ extension's IntelliSense cannot find the header files your code includes, usually because no compiler is installed or the extension does not know which compiler to use. It is an editor problem, so your code may still compile."
  - question: "How do I fix cannot open source file iostream in VS Code?"
    answer: "Install a compiler, then run C/C++: Select IntelliSense Configuration from the Command Palette and choose it. Or open C/C++: Edit Configurations (UI) and set Compiler path to the full path of g++.exe."
  - question: "Should I add the compiler's include folder to includePath?"
    answer: "No. Set compilerPath instead and the extension asks the compiler where its standard headers are. Microsoft recommends against adding system include paths by hand. includePath is for your own extra header folders."
  - question: "My code compiles but VS Code still shows the error. Why?"
    answer: "IntelliSense uses its own configuration, separate from your build. Make sure compilerPath points at the same compiler you build with, then reload the VS Code window."
---

# How to Fix "#include errors detected" in VS Code (C++)

**Short answer:** VS Code's C/C++ extension can't find the standard library headers, because it doesn't know which compiler you're using — or there isn't one installed yet. Install a compiler, then point the extension at it with **C/C++: Select IntelliSense Configuration**. Don't paste folders into `includePath` by hand.

You'll usually see these two together, with a red squiggle under `#include <iostream>`:

```
#include errors detected. Please update your includePath. Squiggles are disabled for this translation unit
cannot open source file "iostream"
```

---

## First: Does Your Code Actually Compile?

These errors come from **IntelliSense** — the editor's live code checking — not from the compiler. They're two separate things, so check which one is broken. Open the terminal in VS Code (**Terminal → New Terminal**) and compile:

```
g++ main.cpp -o main
```

- **It compiles:** your compiler works and only the editor is confused. Skip to [Step 2](#step-2-point-the-cc-extension-at-your-compiler).
- **`'g++' is not recognized`:** there's no working compiler yet. Fix that first — see [how to fix 'g++ is not recognized'](/posts/cpp-g-plus-plus-not-recognized/) — then come back.

## Step 1: Install a Compiler

VS Code is an editor. It doesn't come with a C++ compiler, and IntelliSense needs one: it asks the compiler where the standard headers like `iostream` live.

| System | What to install |
|---|---|
| Windows | MinGW-w64, through WinLibs or MSYS2 — see the [setup guide](/posts/cpp-setup-guide/) |
| Mac | Apple's command line tools: `xcode-select --install` |
| Linux | `sudo apt install build-essential` (Ubuntu and Debian) |

After installing, **quit VS Code completely and reopen it** so it picks up the new compiler.

<div class="inline-cta"><strong>Just getting set up?</strong> Once your editor works, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> takes you through the fundamentals — with pointers, memory and OOP explained properly — in 87 plain-English pages. Just $19.</div>

## Step 2: Point the C/C++ Extension at Your Compiler

1. Press **Ctrl+Shift+P** (Cmd+Shift+P on a Mac) to open the Command Palette.
2. Type **Select IntelliSense Configuration** and choose **C/C++: Select IntelliSense Configuration**.
3. Pick your compiler from the list — for MinGW, the entry for `g++.exe`.

If you see a yellow **Configure IntelliSense** button in the status bar at the bottom, clicking it opens the same list.

**If the list is empty,** the extension couldn't find a compiler. Make sure the compiler's `bin` folder is on your PATH and reopen VS Code, or set the path by hand in Step 3.

## Step 3: Or Set the Compiler Path by Hand

Open the Command Palette and run **C/C++: Edit Configurations (UI)**. Find **Compiler path** and enter the full path to your compiler:

| Setup | Compiler path |
|---|---|
| MSYS2 (UCRT64) | `C:/msys64/ucrt64/bin/g++.exe` |
| WinLibs (our setup guide) | `C:/mingw64/bin/g++.exe` |
| Mac | `/usr/bin/clang` |
| Linux | `/usr/bin/g++` |

VS Code saves this in `.vscode/c_cpp_properties.json` inside your project folder. You can also edit that file directly (**C/C++: Edit Configurations (JSON)**). A working Windows version looks like this:

```json
{
  "configurations": [
    {
      "name": "Win32",
      "includePath": ["${workspaceFolder}/**"],
      "compilerPath": "C:/msys64/ucrt64/bin/g++.exe",
      "cppStandard": "c++20",
      "intelliSenseMode": "windows-gcc-x64"
    }
  ],
  "version": 4
}
```

Use forward slashes in the path, or double every backslash (`C:\\msys64\\...`) — a single backslash isn't valid in JSON.

## Why You Shouldn't Paste Folders into includePath

Plenty of old answers tell you to copy folders like `.../lib/gcc/x86_64-w64-mingw32/13.2.0/include/c++` into `includePath`. That can work — until you update the compiler and the version number in the folder changes.

Microsoft's documentation recommends against adding system include paths by hand for the compilers it supports. Set `compilerPath` instead, and the extension asks the compiler where its headers are.

`includePath` is for **your own** extra header folders, such as a library you downloaded. The default `${workspaceFolder}/**` already covers every header inside your project.

## Still Seeing Squiggles?

**VS Code was open when you installed the compiler.** Quit it completely and reopen it, or run **Developer: Reload Window** from the Command Palette.

**The wrong compiler is selected.** The extension may have picked a different compiler, such as Visual Studio's `cl.exe`, or one you've since uninstalled. Run **C/C++: Select IntelliSense Configuration** again and choose the compiler you actually build with.

**You opened a file instead of a folder.** Use **File → Open Folder** on your project folder. The `.vscode` settings and `${workspaceFolder}` only work when a folder is open.

**The squiggle is only on your own header**, like `#include "player.h"`. That's not a compiler problem. Check the spelling, check the file is in your project folder, and use quotes, not angle brackets, for your own headers. See [header files in C++](/posts/cpp-header-files/).

## Using Visual Studio Instead?

Visual Studio (the full IDE, not VS Code) shows `E1696 cannot open source file "iostream"` when its C++ tools aren't installed. The fix: open **Visual Studio Installer**, click **Modify**, tick **Desktop development with C++**, and install.

## Quick Reference

| Symptom | Fix |
|---|---|
| `'g++' is not recognized` in the terminal | [Install a compiler and fix PATH](/posts/cpp-g-plus-plus-not-recognized/) first |
| Code compiles, but squiggles remain | **C/C++: Select IntelliSense Configuration** and pick your compiler |
| The compiler list is empty | Set **Compiler path** in **C/C++: Edit Configurations (UI)** |
| Just installed a compiler | Quit and reopen VS Code |
| Only your own header is underlined | Check its name, its location and the quotes |
| Visual Studio shows E1696 | Install the **Desktop development with C++** workload |

---

## Take Your C++ Further

Once VS Code is happy, the real learning starts. The **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** takes you through the fundamentals in plain English, then the parts that trip beginners up most — pointers, memory and OOP. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

- [How to Set Up C++](/posts/cpp-setup-guide/) — install a compiler and VS Code, step by step.
- [How to Fix 'g++ is not recognized'](/posts/cpp-g-plus-plus-not-recognized/) — when the terminal can't find your compiler.
- [How to Run a .cpp File](/posts/how-to-run-cpp-file/) — compile and run from VS Code or the terminal.
- [Header Files in C++](/posts/cpp-header-files/) — how #include works.
- [Online C++ Compilers](/posts/cpp-online-compiler/) — code in your browser with nothing to configure.
