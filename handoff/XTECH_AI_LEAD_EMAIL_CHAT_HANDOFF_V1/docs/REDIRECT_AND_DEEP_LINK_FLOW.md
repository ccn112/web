# Redirect & Deep-link Flow

Link email:

`https://x-tech.com.vn/tu-van/tiep-tuc?t={{signedResumeToken}}`

Token ánh xạ server tới `leadId`, `conversationId`, `expectedDeviceId`, `expiresAt`.

Khi mở link:
1. Frontend gửi token + currentDeviceId.
2. API kiểm tra chữ ký và TTL.
3. Đúng thiết bị: mở lịch sử chat.
4. Thiết bị mới: xác minh email bằng OTP/magic link.
5. Sau xác minh: liên kết device mới với contact và mở lịch sử.
6. Token hết hạn: phát hành token mới sau xác minh.

Route:
- `/tu-van`
- `/tu-van/tiep-tuc`
- `/tu-van/lich-su`
- `/api/ai-chat/session`
- `/api/ai-chat/resume`
- `/api/ai-chat/message`
- `/api/lead/email-reply`
- `/api/lead/handoff`
