---
title: "Binary Tree in C++: Build One From Scratch With Full Code"
description: "Learn how to build a binary search tree in C++ from scratch. Covers the node struct, insert, search, and all three traversals with complete working code."
pubDatetime: 2026-08-25T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "data-structures", "tutorial"]
faqSchema:
  - question: "What is a binary tree in C++?"
    answer: "A binary tree is a structure made of nodes, where each node holds a value and two pointers, usually called left and right, that point to at most two child nodes. In C++ you build one with a struct containing the data plus two node pointers, and you link nodes together on the heap."
  - question: "What is the difference between a binary tree and a binary search tree?"
    answer: "A binary tree only says each node has at most two children, with no rule about which value goes where. A binary search tree adds one rule: everything in a node's left subtree is smaller than the node and everything in its right subtree is larger, which is what makes searching fast."
  - question: "What are the three binary tree traversals?"
    answer: "Inorder visits left subtree, then the node, then the right subtree, which prints a binary search tree in sorted order. Preorder visits the node first and is used to copy a tree. Postorder visits both children before the node, which is the correct order for deleting a tree."
draft: false
featured: false
---

# Binary Tree in C++: Build One From Scratch With Full Code

A [linked list](/posts/cpp-linked-list/) gives each node one `next` pointer, so your data forms a straight line. Give each node **two** pointers instead and the line branches — that is a binary tree.

That one extra pointer changes everything. A linked list of a million items takes up to a million steps to search. A well-shaped binary search tree takes about twenty.

---

## The Node: A Struct With Two Pointers

Everything starts here:

```cpp
struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};
```

Three members: the value, and two pointers to more `Node`s. The constructor sets both children to `nullptr`, which is how you say "there is nothing below me yet." A node with two null children is called a **leaf**.

A tree is just a single `Node*` pointing at the top node, called the **root**. If the root is `nullptr`, the tree is empty.

---

## Why a Binary *Search* Tree?

A plain binary tree lets you put any value anywhere, which makes it useless for lookups. A **binary search tree** (BST) adds one ordering rule:

> Every value in a node's left subtree is smaller than the node. Every value in its right subtree is larger.

Insert 50, 30, 70, 20, 40 in that order and you get:

```
            50
          /    \
        30      70
       /  \
     20    40
```

Now searching for 40 takes three comparisons instead of five: 40 is less than 50 so go left, 40 is greater than 30 so go right, found it. Every comparison throws away half the remaining tree — the same trick as [binary search](/posts/cpp-binary-search/) on a sorted array, but on a structure you can insert into cheaply.

---

## Inserting a Node

Insertion walks down from the root, going left or right based on the comparison, until it falls off the bottom of the tree. That empty spot is where the new node belongs.

```cpp
Node* insert(Node* root, int value) {
    // Fell off the tree — this is the spot.
    if (root == nullptr)
        return new Node(value);

    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    // value == root->data: already present, do nothing

    return root;
}
```

This uses a pattern worth understanding: the function **returns the subtree root**, and the caller reassigns it. When the recursion hits `nullptr` it returns a brand new node, and the line `root->left = insert(root->left, value)` in the caller wires that new node into the tree. No special-casing the empty-tree situation, no double pointers.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Searching the Tree

Searching is the same walk without the insertion:

```cpp
bool search(Node* root, int value) {
    if (root == nullptr)
        return false;             // ran out of tree
    if (root->data == value)
        return true;
    if (value < root->data)
        return search(root->left, value);
    return search(root->right, value);
}
```

Each call descends one level, so the cost is the **height** of the tree. For a balanced tree that is O(log n). For a tree built by inserting already-sorted data — 10, 20, 30, 40 — every node ends up as a right child, the tree collapses into a linked list, and search degrades to O(n). That degenerate case is why real code uses self-balancing trees like the red-black tree behind [std::map](/posts/cpp-map-unordered-map/).

---

## The Three Traversals

Traversal means visiting every node. The only question is *when* you handle the current node relative to its children — and that one choice gives you three different useful orders.

```cpp
void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    std::cout << root->data << " ";   // node in the middle
    inorder(root->right);
}

void preorder(Node* root) {
    if (root == nullptr) return;
    std::cout << root->data << " ";   // node first
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    std::cout << root->data << " ";   // node last
}
```

Each one is useful for a different job:

| Traversal | Order on the tree above | Use it for |
|-----------|------------------------|------------|
| Inorder | 20 30 40 50 70 | Printing a BST in **sorted order** |
| Preorder | 50 30 20 40 70 | Copying or serialising a tree |
| Postorder | 20 40 30 70 50 | **Deleting** a tree safely |

Inorder printing sorted output is not a coincidence — it falls directly out of the BST rule. Everything smaller is on the left, so visiting the left subtree first means every smaller value is printed before the node.

---

## The Complete Program

```cpp
#include <iostream>

struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int value) {
    if (root == nullptr)
        return new Node(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

bool search(Node* root, int value) {
    if (root == nullptr) return false;
    if (root->data == value) return true;
    if (value < root->data) return search(root->left, value);
    return search(root->right, value);
}

void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    std::cout << root->data << " ";
    inorder(root->right);
}

int height(Node* root) {
    if (root == nullptr) return 0;
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

// Postorder: free the children before freeing the parent.
void destroy(Node* root) {
    if (root == nullptr) return;
    destroy(root->left);
    destroy(root->right);
    delete root;
}

int main() {
    Node* root = nullptr;

    int values[] = {50, 30, 70, 20, 40, 60, 80};
    for (int v : values)
        root = insert(root, v);

    std::cout << "Inorder (sorted): ";
    inorder(root);
    std::cout << "\n";

    std::cout << "Height: " << height(root) << "\n";
    std::cout << "Search 40: " << (search(root, 40) ? "found" : "not found") << "\n";
    std::cout << "Search 55: " << (search(root, 55) ? "found" : "not found") << "\n";

    destroy(root);
    return 0;
}
```

Output:

```
Inorder (sorted): 20 30 40 50 60 70 80
Height: 3
Search 40: found
Search 55: not found
```

---

## Do Not Forget to Free the Tree

Every `new Node(value)` allocates on the heap, and nothing frees it automatically. That is what `destroy` is for — and notice it must be **postorder**. If you `delete root` first and then try `destroy(root->left)`, you are reading a pointer out of memory you already returned to the system, which is undefined behaviour and a classic source of [segmentation faults](/posts/cpp-segmentation-fault/).

In production code you would sidestep the whole problem with [smart pointers](/posts/smart-pointers-cpp/):

```cpp
struct Node {
    int data;
    std::unique_ptr<Node> left;
    std::unique_ptr<Node> right;

    Node(int value) : data(value) {}
};
```

Now deleting the root automatically deletes the entire tree beneath it, and `destroy` disappears. Learn the raw-pointer version first so you understand what the smart pointer is doing for you — then use the smart pointer.

---

## Related Articles

- [Linked List in C++](/posts/cpp-linked-list/)
- [Pointers in C++](/posts/pointers-in-cpp/)
- [Recursion in C++](/posts/cpp-recursion-tutorial/)
- [Smart Pointers in C++](/posts/smart-pointers-cpp/)
- [Structs in C++ Explained](/posts/cpp-structs-explained/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
