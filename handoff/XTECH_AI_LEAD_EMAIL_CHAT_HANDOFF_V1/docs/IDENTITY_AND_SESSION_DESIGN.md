# Identity & Session Design

Định danh:
- `deviceId`: mã first-party cho trình duyệt/thiết bị.
- `leadId`: hồ sơ lead.
- `conversationId`: luồng tư vấn AI.
- `contactId`: khách đã được hợp nhất/xác thực.

Quan hệ:

Device(s) → Contact → Lead → Conversation(s)

Quy tắc:
- `deviceId` chỉ hỗ trợ continuity, không phải cơ chế đăng nhập.
- Một khách có thể dùng nhiều thiết bị.
- Link email dùng signed token có thời hạn.
- Không đặt email/số điện thoại trong URL.
