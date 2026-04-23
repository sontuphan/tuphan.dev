+++
tags = "cryptography, math"
date = "2 February, 2026"
+++

# Block-Based Shamir Secret Sharing

Block-based Shamir Secret Sharing (Blocked-based SSS) uses $\mathrm{GF}(2^8)$ as its field, so the secret is split into a sequence of 8-bit (1-byte) blocks.

## Shamir’s Secret Sharing

You have a secret $S$. You want:

- Split into $n$ shares
- Any $t$ shares can recover $S$
- Fewer than $t$ shares reveal nothing

This is achieved with polynomials over a field.

## Why We Need a Field

The ultimate goal of choosing a finite field is to make sure interpolation and division must always work. Block-based SSS chooses $F = \mathrm{GF}(2^8)$, an irreducable polynomial field:

- 256 elements
- Each element = one byte (0–255)
- Addition = $\text{XOR}$
- Multiplication = polynomial multiply + mod primitive polynomial

For example,

$$
\text{0xB3} = \text{10110011}_2 = x^7 + x^5 + x^4 + x + 1 \in \mathrm{GF}(2^8)
$$

### $\mathrm{GF}(2^8)$ Multiplication

In $\mathrm{GF}(2^8)$, non-zero field elements form a cyclic group of size 255. We intendedly pick $g = 2$ as the generator.

Every non-zero value:

$$
a = g^{\log(a)}
$$

Multiplication:

$$
a \cdot b = g^{\log(a) + \log(b) \bmod 255}
$$

> In code, we use `exps[(logs[a] + logs[b]) % 255]`, where zero handled separately.

## Constructing the Polynomial

Block-based SSS of $t/n$ processes each byte independently. So we need to split the secret $S$ into 1-byte blocks $s_i$.

For 1-byte secret $s_i$, we choose random bytes $a_1, a_2, \dots, a_{t-1} \in \mathrm{GF}(2^8)$ to build polynomial $p(x) = s + a_1 x + a_2 x^2 + \dots + a_{t-1} x^{t-1}$.

- Degree = $t − 1$
- All coefficients are bytes

## Creating shares

For each $i$, we pick distinct non-zero values $x_1, x_2, \dots, x_n \in \mathrm{GF}(2^8)$ and compute $y_i = p(x_i)$, the share $s_i$ is $(x_i, y_i)$.

For a $k$-byte secret,

$$
[s_i] = [x_i, p_1(x_i), p_2(x_i), \dots, p_k(x_i)]
$$

, where $[s_i]$ is the $i$-th share.

### Horner's Method

Using Horner’s method, we can effectively compute $p(x)$ in code.

$$
\begin{align*}
b &\coloneqq 0 \\
b &\coloneqq b\cdot x ⊕ a_{t-1} \\
b &\coloneqq b\cdot x ⊕ a_{t-2} \\
&\dots \\
b &\coloneqq b\cdot x \oplus s \\
\end{align*}
$$

, which matches `b = multiply(b, x) ^ a[i]`, where $\oplus$ and `^` mean $\text{XOR}$.

## Secret Reconstruction

Given any $t$ shares, $[s_i]$, we compute using Lagrange interpolation:

$$
\begin{align*}
s &= p(0)\\
&= \sum_{j=1}^{t} y_j \prod^{m\ne j} \frac{x_m}{x_m - x_j}
\end{align*}
$$

, where $s \in \{s_1,\dots,s_k\}$ and $p \in \{p_1,\dots,p_k\}$.

Finally, $S = s_1 \Vert s_2 \Vert ... \Vert s_k$.

## Take-Away

Blocked-based Shamir Secret Sharing represents each secret byte as the constant term of a random polynomial over $\mathrm{GF}(2^8)$; shares are polynomial evaluations, and the secret is recovered by interpolation.
