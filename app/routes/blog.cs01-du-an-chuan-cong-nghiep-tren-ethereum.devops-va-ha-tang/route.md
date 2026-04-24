+++
tags = "web3, webdev, 🇻🇳"
date = "30 November, 2024"
+++

# DevOps và hạ tầng

Khái niệm CI/CD là viết tắt của Continuous Integration và Continuous Deployment. Các công việc như kiểm thử phần mềm, xuất bản SDK, triển khai DApp là các công việc lặp đi lặp lại và có tính khuôn mẫu cho các phiên bản phần mềm. Thay vì làm thủ công, ví dụ như chạy `npm publish`, ta có thể tự dộng hoá quá trình này và ta gọi là CI/CD. CI/CD giúp giảm thời gian cũng như rủi ro trong quá trình triển khai hệ thống.

Trong bài này, tự động hoá việc triển khai DApp sẽ dựa trên các điều kiện cụ thể (Ví dụ, merge nhánh `develop` vào `master`) thông qua [GitHub Actions](https://github.com/features/actions). Đồng thời, hạ tầng Cloudflare với chi phí gần như bằng 0 sẽ sử được dụng để giúp tiết kiệm.

## Xuất bản SDK

### Tạo acccess token

Trước hệt chúng ta cần một [access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens) của tài khoản [npmjs.com](https://npmjs.com) để có thể xuất bản SDK.

1. Đăng nhập [npmjs.com](https://npmjs.com).
2. Chọn vào ảnh đại diện.
3. Chọn Access Tokens.
4. Chọn Generate New Token.
5. Chọn Classic Token.
6. Đặt tên và chọn Automation.
7. Chọn Generate Token và lưu lại token sinh ra.

Sau đó ta cần thêm token vừa tạo được vào github repository.

1. Truy cập github repository của bạn. Ví dụ ở đây là [tuphan-dn/cs01-2024](https://github.com/tuphan-dn/cs01-2024).
2. Chọn Settings.
3. Chọn Secrets and variables.
4. Chọn Actions.
5. Chọn New repository secret.
6. Điền `NPM_TOKEN` vào Name và giá trị access token và trường Secret.
7. Nhấn Add secret.

### Xây dựng CI/CD

[@preview](https://github.com/tuphan-dn/cs01-2024)

Trong phần này chúng ta sẽ làm việc với repo `cs01-2024` của SDK.

> Lưu ý, repo `cs01-2024` >< repo `cs01-app-2024`

```bash
mkdir -p ./.github/workflows
```

Thêm file `release.yml` trong thư mục vừa tạo.

```yaml label="./.github/workflows/release.yml" group="sdk"
name: Automatic Deployment

on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Build the SDK
        run: pnpm build
      - name: Test the SDK
        run: pnpm test
      - name: Release the new version
        run: pnpm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Để kiểm tra process, bạn cần cập nhật lại `version` sdk lên `1.0.1` trong `package.json` và push tất cả thay đổi lên nhanh `master`. Lúc này, trong phần Actions của github repository bạn sẽ thấy [một process CI/CD](https://github.com/tuphan-dn/cs01-2024/actions/runs/12081257460/job/12081487427) được khởi chạy và follow theo các bước đã định nghĩa trong `release.yml`.

## Triển khai DApp

Khác với [Xuất bản SDK](#xuất-bản-sdk), triển khai DApp lại tương đối đơn giản khi mà đa số các bước cài đặt đã được [Cloudflare Pages](https://pages.cloudflare.com/) tự động sẵn. Lưu ý, phần này ta sẽ làm việc với repo `css01-app-2024`.

[@preview](https://github.com/tuphan-dn/cs01-app-2024)

Nhưng trước khi kết nối với Cloudflare Pages, ta cần thiết lập DApp build dưới dạng static. Ở dạng này, chúng ta không cần thiết một server để host DApp. Thay vào đó, DApp đã build dưới dạng static sẽ được lưu ở mạng CDN. Hướng tiếp cận này cho nhiều lợi điểm ví như không cần server và không phải quản lý tải, loại bỏ DDoS, chi phí bằng 0, app được load nhanh hơn...

### Build static

```ts label="vite.config.ts" group="app"
// ...

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      future: {
        // ...
      },
    }),
    tsconfigPaths(),
  ],
  // ...
})
```

### Kết nối Cloudflare

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn Workers & Pages.
3. Chọn Create.
4. Chọn Pages.
5. Chọn Connect to Git và kết nối đến repo `cs01-app-2024` của bạn.
6. Chọn Remix ở mục Framework preset.
7. Cập nhật Build command thành `pnpm build`.
8. Chọn Save & Deploy.
9. Chọn Continue to project.

Sau khi triển khai thành công, DApp sẽ chạy ở tên miền của `pages.dev`, ví dụ [https://cs01-app-2024.pages.dev/](https://cs01-app-2024.pages.dev/). Giờ đây, với mỗi cập nhật ở nhánh `master`, Cloudflare sẽ tự động cập nhật trực tiếp lên DApp thay bạn.
