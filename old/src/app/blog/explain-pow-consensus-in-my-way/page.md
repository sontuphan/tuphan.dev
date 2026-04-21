+++
tags = "web3"
date = "10 October, 2024"
+++

# Explain PoW Consensus In My Way

The first time I read the definition of Proof-of-Work (PoW), it was explained as all nodes competitively solving a hash puzzle, but no one told me the reason behind it. Here's what I've figured out.

## Consensus is not originally a native definition in web3

In fact, the term of consensus was first introduced in Distributed Systems[^1] (i.e., database sharding, world clock synchronization, .etc), where multiple machines (also known as nodes) collaborate to perform tasks.

To keep the process synchorized (a common strategy in blockchains), nodes need to appoint a leader somehow so that the leader can tell them when/how the collaboration should start.

The simplest form of leader election is a random walk. Concretely, each nodes runs a random countdown, and the first node to reach the timeout gets to lead the current round of collaboration.

[^1]: Different from Decentralized Systems.

## Conflict of Interest

Regarding the random walk, it's commonly used in centralized systems where consensus doesn't create any conflicts of interest. It's simply about choosing a leader and completing tasks efficiently. On the other hand, in decentralized systems like blockchain, the leader who creates a new block can be significantly rewarded. If we were to reuse the random walk consensus in such systems, nodes could exploit it by falsely declaring themselves as the leader as soon as possible to claim the reward.

Now, PoW starts to sound more resonable, as it can be seen as a steroid version of a random walk. It's probabilistically random to find the solution of a [zero-leading hash problem](https://en.bitcoin.it/wiki/Proof_of_work), ensuring fairness and reducing the chances of exploitation..

![*le satoshi: kkkkkkkkk](./pow.jpg)
