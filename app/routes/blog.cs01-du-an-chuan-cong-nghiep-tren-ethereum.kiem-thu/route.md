+++
tags = "web3, hardhat, 🇻🇳"
date = "10 November, 2024"
+++

# Kiểm thử

Hardhat cung cấp môi trường sandbox cho phép chúng ta kiểm thử nhanh chóng contracts trong quá trình phát triển. Đồng thời, các tiện ích đi kèm với `mocha` giúp chúng ta có nhiều hướng tiếp cận và nhiều kịch bản kiểm thử.

![Kiểm thử Sandbox](./sandbox.jpg)

Cài đặt và thêm `hardhat-chai-matchers-viem` vào `hardhat.config.ts`

```bash
pnpm add -D hardhat-chai-matchers-viem
```

```ts label="hardhat.config.ts" group="install"
import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import 'hardhat-abi-exporter'
import 'hardhat-chai-matchers-viem' // NEW

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    clear: true,
    flat: true,
  },
}

export default config
```

## Khởi tạo Fixture

> Có thể xoá file test mẫu của hardhat, `test/Lock.ts`.

Trong mỗi lần test với sandbox, `deployFixture` sẽ là cài đặt chuẩn cho các lần test đó. Với mỗi lần gọi `loadFixture(deployFixture)`, hệ thống sẽ tạo một snapshot cho lần test đó, qua lần test khác, hệ thống sự tự reset và tạo snapshot mới.

```ts label="test/Counter.ts" group="test-deploy"
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import { viem } from 'hardhat'

describe('contract', function () {
  async function deployFixture() {
    const counter = await viem.deployContract('Counter')
    const [owner, attacker] = await viem.getWalletClients()
    return { counter, owner, attacker }
  }

  describe('deploy counter', function () {
    it('deploy', async function () {
      const { counter, owner } = await loadFixture(deployFixture)
      expect(await counter.read.counter()).equal(0n)
      expect(await counter.read.owner()).hexEqual(owner.account.address)
    })
  })
})
```

Chạy kiểm thử với `counter = 0` và `owner` sẽ là địa chỉ ví chính khi khởi tạo contract,

```bash
pnpm test

> hardhat compile

Nothing to compile

  contract
    deploy counter
      ✔ deploy (516ms)

  1 passing (517ms)
```

## Tương tác với contract

Gọi `increase` để tăng `counter` lên `+1`.

```ts label="test/Counter.ts" group="test-interact"
...
import { getAddress } from 'viem'

describe('contract', function () {
  // ...
  describe('interact with counter', function () {
    it('increase', async function () {
      const { counter, owner } = await loadFixture(deployFixture)
      await expect(counter.write.increase())
        .to.emit(counter, 'Increase')
        .withArgs(getAddress(owner.account.address), 1n)
      expect(await counter.read.counter()).equal(1n)
    })
  })
})
```

Combo `emit` và `withArgs` giúp chúng ta nghe và kiểm thử sự kiện từ contract một các gọn gàng.

> Lưu ý, ta phải dùng `getAddress` để tạo address checksum cho ví (tạo chữ hoa và chữ thường trong địa chỉ ví) trước khi so sánh.

## Kiểm lỗi

Giả sử ta sử dụng một địa chỉ không phải `owner` để gọi `increase`, ta kỳ vọng lúc này contract sẽ cho ra lỗi.

```ts label="test/Counter.ts" group="test-not-interact"
// ...
import { getAddress } from 'viem'

describe('contract', function () {
  // ...
  describe('interact with counter', function () {
    it('increase', async function () {
      // ...
    })

    it('not increase', async function () {
      const { counter, attacker } = await loadFixture(deployFixture)
      await expect(
        counter.write.increase({ account: attacker.account }),
      ).to.be.revertedWithCustomError(counter, 'OwnableUnauthorizedAccount')
    })
  })
})
```

## Kết quả

```bash
pnpm test

> hardhat compile

Nothing to compile

  contract
    deploy counter
      ✔ deploy (441ms)
    interact with counter
      ✔ increase
      ✔ not increase

  3 passing (460ms)
```

# Phụ lục

## Hiểu cơ chế sandbox

Như đã trình bày ở trên, `loadFixture(deployFixture)` sẽ tạo ra một snapshot cho mỗi lần kiểm thử và reset lại cho các lần khác nhau. Để hiểu điều này ta thử thêm một kiểm thử `increase one more` ngay liền dưới `increase`

```ts label="test/Counter.ts" group="sandbox"
// ...
describe('contract', function () {
  // ...

  describe('interact with counter', function () {
    it('increase', async function () {
      // ...
    })

    it('increase one more', async function () {
      const { counter, owner } = await loadFixture(deployFixture)
      await expect(counter.write.increase())
        .to.emit(counter, 'Increase')
        .withArgs(getAddress(owner.account.address), 2n)
      expect(await counter.read.counter()).equal(2n)
    })

    // ...
  })
})
```

Không như suy nghĩ bình thường, đã tăng lên `1` ở `increase` thì "chắc" là phải thành `2` ở `increase one more`. Nhưng thực ra điều này là SAI vì `loadFixture(deployFixture)` đã reset lại trạng thái của `counter` về `0`.
Vì vậy, `increase one more` trở thành một testcase không chính xác.

## Chú ý phiên bản `chai-matcher`

Trong tài liệu của Hardhat, `@nomicfoundation/hardhat-chai-matchers` là phiên bản dành cho `hardhat-ethers`. Còn ở trong loạt bài này, khi đang dùng `hardhat-viem`, ta sẽ sử dụng `hardhat-chai-matchers-viem`.
