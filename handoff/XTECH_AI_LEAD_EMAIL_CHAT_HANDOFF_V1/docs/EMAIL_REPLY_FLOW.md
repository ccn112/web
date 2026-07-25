# Email Reply Flow

Reply-To:

`lead+{{conversationPublicId}}@reply.x-tech.com.vn`

Luồng:
1. Email provider gửi webhook.
2. Parse conversationPublicId.
3. Xác thực sender.
4. Lưu message vào cùng conversation.
5. AI đọc history hợp nhất.
6. AI phản hồi qua email và cập nhật web chat.
7. Nếu HUMAN_READY, dừng tư vấn sâu tự động và tạo handoff.

Chống loop:
- bỏ qua auto-reply/bounce;
- chống trùng bằng message-id;
- rate limit;
- moderation.
