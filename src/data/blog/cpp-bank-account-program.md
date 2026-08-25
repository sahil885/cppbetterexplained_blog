---
title: "Bank Account Program in C++: A Complete OOP Project"
description: "Build a bank account program in C++ using classes. Learn encapsulation, constructors, and validation with full working code you can compile and extend."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "oop", "projects", "tutorial"]
faqSchema:
  - question: "How do you write a bank account program in C++?"
    answer: "Create a class with private members for the account number, holder name, and balance, then add public methods for deposit, withdraw, and displaying details. Keeping the balance private is the key step, because it forces every change to go through methods that can reject invalid amounts."
  - question: "Why should the balance be a private member?"
    answer: "A public balance can be set to any value from anywhere in the program, including negative numbers, with no way to trace what changed it. Making it private means the only way to modify it is through deposit and withdraw, so all the validation rules live in one place you can trust."
  - question: "How do you handle multiple accounts in C++?"
    answer: "Store the account objects in a std::vector<Account>, which grows as new accounts are opened and lets you loop over every account to display or search. For lookup by account number, a std::map<int, Account> is faster since it finds an account directly instead of scanning."
draft: false
featured: false
---

# Bank Account Program in C++: A Complete OOP Project

A bank account is the textbook example of object-oriented programming for a good reason: it has data that must never be corrupted (the balance) and rules about how it can change (you cannot withdraw more than you have). That is exactly the problem classes were invented to solve.

This project builds one from scratch and explains **why** each design decision matters.

---

## Why Not Just Use Variables?

You could write this with a `double balance` and a couple of functions. Here is what goes wrong:

```cpp
double balance = 500.0;
// ... 200 lines later, in some unrelated function ...
balance = -9999;   // nothing stops this
```

Nothing in the language prevents any part of your program from setting the balance to nonsense. When a bug appears, every line that touches `balance` is a suspect.

A [class](/posts/cpp-classes-and-objects/) fixes this by making the balance **private** — unreachable from outside — and offering a small set of public methods as the only doors in. If the balance is ever wrong, the bug is inside one of those methods. That is **encapsulation**, and it is the whole point of the exercise.

---

## The Account Class

```cpp
#include <iostream>
#include <string>
#include <iomanip>

class Account {
private:
    int accountNumber;
    std::string holderName;
    double balance;

public:
    // Constructor: an account cannot exist without these three things.
    Account(int number, const std::string& name, double initialDeposit)
        : accountNumber(number), holderName(name), balance(0.0) {
        if (initialDeposit > 0)
            balance = initialDeposit;
    }

    bool deposit(double amount) {
        if (amount <= 0) {
            std::cout << "Deposit must be positive.\n";
            return false;
        }
        balance += amount;
        return true;
    }

    bool withdraw(double amount) {
        if (amount <= 0) {
            std::cout << "Withdrawal must be positive.\n";
            return false;
        }
        if (amount > balance) {
            std::cout << "Insufficient funds. Balance is "
                      << balance << ".\n";
            return false;
        }
        balance -= amount;
        return true;
    }

    // const: this method promises not to change the object.
    double getBalance() const { return balance; }
    int getNumber() const { return accountNumber; }
    std::string getName() const { return holderName; }

    void display() const {
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "#" << accountNumber << "  "
                  << holderName << "  $" << balance << "\n";
    }
};
```

Several decisions here are worth pausing on.

**The constructor takes all three values.** There is no default constructor, so it is impossible to create an account with no number and no owner. The compiler enforces your rules for you. Notice the [member initializer list](/posts/cpp-initializer-list/) after the colon — that initialises members directly rather than assigning to them afterwards.

**`deposit` and `withdraw` return `bool`.** The caller can check whether the operation actually happened. Returning `void` would leave the caller guessing.

**The getters are marked `const`.** That tells the compiler — and every reader — that calling `getBalance()` cannot modify the account. It also means you can call these on a `const Account&`, which you will need the moment you pass accounts to functions efficiently. More on this in the [const keyword guide](/posts/cpp-const-keyword/).

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Using One Account

```cpp
int main() {
    Account acc(1001, "Ana Sharma", 500.0);

    acc.display();

    acc.deposit(250.0);
    acc.withdraw(100.0);
    acc.withdraw(10000.0);   // rejected
    acc.deposit(-50.0);      // rejected

    acc.display();

    // acc.balance = 999999;  // compile error — balance is private

    return 0;
}
```

Output:

```
#1001  Ana Sharma  $500.00
Insufficient funds. Balance is 650.00.
Deposit must be positive.
#1001  Ana Sharma  $650.00
```

That commented-out line is the payoff. It does not fail at runtime with a wrong number — it **refuses to compile**. The class makes an entire category of bug impossible to write.

---

## Managing Many Accounts

A real system holds many accounts. A [vector](/posts/cpp-vector-tutorial/) of `Account` objects handles that:

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <iomanip>

// ... Account class from above ...

class Bank {
private:
    std::vector<Account> accounts;
    int nextNumber = 1001;

public:
    void openAccount(const std::string& name, double initialDeposit) {
        accounts.push_back(Account(nextNumber, name, initialDeposit));
        std::cout << "Opened account #" << nextNumber << " for " << name << "\n";
        nextNumber++;
    }

    // Returns nullptr if no such account — the caller must check.
    Account* find(int number) {
        for (Account& a : accounts)
            if (a.getNumber() == number)
                return &a;
        return nullptr;
    }

    void displayAll() const {
        std::cout << "\n--- All Accounts ---\n";
        for (const Account& a : accounts)
            a.display();

        double total = 0.0;
        for (const Account& a : accounts)
            total += a.getBalance();
        std::cout << std::fixed << std::setprecision(2);
        std::cout << "Total held: $" << total << "\n";
    }
};

int main() {
    Bank bank;

    bank.openAccount("Ana Sharma", 500.0);
    bank.openAccount("Ben Okafor", 1200.0);
    bank.openAccount("Cara Diaz", 50.0);

    Account* acc = bank.find(1002);
    if (acc != nullptr) {
        acc->deposit(300.0);
        acc->withdraw(150.0);
    } else {
        std::cout << "Account not found.\n";
    }

    bank.displayAll();

    return 0;
}
```

Output:

```
Opened account #1001 for Ana Sharma
Opened account #1002 for Ben Okafor
Opened account #1003 for Cara Diaz

--- All Accounts ---
#1001  Ana Sharma  $500.00
#1002  Ben Okafor  $1350.00
#1003  Cara Diaz  $50.00
Total held: $1900.00
```

Three details to carry into your own code:

- **`find` returns `Account*`, not `Account`.** Returning by value would hand back a *copy*, and depositing into a copy changes nothing. The pointer refers to the real object inside the vector.
- **It returns `nullptr` when nothing matches**, and `main` checks before dereferencing. Skipping that check is how you get a [segmentation fault](/posts/cpp-segmentation-fault/).
- **`for (const Account& a : accounts)`** in `displayAll` — `const` because we are only reading, `&` because copying every account on every loop iteration is wasted work.

One caution on that pointer: `push_back` can reallocate the vector, which would leave any previously returned `Account*` dangling. In a program that opens accounts while holding pointers, store `std::vector<std::unique_ptr<Account>>` instead, or look accounts up by number each time.

---

## Ideas to Extend It

The class is deliberately small so you can grow it:

1. **Transaction history** — add a `std::vector<std::string>` member and append a line in each `deposit`/`withdraw`.
2. **Savings and checking accounts** — make `Account` a base class and use [inheritance](/posts/cpp-inheritance/) with a virtual `applyMonthlyInterest()`.
3. **Save to a file** — write each account as a CSV line so balances survive between runs.
4. **An interactive menu** — wrap `Bank` in a menu loop so a user can open accounts and transfer money.
5. **Throw exceptions instead of printing** — `throw std::runtime_error("Insufficient funds")` lets the caller decide how to report the problem.

Number two is the natural next step, and it is what turns this from a class exercise into a genuine OOP project.

---

## Related Articles

- [Classes and Objects in C++](/posts/cpp-classes-and-objects/)
- [Object-Oriented Programming in C++](/posts/oop-in-cpp/)
- [Constructors and Destructors in C++](/posts/cpp-constructors-destructors/)
- [Inheritance in C++](/posts/cpp-inheritance/)
- [Blackjack in C++ Using Classes](/posts/blackjack-cpp-using-classes/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
