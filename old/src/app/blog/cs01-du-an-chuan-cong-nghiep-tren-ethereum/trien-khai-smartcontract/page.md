+++
tags = "web3, evm, hardhat, 🇻🇳"
date = "14 November, 2024"
+++

# Triển khai Smarcontract

Trong các trường hợp đơn giản [Remix](https://remix.ethereum.org/)[^1] là đủ cho quá trình triển khai on-chain. Tuy nhiên, với các contracts có giá trị đầu vào tính toán phức tạp thì `ignition` trong Hardhat lại phát huy điểm mạnh.

`ignition` cho phép chúng ta có thể viết các kịch bản triển khai on-chain.

[^1]: Remix là một webapp IDE cho phép phát triển smartcontract và khác với [RemixJS](https://remix.run/).

## Cài đặt

Cài và thêm `@nomicfoundation/hardhat-ignition-viem` và `dotenv/config` vào `hardhat.config.ts`.

```bash
pnpm add viem
pnpm add -D @nomicfoundation/hardhat-ignition-viem @nomicfoundation/hardhat-ignition dotenv
```

Ngoài ra ta cũng sẽ định nghĩa mạng `holesky` testnet. Ta có thể đăng ký miễn phí RPC tại [Infura](infura.io).

```ts label="hardhat.config.ts" group="install"
import type { HardhatUserConfig } from 'hardhat/config'
import { generatePrivateKey } from 'viem/accounts' // NEW
import '@nomicfoundation/hardhat-toolbox-viem'
import 'hardhat-abi-exporter'
import 'hardhat-chai-matchers-viem'
import '@nomicfoundation/hardhat-ignition-viem' // NEW
import 'dotenv/config' // NEW

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  // NEW
  networks: {
    holesky: {
      url: process.env.RPC || '',
      accounts: [process.env.PRIVKEY || generatePrivateKey()],
    },
  },
}

export default config
```

Tạo file `.env`, trong đó `<private_key>` là ví chứa Holesky-ETH[^2] của bạn, và `<api_token>` là token từ infura.

> QUAN TRỌNG! Hãy nhớ thêm `.env` vào `.gitignore` nếu chưa.

```bash label=".env" group="env"
PRIVKEY=<private_key>
RPC=https://holesky.infura.io/v3/<api_token>
```

[^2]: Xin miễn phí Holesky-ETH tại [Google Faucet](https://cloud.google.com/application/web3/faucet/ethereum/holesky).

## Kịch bản Ignition

> Có thể xoá module mẫu của hardhat, `ignition/modules/Lock.ts`.

```ts label="ignition/modules/Counter.ts" group="ignition"
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const CounterModule = buildModule('CounterModule', (m) => {
  const counter = m.contract('Counter')
  return { counter }
})

export default CounterModule
```

Triển khai on-chain với lệnh và quan sát kết quả

```bash
npx hardhat ignition deploy ignition/modules/Counter.ts --network holesky

✔ Confirm deploy to network holesky (17000)? … yes
Hardhat Ignition 🚀

Deploying [ CounterModule ]

Batch #1
  Executed CounterModule#Counter

[ CounterModule ] successfully deployed 🚀

Deployed Addresses

CounterModule#Counter - 0x25d731D13CFd24e2B9EC02229595BE7b5d1E1d6e
```

> Tìm hiểu các cài đặt khác [`ignition/module`](https://hardhat.org/ignition/docs/getting-started#creating-your-first-module).

# Phụ lục

## Troubleshoot

💸 Kiểm tra số dư của bạn có lớn hơn 0.005 Holesky-ETH.

⚙️ Lưu ý tuỳ chọn `--network holesky` trong câu lệnh triển khai on-chain.
