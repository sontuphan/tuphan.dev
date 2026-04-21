+++
tags = "cryptography, math"
date = "5 October, 2024"
+++

# Schnorr's Procotol Cheatsheet

If a prover wants to prove it knows the discrete logarithm $x$ of some group element, Schnorr's procotol is to do it without revealing the secret $x$.

## Proof of Knowledge of Discrete Log

Given $\mathbb{G}$ is a group of prime order $q$ and the generator $g$, a prover $\mathbf{P}$ proves the discrete logarithm $x$ of $h=g^x \in \mathbb{G}$ to a verifier $\mathbf{V}$. Here the relation $\mathfrak{R} = \{ (x,h) \in \mathbb{Z}_q \times \mathbb{G} : g^x=h \}$.

$$
\begin{array}{ l c r }
\mathbf{P}(x,h=g^x) &  & \mathbf{V}(h=g^x)\\
\hline\\
r \xleftarrow{\$} \mathbb{Z}_q &  & \\
k = g^r &  & \\
 & \xrightarrow{k} & \\
 &  & c \xleftarrow{\$} \mathbb{Z}_q \\
 & \xleftarrow{c} & \\
z = r+cx &  & \\
 & \xrightarrow{z} & \\
 &  & g^z \overset{?}{=} k \cdot h^c \\
\end{array}
$$

## Non-Interactive Zero Knowledge: The Fiat-Shamir Heuristic

With a hash function $H$, the prover $\mathbf{P}$ can randomize a trusted $c$ to reduce the number of interactions.

$$
\begin{array}{ l c r }
\mathbf{P}(x,h=g^x) &  & \mathbf{V}(h=g^x)\\
\hline\\
r \xleftarrow{\$} \mathbb{Z}_q &  & \\
k = g^r &  & \\
c = H(g,h,k) &  & \\
z = r+cx &  & \\
 & \xrightarrow{(k,z)} & \\
 &  & c = H(g,h,k) \\
 &  & g^z \overset{?}{=} k \cdot h^c \\
\end{array}
$$

## Key leakage from reused $r$

If we try to use a single $r$ for several time, it will leak the secret $x$ in the interactive version. Giving $(z=r+cx,z'=r+c'x)$, we get $z-z'=(c-c')x$ or

$$
x=\frac{z-z'}{c-c'}.
$$

However, the attack no longer available in the NIZK version because the deterministic generation $c$. Giving the same $r$ will get the same outcome of $k=g^r$, then identical $c = H(g,h,k)$.

## Applied in EC

Similarly, NIZK-based Schnorr's protocol, $\mathfrak{R} = \{ (x,X) \in F_q \times E(F_q) : Gx=X \}$, is safe in EC.

$$
\begin{array}{ l c r }
\mathbf{P}(x,X=Gx) &  & \mathbf{V}(X=Gx)\\
\hline\\
r \xleftarrow{\$} F_q &  & \\
R = Gr &  & \\
c = H(G,X,R) &  & \\
z = r+cx &  & \\
 & \xrightarrow{(R,z)} & \\
 &  & c = H(G,X,R) \\
 &  & Gz \overset{?}{=} R + Xc \\
\end{array}
$$

## Schnorr Signature

Schnorr Signature is following the same principles of Schnorr's protocol. Giving an order $n$ EC with a generator $G$ over $F_q$, the signer signs a message $m$ with a keypair $(p, P=pG)$:

$$
\begin{array}{ l c r }
\mathbf{S}(p,P,m) &  & \mathbf{V}(P,m)\\
\hline\\
r \xleftarrow{\$} F_q &  & \\
R = rG &  & \\
c = H(G,P,m) &  & \\
s = r+cp &  & \\
 & \xrightarrow{(R,s)} & \\
 &  & c = H(G,P,m) \\
 &  & R\overset{?}{=} sG-cP \\
\end{array}
$$
