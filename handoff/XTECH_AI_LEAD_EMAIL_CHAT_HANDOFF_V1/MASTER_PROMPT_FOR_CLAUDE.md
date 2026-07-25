# MASTER PROMPT FOR CLAUDE CODE

Triển khai tư vấn lead đa kênh cho XTECH.

Kênh:
- Web AI Chat
- Email inbound/outbound
- Human consultant handoff

Bắt buộc:
1. Tạo first-party `deviceId`.
2. Liên kết device → contact → lead → conversation.
3. Email có signed resume link.
4. Redirect đúng lịch sử chat.
5. Thiết bị mới phải xác minh email.
6. Email reply nhập lại cùng conversation.
7. AI tiếp tục từ đúng context.
8. Chỉ gửi đội tư vấn khi HUMAN_READY.
9. Lưu schema trong Payload CMS.
10. Không dùng deviceId như authentication.

UX:
- Message có badge nguồn Email / Web Chat / Consultant.
- Khi handoff: hiển thị “Đang chuyển tới chuyên gia XTECH”.
- Consultant thấy AI summary trước khi liên hệ.
