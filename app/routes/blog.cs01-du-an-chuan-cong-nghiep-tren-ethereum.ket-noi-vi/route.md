+++
tags = "web3, evm, 🇻🇳"
date = "26 November, 2024"
+++

# Kết nối ví

Theo thống kê, hiện nay có từ 300-500 ví crypto. Việc tích hợp một số lượng ví đa dạng cho DApp và bảo trì, cập nhật là rất tốn công sức. Thay vì phải làm điều này từ đầu, chúng ta có thể sử dụng các bộ kit có sẵn và không phải quan tâm quá sâu vào quá trình tích hợp ví đơn lẻ.

Có khá nhiều bộ kit ví dụ như [Rainbowkit](https://www.rainbowkit.com/), [Onchainkit](https://onchainkit.xyz/) của Coinbase, [Wallet SDK](https://portal.thirdweb.com/wallet-sdk/v2?ref=blog.thirdweb.com) của thirdweb.... Tuy nhiên, trong phạm vi bài viết chúng ta sẽ chỉ sử dụng một trong các bộ kit trên và là Rainbowkit.

![RainbowKit](./rainbowkit.png)

## Wallet Provider

```bash
pnpm add @rainbow-me/rainbowkit wagmi @tanstack/react-query
mkdir ./app/providers
```

Tạo file `wallet.provider.tsx` trong thư mục `providers` vừa được tạo. Ngoài ra, chúng ta cũng sẽ cập nhật lại `configs.ts` để hỗ trợ multichain.

```tsx label="app/providers/wallet.provider.tsx" group="provider"
import { type ReactNode } from 'react'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { http, WagmiProvider } from 'wagmi'
import { mainnet, holesky } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import configs from '~/configs'

import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'Onchain Counter',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, holesky],
  transports: {
    [mainnet.id]: http(configs.mainnet),
    [holesky.id]: http(configs.holesky),
  },
  ssr: true,
})
const queryClient = new QueryClient()

export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

```ts label="app/configs.ts" group="provider"
export const env = process.env.NODE_ENV

const configs: Record<typeof env, { mainnet: string; holesky: string }> = {
  development: {
    holesky: 'https://holesky.infura.io/v3/783c24a3a364474a8dbed638263dc410',
    mainnet: 'https://mainnet.infura.io/v3/783c24a3a364474a8dbed638263dc410',
  },
  test: {
    holesky: '',
    mainnet: '',
  },
  production: {
    holesky: 'https://holesky.infura.io/v3/783c24a3a364474a8dbed638263dc410',
    mainnet: 'https://mainnet.infura.io/v3/783c24a3a364474a8dbed638263dc410',
  },
}

export default configs[env]
```

> `projectId` để có thể làm việc với WalletConnect. Nếu bạn muốn hỗ trợ WalletConnect thì có thể đăng ký miễn phí `projectId` tại [WalletConnect Cloud](https://cloud.walletconnect.com/).

Thêm `WalletProvider` vào `root.tsx`.

```tsx label="app/root.tsx" group="root"
// ...
import WalletProvider from '~/providers/wallet.provider.tsx'
// ...
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
// ...
```

## Sử dụng wagmi hooks

Trong bài trước, để tương tác onchain thì chúng ta đã tạo `publicClient` thông qua hàm `createPublicClient`. Tuy nhiên với việc hỗ trợ multichain, chúng ta cần phải viết lại việc nhận dạng chain hiện tại để thay đổi các cài đặt tương ứng cho hàm `createPublicClient` và điều này là không hề nhanh. May thay, wagmi (đi kèm theo với RainbowKit) đã cũng cấp một "encaplsulated" hook tên là `usePublicClient` và xử lý toàn bộ các luận lý phức tập nêu trên. Ta sẽ thử cập nhật lại `routes/_index.tsx` với hướng tiệp cập này.

```tsx label="app/routes/_index.tsx" group="wagmi"
import type { MetaFunction } from '@remix-run/node'
import { ABI, ADDRESS } from 'cs01-2024'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const meta: MetaFunction = () => {
  return [
    { title: 'Web3 Counter' },
    {
      name: 'description',
      content:
        'Bài 5. Giao diện DApp | CS01: Dự án chuẩn công nghiệp trên Ethereum | 2024',
    },
  ]
}

export default function Index() {
  const [counter, setCounter] = useState('0')
  const publicClient = usePublicClient()

  const contract = useMemo(() => {
    if (!publicClient) return undefined
    return getContract({
      address: ADDRESS,
      abi: ABI,
      client: { public: publicClient },
    })
  }, [publicClient])

  const fetchCounter = useCallback(async () => {
    const counter = await contract?.read.counter()
    return setCounter(counter?.toString() || '...')
  }, [contract])

  useEffect(() => {
    fetchCounter()
  }, [fetchCounter])

  return (
    <div className="w-full min-h-dvh flex flex-col gap-4 items-center justify-center">
      <p>
        <span className="opacity-60">Counter: </span>
        <span className="font-black">{counter}</span>
      </p>
      <button className="btn btn-primary">Increase</button>
    </div>
  )
}
```

> ⚠️ Có khả năng cao là bạn sẽ gặp lỗi vì lý do sau khi cập nhật, chain mặc định đang là mainnet trong khi contract của chúng ta hiện chỉ có trên holesky. Đừng quá lo vì mọi thứ vẫn đang đi đúng hướng.

## Connection Button

Tạo file `header.tsx` trong `app`. Sau đó, thiết lập `Header` vào template của `App`.

```tsx label="app/header.tsx" group="header"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link } from '@remix-run/react'

export default function Header() {
  return (
    <div className="w-full sticky t-0 bg-base-100 p-4 flex flex-row gap-4 items-center">
      <Link className="bg-primary w-10 h-10 rounded-full shadow" to="/" />
      <div className="grow" />
      <ConnectButton />
    </div>
  )
}
```

```tsx label="app/root.tsx" group="header"
// ...
export default function App() {
  return (
    <div className="w-full min-h-dvh flex flex-col justify-center">
      <Header />
      <div className="grid grid-cols-1 grow">
        <div className="col-span-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
```

Chúng ta được giao diện với thanh `Header` và nút `Connect Wallet`. Lúc này, ta đã có thể kết nối ví và chọn mạng `holesky`.

![Header cùng với nút Connect Wallet.](./header.png)

![Thực hiện kết nối ví Metamask và switch sang mạng Holesky.](./wallet.png)

## Tương tác onchain

Giờ đây với việc kết nối ví thành công, nó cho phép chúng ta có thể tương tác nhiều hơn với smartcontract và cụ thể trong ví dụ này sẽ là gọi hàm `increase` từ contract `Counter`.

```bash
pnpm add clsx
```

```tsx label="app/routes/_index.tsx" group="increase"
import clsx from 'clsx'
// ...
export default function Index() {
  // ...
  const increaseCounter = useCallback(async () => {
    if (!contract) return ''
    const txId = await contract.write.increase()
    return txId
  }, [contract])
  // ...
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <p>
        <span className="opacity-60">Counter: </span>
        <span className="font-black">{counter}</span>
      </p>
      <button
        className={clsx('btn btn-primary', {
          'btn-disabled': !contract,
          'btn-error': !!error,
        })}
        onClick={increaseCounter}
      >
        Increase
      </button>
    </div>
  )
}
```

🎉 Nhấn `Increase` và ký transaction. Chờ đến khi transaction được xác nhận chúng ta có thể refresh lại ứng dụng và nhận được giá trị `counter` mới cập nhật lên `2`.

Đồng thời chúng ta cũng có thể thấy, mỗi lần muốn cập nhật lại giá trị `counter`, chúng ta buộc phải refresh lại ứng dụng. Để cải thiện lại trải nghiệm người dùng, hãy thử realtime hoá ứng dụng ở phần tiếp theo.

## Ứng dụng thời gian thực

```tsx label="app/routes/_index.tsx" group="watch"
// ...
export default function Index() {
  // ...
  const watchCounter = useCallback(() => {
    return contract?.watchEvent.Increase(
      {},
      {
        onLogs: ([
          {
            args: { counter },
          },
        ]) => {
          return setCounter(counter?.toString() || '...')
        },
      },
    )
  }, [contract])
  // ...
  useEffect(() => {
    return watchCounter()
  }, [watchCounter])
  // ...
}
```

Lưu ý, cần thiết phải `return` ở `userEffect`. Vì hàm `watchCounter` sẽ trả về một hàm `unwatch`, nghĩa là `useEffect` sẽ chạy `unwatch` ở mỗi lần rerender và tránh memory leaks.

## Kết luận

Như vậy chúng ta đã đi qua hết 6 bài chính về xây dựng DApp. Bạn có thể theo dõi lại toàn bộ DApp hoàn chỉnh ở repo bên dưới. Ở bài tiếp theo, chúng ta sẽ hoàn thiện các quy trình về DevOps để tăng tốc và nâng cao tính tin cậy cho việc publish ứng dụng cho người dùng.

[@preview](https://github.com/tuphan-dn/cs01-app-2024)
