+++
tags = "web3, evm"
date = "5 October, 2024"
+++

# Part 2: Layer 2 Contract & Bridge Implementation

In this lesson, we will create a contract that serves two primary purposes:

1. Lock and unlock ETH on Layer 1, allowing nodes to mint or burn tokens on Layer 2 based on these actions.
2. Receive and store the sequence of block headers from Layer 2.

[@preview](https://github.com/tuphan-dn/simple-l2-tut/tree/p2)

```solidity label="Rollup.sol" group="contract"
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

struct Block {
  bytes32 prev;
  uint256 timestamp;
}

struct Tx {
  address from;
  address to;
  uint256 amount;
  bytes32 witness;
}

contract Rollup {
  bytes32 public latest =
    0xab2344d27f94c1e4753f34becf3bbe88aea4caf33c2380c85b4e4ef6f286e6d1;
  mapping(bytes32 root => Block block) chain;
  mapping(address account => mapping(bytes32 root => bool unlocked)) unlocks;

  modifier unlockable(bytes32 header) {
    require(!unlocks[msg.sender][header], 'Already unlocked.');
    require(
      chain[header].timestamp + 60 < block.timestamp,
      'Still in the challenge window.'
    );
    _;
    unlocks[msg.sender][header] = true;
  }

  modifier referable(bytes32 root, bytes32 prev) {
    require(prev == latest, 'Invalid latest block.');
    _;
    latest = root;
  }

  event Lock(address indexed account, uint256 amount);
  event Unlock(address indexed account, uint256 amount);
  event Propose(
    address indexed account,
    bytes32 indexed root,
    bytes32 indexed prev
  );

  function lock() public payable {
    emit Lock(msg.sender, msg.value);
  }

  function unlock(
    uint256 amount,
    bytes32[] calldata proof
  ) public unlockable(proof[proof.length - 1]) {
    // Merkle proof here
    payable(msg.sender).transfer(amount);
    emit Unlock(msg.sender, amount);
  }

  function propose(
    bytes32 root,
    bytes32 prev,
    Tx[] calldata txs
  ) public referable(root, prev) {
    chain[root] = Block({prev: prev, timestamp: block.timestamp});
    emit Propose(msg.sender, root, prev);
  }
}
```

```json label="Rollup.json" group="contract"
[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Lock",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "prev",
        "type": "bytes32"
      }
    ],
    "name": "Propose",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Unlock",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "latest",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lock",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "prev",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "witness",
            "type": "bytes32"
          }
        ],
        "internalType": "struct Tx[]",
        "name": "txs",
        "type": "tuple[]"
      }
    ],
    "name": "propose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

## The Chain of Blocks and The Genesis Block

We define a reverse-linked list where the current block will store the previous block header, which is similar to the current structure of blockchain. Additionally, we also record the timestamp of the block's creation.

```solidity label="Rollup.sol" group="block"
struct Block {
  bytes32 prev;
  uint256 timestamp;
}

contract Rollup {
  bytes32 public latest =
    0xab2344d27f94c1e4753f34becf3bbe88aea4caf33c2380c85b4e4ef6f286e6d1;
  mapping(bytes32 root => Block block) chain;
  ...
}
```

Each block header points to this structure of block data thorugh the mapping, except for the genesis block header `0xab...d1`, which has no previous block.

## Lock

The `lock` function is a payable function that allows users to send ETH. With each transaction, it emits a `Lock` event to enable recognition by the sequencers.

```solidity label="Rollup.sol" group="lock"
contract Rollup {
  event Lock(address indexed account, uint256 amount);
  ...
  function lock() public payable {
    emit Lock(msg.sender, msg.value);
  }
}
```

On a valid `Lock` event, sequencers will mint the exact received ETH to the user. The mint is represented as a `transfer` from the zero address to the user address.

## Propose

In more efficient systems, sequencers submit compressed transaction data to the contract. However, to leverage JS ecosystem to quick development, we define a `Tx` struct and use EVM-native encoding. (See [Appendix](#appendix) for more details)

Furthermore, to keep the tutorial simple, we eliminate forks by forcing a branchless chain, where each proposed block always attaches to the latest block. Having a close look at the modifier of `referable`, `prev` must match `latest`, and `latest` is reassigned with each sucessful block. If multiple blocks are proposed, the first to arrive invalidates the the `prev` and the `latest` mismatch.

```solidity label="Rollup.sol" group="propose"
struct Tx {
  address from;
  address to;
  uint256 amount;
  bytes32 witness;
}

contract Rollup {
  event Propose(
    address indexed account,
    bytes32 indexed root,
    bytes32 indexed prev
  );
  ...
  modifier referable(bytes32 root, bytes32 prev) {
    require(prev == latest, 'Invalid latest block.');
    _;
    latest = root;
  }
  ...
  function propose(
    bytes32 root,
    bytes32 prev,
    Tx[] calldata txs
  ) public referable(root, prev) {
    chain[root] = Block({prev: prev, timestamp: block.timestamp});
    emit Propose(msg.sender, root, prev);
  }
}
```

## Unlock

The user sends a desired amount of Layer2-based ETH back to the zero address, and the transaction is bundled into a proposed block. Once the block is confirmed, the user can call `unlock` function with a valid Merkle proof, as explained in [Part 3: State Trie & Block Proposer](/blog/simple-l2-tutorial/part-3-state-trie-block-proposer).

Another problem we need to address is the potential for double-spending attacks, which can be mitigated by maintaining an unlock history. In the contract, this can be handled with a simple combination of mapping and a modifier.

```solidity label="Rollup.sol" group="unlock"
contract Rollup {
  mapping(address account => mapping(bytes32 root => bool unlocked)) unlocks;
  ...
  modifier unlockable(bytes32 header) {
    require(!unlocks[msg.sender][header], 'Already unlocked.');
    require(
      chain[header].timestamp + 60 < block.timestamp,
      'Still in the challenge window.'
    );
    _;
    unlocks[msg.sender][header] = true;
  }
  ...
  eevent Unlock(address indexed account, uint256 amount);
  ...
  function unlock(
    uint256 amount,
    bytes32[] calldata proof
  ) public unlockable(proof[proof.length - 1]) {
    // Merkle proof here
    payable(msg.sender).transfer(amount);
    emit Unlock(msg.sender, amount);
  }
}
```

It's not strictly necessary, but we still add the `Unlock` event as a convenience.

## Bridge: ETH to Layer 2

As mentioned above, with each `Lock` event, the sequencers will parse the parameters and add a transaction to mint ETH from the zero address to the user's address in the transaction pool. Here the transaction pool contains multiples transactions, which can be bundled together to form a candidate block. In Ethereum, a key-value database is used to implement the transaction pool; following that design, we will use LevelDB.

```bash label="npm" group="level"
npm i level
```

```bash label="yarn" group="level"
yarn add level
```

```bash label="pnpm" group="level"
pnpm add level
```

```ts label="bride.ts" group="pool"
import { Level } from 'level'

export const pool = new Level<Uint8Array, Uint8Array>('data/pool', {
  keyEncoding: 'buffer',
  valueEncoding: 'buffer',
})
```

Additionally, we will use `viem` to interact with the `Rollup` contract.

```bash label="npm" group="viem"
npm i viem
```

```bash label="yarn" group="viem"
yarn add viem
```

```bash label="pnpm" group="viem"
pnpm add viem
```

```ts label="bride.ts" group="bride"
import {
  createPublicClient,
  getContract,
  http,
  type Hex,
  type Log,
  zeroAddress,
} from 'viem'
import { holesky } from 'viem/chains'
import { hexToBytes } from 'ethereum-cryptography/utils'
import Tx from './tx' // See Appendix
import Contract from './contract'
import abi from '../contracts/Rollup.json'

export default class Bridge {
  constructor(public readonly address: Hex) {
    this.client = createPublicClient({
      chain: holesky,
      transport: http(
        'https://holesky.infura.io/v3/783c24a3a364474a8dbed638263dc410',
      ),
    })
  }

  get contract() {
    return getContract({
      address: this.address,
      abi: this.abi,
      client: {
        public: this.client,
      },
    })
  }

  watch = () => {
    const unwatch = this.contract.watchEvent.Lock(
      {},
      {
        onLogs: async (logs: any) => {
          const txs: Tx[] = logs.map(
            ({
              args: { account, amount },
              transactionHash,
            }: Log & {
              args: { account: Hex; amount: bigint }
            }) =>
              new Tx(
                hexToBytes(zeroAddress),
                hexToBytes(account),
                amount,
                hexToBytes(transactionHash!!),
              ),
          )
          await pool.batch(
            txs.map((tx) => ({ type: 'put', key: tx.txId, value: tx.data })),
          )
        },
      },
    )
    return unwatch
  }
}
```

The code above will listen any `Lock` events, then exacts the transaction data and adds them to the pool.

## Appendix

The abstract class of `Tx` that allows us to conviniently transform `Tx` class to contract inputs, and vice versa.

```ts label="tx.ts" group="tx"
import { randomBytes } from '@libp2p/crypto'
import { keccak256 } from 'ethereum-cryptography/keccak'
import {
  bytesToHex,
  concatBytes,
  hexToBytes,
} from 'ethereum-cryptography/utils'
import { type Hex } from 'viem'

export type TxLog = {
  from: Hex
  to: Hex
  amount: bigint
  witness: Hex
}

export const bigintToBytes = (bn: bigint) => {
  const hex = bn.toString(16).padStart(64, '0')
  return hexToBytes(hex)
}

export default class Tx {
  constructor(
    public readonly from: Uint8Array,
    public readonly to: Uint8Array,
    public readonly amount: bigint,
    public readonly witness: Uint8Array = randomBytes(32),
  ) {}

  get value() {
    return bigintToBytes(this.amount)
  }

  get txId() {
    return keccak256(this.data)
  }

  get data() {
    return concatBytes(this.from, this.to, this.value, this.witness)
  }

  static encode(tx: TxLog) {
    return new Tx(
      hexToBytes(tx.from.substring(2)),
      hexToBytes(tx.to.substring(2)),
      tx.amount,
      hexToBytes(tx.witness.substring(2)),
    )
  }

  decode(): TxLog {
    return {
      from: `0x${bytesToHex(this.from)}`,
      to: `0x${bytesToHex(this.to)}`,
      amount: this.amount,
      witness: `0x${bytesToHex(this.witness)}`,
    }
  }
}
```
