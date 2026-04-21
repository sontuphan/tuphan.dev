+++
tags = "backend"
date = "13 June, 2025"
+++

# Rust Traits Cheatsheet

I mean... I don't know!!! The cheatsheet looks stupid but it might cover 80% of ideas supporting the Rust fundamental.

## Trait Implementation

| build-time | run-time |
| ---------- | -------- |
| impl       | dyn      |

## Iteraction

| sync      | async  |
| --------- | ------ |
| Iteractor | Stream |

## Smart pointers

| single-thread | multi-thread |
| ------------- | ------------ |
| RC            | Arc          |
| RefCell       | Mutex        |

## Send & Sync

In Rust, `Send` and `Sync` are marker traits used to ensure thread safety in concurrent programs. Manualy implementing them is unsafe.

## Pin & Unpin

`Pin` & `Unpin` are to guarantee that the memory address of a value doesn't change, which is especially important for things like self-referential structs and async/await.

```rust label="Example" group="move"
let mut vec = vec![1, 2, 3];
let first = &vec[0];
vec.push(4); // ⚠️ This may reallocate vec, moving its data
println!("{}", first); // ❌ maybe invalid!
```
