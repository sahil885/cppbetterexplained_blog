---
title: "C++ Program to Count Words in a String (4 Approaches Explained)"
description: "Learn how to count the words in a string in C++ using stringstream, a manual loop, getline with delimiters, and how to count word frequency with a map."
pubDatetime: 2026-09-05T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "strings", "tutorial"]
faqSchema:
  - question: "How do you count words in a string in C++?"
    answer: "The cleanest way is to put the string into a std::istringstream and read words out of it with the extraction operator into a temporary std::string, incrementing a counter each time. The stream skips whitespace automatically, so multiple spaces and tabs are handled for you."
  - question: "How do I count words without using stringstream in C++?"
    answer: "Walk the string one character at a time and track whether you are currently inside a word. Increment the counter each time you move from a whitespace character to a non-whitespace character. This counts the number of word beginnings, which is exactly the number of words."
  - question: "Why does my C++ word counter give the wrong result with double spaces?"
    answer: "If you count spaces and add one, then two spaces in a row are counted as two word separators even though there is only one gap. Counting word starts instead of separators fixes this, as does using a stringstream, which skips runs of whitespace automatically."
draft: false
featured: false
---

# C++ Program to Count Words in a String

Counting words sounds trivial until you meet the input `"  hello   world  "`. Where exactly does a word start? What about tabs, newlines, or an empty string?

Below are four approaches, from the shortest to the most flexible, with an explanation of the off-by-one bug that catches nearly everyone.

---

## Method 1: stringstream (The Clean Way)

```cpp
#include <iostream>
#include <sstream>
#include <string>

int countWords(const std::string& text) {
    std::istringstream stream(text);
    std::string word;
    int count = 0;

    while (stream >> word) {
        ++count;
    }
    return count;
}

int main() {
    std::string line;
    std::cout << "Enter a sentence: ";
    std::getline(std::cin, line);

    std::cout << "Word count: " << countWords(line) << "\n";
    return 0;
}
```

Try it with `   C++   is    fun   ` and it correctly reports 3.

Why does this handle the messy cases for free? Because `>>` on any stream **skips leading whitespace, reads until the next whitespace, and stops**. Runs of spaces, tabs and newlines all look identical to it. When there's nothing left to read, the stream enters a failed state and the `while` condition becomes false. An [istringstream](/posts/cpp-stringstream/) is just a stream that reads from a string instead of the keyboard.

Note the use of [std::getline](/posts/cpp-getline-string-input/) in `main` — `std::cin >> line` would only read the first word, which rather defeats the point.

---

## Method 2: The Manual Loop (No Extra Headers)

If you want to see the logic explicitly, or your assignment forbids `<sstream>`:

```cpp
#include <iostream>
#include <string>
#include <cctype>

int countWords(const std::string& text) {
    int count = 0;
    bool inWord = false;

    for (char ch : text) {
        if (std::isspace(static_cast<unsigned char>(ch))) {
            inWord = false;                 // we've left a word
        } else if (!inWord) {
            inWord = true;                  // we've just entered a new word
            ++count;
        }
    }
    return count;
}

int main() {
    std::cout << countWords("  hello   world  ") << "\n";   // 2
    std::cout << countWords("")                  << "\n";   // 0
    std::cout << countWords("one")               << "\n";   // 1
    return 0;
}
```

The key idea is the `inWord` flag. We **count transitions from whitespace into text**, not the spaces themselves.

Compare that with the naive version most beginners write first:

```cpp
int spaces = 0;
for (char ch : text) if (ch == ' ') ++spaces;
return spaces + 1;      // ✗ wrong for "a  b" (returns 3) and for "" (returns 1)
```

Counting separators and adding one only works if there's exactly one space between every pair of words and none at the ends. Counting word *starts* has no such assumption — which is why it also gets the empty string right.

One small detail: `std::isspace` takes an `int` and its behaviour is undefined for negative values, which a `char` can be on some platforms. The `static_cast<unsigned char>` is the standard defensive cast, and `<cctype>` is where the function lives.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Method 3: Splitting on a Custom Delimiter

Sometimes "words" aren't separated by spaces at all — think of a CSV line, or a path split on `/`. The three-argument `getline` reads up to a character you choose:

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> splitOn(const std::string& text, char delimiter) {
    std::vector<std::string> parts;
    std::istringstream stream(text);
    std::string piece;

    while (std::getline(stream, piece, delimiter)) {
        if (!piece.empty()) {        // skip empty fields from repeated delimiters
            parts.push_back(piece);
        }
    }
    return parts;
}

int main() {
    auto fields = splitOn("name,age,,city", ',');

    std::cout << "Fields: " << fields.size() << "\n";   // 3
    for (const std::string& f : fields) std::cout << "[" << f << "] ";
    std::cout << "\n";                                   // [name] [age] [city]

    return 0;
}
```

Unlike `>>`, this version does *not* skip repeated delimiters — `,,` produces an empty string between them, which is exactly right for CSV where an empty field is meaningful. The `if (!piece.empty())` is us choosing to drop them. Our guide to [splitting a string in C++](/posts/cpp-split-string/) goes further into this.

---

## Method 4: Word Frequency With a map

Counting *how many* words is often step one; counting *which words* is the useful part:

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <map>
#include <cctype>
#include <algorithm>

std::string normalise(std::string word) {
    // strip punctuation, then lowercase
    word.erase(std::remove_if(word.begin(), word.end(),
                              [](unsigned char c) { return std::ispunct(c); }),
               word.end());

    std::transform(word.begin(), word.end(), word.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return word;
}

int main() {
    std::string text = "The cat sat on the mat. The mat was flat!";

    std::istringstream stream(text);
    std::map<std::string, int> frequency;
    std::string word;

    while (stream >> word) {
        word = normalise(word);
        if (!word.empty()) {
            ++frequency[word];      // creates the entry with 0 if it's new
        }
    }

    std::cout << "Unique words: " << frequency.size() << "\n";
    for (const auto& entry : frequency) {
        std::cout << entry.first << ": " << entry.second << "\n";
    }
    return 0;
}
```

Output (a `std::map` keeps its keys sorted alphabetically):

```
Unique words: 7
cat: 1
flat: 1
mat: 2
on: 1
sat: 1
the: 3
was: 1
```

The line `++frequency[word]` is doing something quietly clever. When you index a map with a key that isn't there, the map **inserts it with a value-initialised value** — `0` for an `int` — and returns a reference to it. So the increment turns a missing word into 1 and an existing word into n+1, with no `if` needed. More on this in [map and unordered_map](/posts/cpp-map-unordered-map/).

Without `normalise`, `"The"`, `"the"` and `"the."` would count as three different words — which is why the two lines that strip punctuation and lowercase matter more than they look.

---

## Which Should You Use?

- **Just need a number, input is normal text** → Method 1
- **Assignment says "no STL algorithms"** → Method 2
- **Splitting on commas, pipes, or slashes** → Method 3
- **Building a word-frequency report** → Method 4

All four are worth reading once, because the `inWord` flag pattern in Method 2 shows up everywhere in text processing — tokenisers, parsers and CSV readers all lean on it.

---

## Related Articles

- [C++ stringstream Explained](/posts/cpp-stringstream/)
- [How to Split a String in C++](/posts/cpp-split-string/)
- [Count Vowels in a String in C++](/posts/cpp-count-vowels-string/)
- [Using getline for String Input](/posts/cpp-getline-string-input/)
- [map vs unordered_map in C++](/posts/cpp-map-unordered-map/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
