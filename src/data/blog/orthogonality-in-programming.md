---
title: "Orthogonality in Programming: Why Independent Code Wins"
description: "Orthogonality in programming means changing one thing without breaking another. Learn what it is, why it matters, and how to write more independent, maintainable code."
pubDatetime: 2026-05-30T00:00:00Z
author: "Sahil"
tags: ["programming", "software-design", "best-practices", "architecture"]
draft: false
featured: false
faqSchema:
  - question: "What is orthogonality in programming?"
    answer: "Orthogonality is a design principle where components are independent of each other, so changing one component doesn't affect the others. It borrows the term from geometry, where orthogonal lines meet at right angles and move along independent axes. In code, an orthogonal design means each piece does one thing, and unrelated pieces don't interfere with one another. It is essentially the combination of high cohesion and loose coupling."
  - question: "Why is orthogonality important in software design?"
    answer: "Orthogonal code is easier to change, test, and reuse. When components are independent, a change in one place has predictable, contained effects instead of rippling through the whole system. This reduces bugs, shortens the time needed to add features, and makes individual pieces testable in isolation. Non-orthogonal systems become fragile: a small change in one area unexpectedly breaks something seemingly unrelated."
  - question: "What is the difference between orthogonality, coupling, and cohesion?"
    answer: "Cohesion measures how focused a single component is — high cohesion means it does one well-defined job. Coupling measures how dependent components are on each other — loose coupling means they barely rely on one another's internals. Orthogonality is the result of having both: components that are individually focused (cohesive) and mutually independent (loosely coupled) are orthogonal."
  - question: "How do I make my code more orthogonal?"
    answer: "Keep each module focused on a single responsibility, hide internal details behind clear interfaces, avoid global state that many parts of the program can read and write, and remove duplicate knowledge so each fact lives in exactly one place. Ask yourself: 'If I change this, what else do I have to change?' The fewer unrelated things that must change together, the more orthogonal your design."
---

# Orthogonality in Programming: Why Independent Code Wins

Some codebases are a joy to change. You tweak one thing, it does exactly what you expected, and nothing else breaks. Others are terrifying: you fix a small bug in the billing logic and somehow the login page stops working. The difference between those two experiences often comes down to a single design principle — **orthogonality**.

It's one of those ideas that sounds abstract until it clicks, and then you start seeing it everywhere. Let's make it click.

This article is based on the following video on orthogonality in programming:

<iframe width="560" height="315" src="https://www.youtube.com/embed/7xGQ-MV2c5k" title="Orthogonality in programming" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What Does "Orthogonal" Actually Mean?

The word comes from geometry. Two lines are _orthogonal_ if they meet at a right angle — like the x-axis and y-axis on a graph. The key property is that they're **independent**: you can move along the x-axis as far as you like without changing your position on the y-axis at all. The two directions don't interfere with each other.

Software borrows the term to describe the same idea. **In an orthogonal design, components are independent: changing one doesn't force changes in another.** Each piece has its own "axis" of responsibility, and moving along one axis leaves the others untouched.

The concept was popularized for programmers by Andrew Hunt and David Thomas in _The Pragmatic Programmer_, where they describe two orthogonal components as ones where "changes in one do not affect any of the others."

## A Concrete Example

Imagine a car. The steering wheel controls direction. The accelerator controls speed. These two controls are orthogonal — you can turn while going any speed, and speed up while pointing in any direction. They don't interfere.

Now imagine a badly designed car where turning the wheel also changed your speed, and pressing the accelerator also nudged you left. Every action would have unintended side effects. You'd have to think about _everything_ at once just to drive in a straight line. That's a non-orthogonal system, and it's exactly how tangled software feels to work in.

In code terms, here's a non-orthogonal design expressed in pseudocode:

```text
function saveUser(user):
    database.write(user)
    ui.refreshUserPanel()        # storage knows about the UI
    analytics.trackSignup(user)  # ...and about analytics
    email.sendWelcome(user)      # ...and about email
```

The "save user" function does one thing in name but is entangled with the database, the UI, analytics, and email. Change how the UI works, and you might have to touch this storage function. That's the warning sign.

A more orthogonal version separates the axes:

```text
function saveUser(user):
    database.write(user)         # storage does only storage

# elsewhere, independent components react on their own terms
onUserSaved -> ui.refreshUserPanel()
onUserSaved -> analytics.trackSignup(user)
onUserSaved -> email.sendWelcome(user)
```

Now storage knows nothing about the UI, analytics, or email. Each concern lives on its own axis and can change without disturbing the others.

## Orthogonality = Loose Coupling + High Cohesion

If you've heard the terms _coupling_ and _cohesion_, orthogonality is really just those two ideas working together:

- **Cohesion** is how focused a single component is. High cohesion means a module does one well-defined job, not five unrelated ones.
- **Coupling** is how much components depend on each other. Loose coupling means a module doesn't reach into another module's internals.

When you have both — focused components that don't lean on each other's guts — you get orthogonality. The two properties are the cause; orthogonality is the effect.

## Why It Matters

Orthogonal systems pay off in four big ways.

**Changes stay contained.** When components are independent, a change has a predictable blast radius. You can reason about "what does editing this affect?" and get a small, honest answer. In tangled systems, the honest answer is "who knows."

**Code becomes reusable.** A component that doesn't depend on its surroundings can be lifted out and used somewhere else. A payment module that knows nothing about your specific UI can be reused in a different app. One that's wired into a hundred unrelated details can't go anywhere.

**Testing gets easier.** Independent components can be tested in isolation. You don't need to spin up the database, the network, and the UI just to test a piece of business logic — because that logic doesn't depend on them.

**You write less and fear less.** Orthogonal design naturally pushes you toward keeping each fact in one place (closely related to the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) — Don't Repeat Yourself). Less duplication means fewer places to update and fewer chances to forget one.

## Warning Signs Your Code Isn't Orthogonal

You don't need a formal review to spot non-orthogonality. Watch for these smells:

- **The ripple effect.** A small change in one area mysteriously breaks something unrelated.
- **The "change one thing, change ten files" problem.** Adding a single field means edits scattered across the whole codebase.
- **Global state everywhere.** Many parts of the program read and write the same shared variables, so anything can affect anything.
- **Functions that do too much.** A method named for one job that quietly also logs, validates, formats, and sends email.
- **Fear of touching certain files.** When developers avoid a module because "last time I changed it, three other things broke," that module is badly coupled.

## How to Make Your Code More Orthogonal

You don't fix this with a single trick — it's a habit. A few reliable moves:

**Give each module one clear job.** If you can't describe what a component does without using "and," it may be doing too much. Split it.

**Hide internals behind interfaces.** Let components talk to each other through small, stable contracts rather than reaching into each other's data. Then internals can change freely as long as the contract holds.

**Avoid shared mutable state.** Global variables are the enemy of independence, because they create invisible links between parts of the program that look unrelated.

**Keep knowledge in one place.** When the same rule or fact appears in several spots, a change has to be made in all of them — and someday it won't be. Centralize it.

**Ask the orthogonality question constantly:** _"If I change this, what else has to change?"_ The smaller and more obvious that answer is, the better your design.

## A Word of Balance

Orthogonality is a powerful default, not a religion. Pushing it to an extreme — splitting everything into tiny, perfectly isolated pieces — can create its own complexity, with so many moving parts that the system is hard to follow. The goal isn't maximum separation for its own sake; it's _independence where independence reduces pain_. Separate the things that genuinely change for different reasons, and don't agonize over the rest.

## Summary

Orthogonality means designing your code so that components are independent — changing one doesn't break another, the same way turning a steering wheel doesn't change your speed. It's the practical result of high cohesion and loose coupling, and it pays off in code that's easier to change, reuse, and test. You don't achieve it with a single pattern; you achieve it by giving each piece one job, hiding internals behind clear interfaces, avoiding shared global state, and constantly asking, "if I change this, what else must change?"

Get that habit right, and you'll spend far less time afraid of your own codebase.
