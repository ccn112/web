# C04 SECTION SPEC

## C04-01 — Quy trình triển khai end-to-end
**Title:** Từ khảo sát đến vận hành ổn định

Steps:
1. Khảo sát
2. Kiến trúc mục tiêu
3. Thiết kế giải pháp
4. Phát triển & cấu hình
5. Tích hợp
6. Migration
7. UAT & đào tạo
8. Go-live
9. Hypercare
10. Tối ưu

Desktop: horizontal or radial timeline.
Mobile: vertical stepper.

---

## C04-02 — Khảo sát & kiến trúc mục tiêu
**Title:** Hiểu đúng hiện trạng, thiết kế đúng kiến trúc

4 lớp:
- Nghiệp vụ
- Ứng dụng
- Dữ liệu
- Hạ tầng & bảo mật

Outputs:
- Current-state map
- Target architecture
- Gap analysis
- Roadmap
- Priority backlog

---

## C04-03 — Integration Hub
**Title:** Kết nối hệ thống, hợp nhất dòng dữ liệu

Inputs:
ERP, CRM, HRM, DMS, Legacy, IoT, Email, Workspace

Core:
API Gateway, Integration Services, Event Bus, Workflow, Identity, Monitoring

Outputs:
Web, Mobile, Portal, BI, AI Agent, Data Platform

---

## C04-04 — API Gateway & Event Bus
**Title:** Tích hợp linh hoạt, vận hành theo sự kiện

Capabilities:
- API management
- Authentication
- Rate limit
- Event streaming
- Retry
- Queue
- Audit log
- Observability

---

## C04-05 — Migration & Data Quality
**Title:** Chuyển đổi dữ liệu an toàn, có kiểm soát

Flow:
Khảo sát nguồn → Mapping → Làm sạch → Chuẩn hóa → Chuyển đổi thử → Đối soát → Cutover → Kiểm tra

Controls:
completeness, consistency, duplicate, reconciliation, rollback, audit.

---

## C04-06 — Deployment Models
**Title:** Linh hoạt với mọi mô hình hạ tầng

Models:
- SaaS
- Private Cloud
- On-premise
- Hybrid

Compare:
speed, data control, customization, infrastructure cost, operations, scalability.

---

## C04-07 — DevSecOps
**Title:** Bảo mật từ thiết kế, giám sát xuyên suốt

Pipeline:
Code → Build → Test → Scan → Deploy → Monitor → Alert → Improve

---

## C04-08 — SLA & Continuous Improvement
**Title:** Go-live chỉ là điểm bắt đầu

Services:
- Service Desk
- SLA
- Incident
- Problem Management
- Release Management
- Monitoring
- Capacity Planning
- Adoption
- Continuous Improvement
