+++
tags = "web3, 🇻🇳"
date = "10 October, 2024"
+++

# Giải Thích PoW Theo Một Hướng Khác

Trong lần đầu khi đọc định nghĩa của Proof-of-Work (PoW), hầu hết các tài liệu chỉ nhắc tới việc các nốt phải tranh nhau tìm ra lời giải cho một câu đố chuỗi hash mà không hề nhắc gì đến lý do đằng sau. Vì vậy mình sẽ thử giải thích điều này một cách có lý luận hơn.

## Consensus hay Luật đồng thuận không phải là từ gốc có nguồn trong web3

Thực tế, khái niệm luật đồng thuận lần đầu được giới thiệu ở các hệ thống phần tán[^1] (distributed systems) (ví dụ như sharding trong cơ sở dữ liệu, hay đồng bộ đồng hồ thế giới, ...), trong đó nhiều máy tính (hay nốt) cần hợp tác và thực thi các nhiệm vụ cụ thể.

Để giữ cho tiến trình được đồng bộ (chiến lược phổ biến trong blockchain), các nốt cần bầu một trưởng nhóm bằng cách nay hay cách khác, từ đó trưởng nhóm sẽ cho biết khi nào và làm sao để quá trình hợp tác bắt đầu.

Một dạng đơn giản nhất của bầu trưởng nhóm là dùng bộ đếm ngẫu nhiên. Cụ thể, mỗi nốt sẽ chạy một bộ đếm ngược ngẫu nhiên, nốt đầu tiên đếm đến 0 sẽ được chọn là trưởng nhóm cho vòng tính toán hiện thời.

[^1]: Phân biệt với hệ thống phi tập trung, decentralized systems.

## Xung đột lợi ích

Đối với bộ đếm ngược, nó có thể được dùng phổ biến trong các hệ thống tập trung nơi mà luật đồng thuận không tạo nên bất kì xung đột lợi ích nào. Nó chỉ đơn giản là chọn lựa một trưởng nhóm để hoàn thành các nhiệm vụ một các hiệu quả. Tuy nhiên, trong các hệ thống phi tập trung ví như blockchain, trưởng nhóm sẽ là người tạo ra block mới và được nhận một phần thưởng tương đối lớn. Nếu chúng ta vẫn sử sụng bộ đếm ngược trong các hệ thống như vậy, các nốt sẽ cố gắng khai thác việc báo giả bộ đếm để khiến họ trở thành trưởng nhóm và lãnh thưởng.

Giờ thì PoW bắt đầu nghe có vẻ có lý khi nó "ngờ ngợ" như một phiên bản chích steroid của bộ đếm ngược. Thực vậy, để giải [câu đố hash với số các 0 ở đầu](https://en.bitcoin.it/wiki/Proof_of_work) là ngẫu nhiên về mặt xác suất từ đó đảm bảo tính công bằng và giảm thiểu khả năng bị lợi dụng.

![*le satoshi: kkkkkkkkk](../blog.explain-pow-consensus-in-my-way/pow.jpg)
