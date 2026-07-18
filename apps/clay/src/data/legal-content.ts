/**
 * Corporate legal pages (/chinh-sach-bao-mat, /dieu-khoan-su-dung,
 * /chinh-sach-cookie). Typed content module (CMS-manageable later).
 * Route-check helper is server-safe (imported by page.tsx).
 *
 * Grounded in (as of 2026-07): Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số
 * 91/2025/QH15, hiệu lực 01/01/2026) + Nghị định 356/2025/NĐ-CP; Luật Giao dịch
 * điện tử 2023 (20/2023/QH15); Luật An ninh mạng 2018 (24/2018/QH14); Luật Bảo vệ
 * quyền lợi người tiêu dùng 2023 (19/2023/QH15); và GDPR (EU 2016/679) cho người
 * dùng trong EU. Có điều khoản riêng cho trợ lý AI/chatbot và dịch vụ SaaS.
 *
 * ⚠ IMPORTANT: đây là bản thảo mẫu (template). Các mục đặt trong dấu [] là thông
 * tin pháp nhân/liên hệ mà doanh nghiệp phải điền. Toàn bộ nội dung CẦN được luật
 * sư/bộ phận pháp chế rà soát và phê duyệt trước khi áp dụng chính thức cho sản phẩm.
 */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  route: string;
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const UPDATED = "Cập nhật lần cuối: 18/07/2026";

/** Reused operator label — replace with the registered legal entity. */
const OPERATOR = "XTECH";

export const legalDocs: LegalDoc[] = [
  /* ============================ PRIVACY ============================ */
  {
    slug: "chinh-sach-bao-mat",
    route: "/chinh-sach-bao-mat",
    eyebrow: "Pháp lý",
    title: "Chính sách bảo mật",
    updated: UPDATED,
    intro:
      `${OPERATOR} (“chúng tôi”) cam kết bảo vệ dữ liệu cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ, lưu trữ và bảo vệ dữ liệu khi bạn truy cập website, sử dụng sản phẩm, dịch vụ SaaS và trợ lý AI của chúng tôi. Chính sách được xây dựng phù hợp với Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15) và các văn bản hướng dẫn, cùng các thông lệ quốc tế (GDPR) áp dụng cho người dùng trong phạm vi liên quan.`,
    sections: [
      {
        heading: "1. Bên kiểm soát dữ liệu",
        paragraphs: [
          `Bên kiểm soát dữ liệu cá nhân là [tên pháp nhân đăng ký], mã số doanh nghiệp [•], địa chỉ [•]. Mọi yêu cầu về dữ liệu cá nhân xin gửi tới [email bảo vệ dữ liệu, ví dụ privacy@…] hoặc qua trang Liên hệ.`,
        ],
      },
      {
        heading: "2. Định nghĩa",
        bullets: [
          "“Dữ liệu cá nhân”: thông tin gắn với một cá nhân đã hoặc có thể được xác định.",
          "“Dữ liệu cá nhân nhạy cảm”: dữ liệu về sức khỏe, sinh trắc học, tài chính, vị trí, quan điểm chính trị/tôn giáo, dữ liệu của trẻ em và các loại khác theo luật định.",
          "“Chủ thể dữ liệu”: cá nhân mà dữ liệu cá nhân phản ánh.",
          "“Xử lý”: mọi thao tác trên dữ liệu cá nhân (thu thập, ghi, lưu trữ, sử dụng, chia sẻ, xóa…).",
        ],
      },
      {
        heading: "3. Dữ liệu chúng tôi thu thập",
        paragraphs: ["Tùy theo cách bạn tương tác, chúng tôi có thể thu thập:"],
        bullets: [
          "Dữ liệu bạn cung cấp: họ tên, email, số điện thoại, chức danh, tên doanh nghiệp và nội dung bạn gửi qua biểu mẫu liên hệ, đăng ký demo hoặc yêu cầu tư vấn.",
          "Dữ liệu tài khoản khi bạn đăng ký sử dụng dịch vụ SaaS (thông tin đăng nhập, cấu hình, dữ liệu do bạn nhập vào hệ thống).",
          "Nội dung tương tác với trợ lý AI/chatbot (câu hỏi, hội thoại, phản hồi) — xem Mục 6.",
          "Dữ liệu kỹ thuật và sử dụng: địa chỉ IP, loại thiết bị/trình duyệt, nhật ký truy cập, dữ liệu từ cookie và công nghệ tương tự (xem Chính sách cookie).",
        ],
      },
      {
        heading: "4. Mục đích và cơ sở pháp lý xử lý",
        paragraphs: ["Chúng tôi chỉ xử lý dữ liệu cá nhân khi có cơ sở hợp pháp, bao gồm:"],
        bullets: [
          "Trên cơ sở sự đồng ý của bạn (ví dụ nhận thông tin tiếp thị, cookie không thiết yếu).",
          "Để thực hiện hợp đồng hoặc theo yêu cầu của bạn (cung cấp dịch vụ, phản hồi tư vấn, đặt lịch demo).",
          "Để tuân thủ nghĩa vụ pháp lý.",
          "Vì lợi ích hợp pháp của chúng tôi (bảo mật hệ thống, phòng chống gian lận, cải thiện chất lượng) trong phạm vi không lấn át quyền của bạn.",
        ],
      },
      {
        heading: "5. Sự đồng ý",
        paragraphs: [
          "Sự đồng ý được thu thập một cách rõ ràng, cụ thể theo từng mục đích và tự nguyện. Sự im lặng hoặc không phản hồi không được coi là đồng ý. Đối với dữ liệu nhạy cảm, chúng tôi thu thập sự đồng ý bằng văn bản hoặc hình thức điện tử xác thực được. Bạn có thể rút lại sự đồng ý bất cứ lúc nào; việc rút lại không ảnh hưởng đến tính hợp pháp của việc xử lý trước đó.",
        ],
      },
      {
        heading: "6. Trợ lý AI và chatbot",
        paragraphs: [
          "Website và/hoặc sản phẩm của chúng tôi có thể cung cấp trợ lý ảo, chatbot hoặc tính năng sử dụng trí tuệ nhân tạo. Khi sử dụng, bạn được thông báo rằng bạn đang tương tác với hệ thống AI, không phải con người.",
        ],
        bullets: [
          "Nội dung bạn nhập vào trợ lý AI có thể được ghi nhật ký, xử lý và lưu trữ nhằm vận hành, bảo đảm an toàn và cải thiện chất lượng dịch vụ.",
          "Chúng tôi có thể sử dụng nhà cung cấp mô hình AI bên thứ ba; khi đó dữ liệu đầu vào có thể được xử lý bởi các bên này theo điều khoản và biện pháp bảo mật của họ.",
          "Về việc dùng dữ liệu hội thoại để huấn luyện/cải thiện mô hình: [nêu rõ chính sách — ví dụ: không dùng dữ liệu khách hàng để huấn luyện mô hình dùng chung; hoặc chỉ dùng khi được đồng ý].",
          "Kết quả do AI tạo ra có thể không chính xác hoặc không đầy đủ và không cấu thành tư vấn pháp lý, y tế, tài chính hay chuyên môn. Bạn nên kiểm chứng trước khi sử dụng.",
          "Vui lòng không nhập dữ liệu cá nhân nhạy cảm, bí mật hoặc thông tin của bên thứ ba khi không có cơ sở hợp pháp vào ô trò chuyện.",
          "Chúng tôi không sử dụng AI để đưa ra quyết định hoàn toàn tự động gây ảnh hưởng pháp lý đáng kể đến bạn mà không có sự tham gia của con người; nếu có, bạn có quyền yêu cầu con người xem xét lại.",
        ],
      },
      {
        heading: "7. Chia sẻ dữ liệu với bên thứ ba",
        paragraphs: [
          "Chúng tôi không bán dữ liệu cá nhân của bạn. Chúng tôi chỉ chia sẻ dữ liệu với: (a) đơn vị cung cấp dịch vụ hỗ trợ vận hành (hạ tầng, lưu trữ, phân tích, nhà cung cấp AI) theo hợp đồng xử lý dữ liệu và cam kết bảo mật; (b) khi được bạn đồng ý; hoặc (c) khi được yêu cầu bởi cơ quan nhà nước có thẩm quyền theo quy định pháp luật.",
        ],
      },
      {
        heading: "8. Chuyển dữ liệu ra nước ngoài",
        paragraphs: [
          "Trong một số trường hợp, dữ liệu có thể được xử lý hoặc lưu trữ ngoài lãnh thổ Việt Nam (ví dụ dịch vụ đám mây, mô hình AI). Khi đó chúng tôi thực hiện các biện pháp theo quy định, bao gồm lập Đánh giá tác động chuyển dữ liệu cá nhân ra nước ngoài, bảo đảm bên nhận có mức bảo vệ phù hợp và tuân thủ thủ tục với cơ quan có thẩm quyền (Bộ Công an) theo Luật Bảo vệ dữ liệu cá nhân 2025.",
        ],
      },
      {
        heading: "9. Lưu trữ và thời hạn",
        paragraphs: [
          "Dữ liệu được lưu trữ trong thời gian cần thiết để thực hiện các mục đích đã nêu hoặc theo thời hạn luật định. Khi không còn cần thiết, dữ liệu sẽ được xóa hoặc ẩn danh một cách an toàn.",
        ],
      },
      {
        heading: "10. Bảo mật dữ liệu",
        paragraphs: [
          "Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý (kiểm soát truy cập, mã hóa khi phù hợp, ghi nhật ký, sao lưu, phân quyền) nhằm bảo vệ dữ liệu khỏi truy cập trái phép, thay đổi, tiết lộ hoặc mất mát.",
        ],
      },
      {
        heading: "11. Quyền của chủ thể dữ liệu",
        paragraphs: ["Theo quy định pháp luật, bạn có các quyền:"],
        bullets: [
          "Được biết và được thông báo về việc xử lý dữ liệu của mình.",
          "Đồng ý, từ chối hoặc rút lại sự đồng ý.",
          "Truy cập, xem, chỉnh sửa hoặc yêu cầu chỉnh sửa dữ liệu.",
          "Yêu cầu xóa, hạn chế hoặc phản đối việc xử lý dữ liệu.",
          "Yêu cầu cung cấp/chuyển dữ liệu (nếu áp dụng).",
          "Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định.",
        ],
      },
      {
        heading: "12. Thông báo vi phạm dữ liệu",
        paragraphs: [
          "Trong trường hợp xảy ra sự cố vi phạm dữ liệu cá nhân, chúng tôi thực hiện các biện pháp khắc phục và thông báo cho cơ quan có thẩm quyền cùng chủ thể dữ liệu bị ảnh hưởng trong thời hạn theo quy định (thông báo cho Bộ Công an trong vòng 72 giờ kể từ khi phát hiện, theo Luật Bảo vệ dữ liệu cá nhân 2025).",
        ],
      },
      {
        heading: "13. Dữ liệu của trẻ em",
        paragraphs: [
          "Dịch vụ hướng đến khách hàng doanh nghiệp và không nhắm tới trẻ em. Việc xử lý dữ liệu của người dưới độ tuổi luật định chỉ được thực hiện khi có sự đồng ý của cha mẹ hoặc người giám hộ theo quy định.",
        ],
      },
      {
        heading: "14. Cookie",
        paragraphs: [
          "Website sử dụng cookie và công nghệ tương tự. Chi tiết về loại cookie, mục đích và cách quản lý được trình bày trong Chính sách cookie.",
        ],
      },
      {
        heading: "15. Thay đổi chính sách",
        paragraphs: [
          "Chính sách này có thể được cập nhật để phù hợp với thay đổi pháp luật hoặc dịch vụ. Phiên bản mới sẽ được đăng tải trên trang này kèm ngày cập nhật; các thay đổi trọng yếu sẽ được thông báo phù hợp.",
        ],
      },
      {
        heading: "16. Liên hệ",
        paragraphs: [
          "Mọi câu hỏi hoặc yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ qua [email bảo vệ dữ liệu] hoặc trang Liên hệ. Chúng tôi sẽ phản hồi trong thời hạn hợp lý theo quy định pháp luật.",
        ],
      },
    ],
  },

  /* ============================ TERMS ============================ */
  {
    slug: "dieu-khoan-su-dung",
    route: "/dieu-khoan-su-dung",
    eyebrow: "Pháp lý",
    title: "Điều khoản sử dụng",
    updated: UPDATED,
    intro:
      `Các Điều khoản sử dụng này (“Điều khoản”) điều chỉnh việc bạn truy cập và sử dụng website, sản phẩm và dịch vụ phần mềm dạng dịch vụ (SaaS) cùng các tính năng trí tuệ nhân tạo do ${OPERATOR} cung cấp. Bằng việc truy cập hoặc sử dụng, bạn đồng ý tuân thủ các Điều khoản này. Điều khoản được xây dựng phù hợp với pháp luật Việt Nam, bao gồm Luật Giao dịch điện tử 2023 (Luật số 20/2023/QH15), Luật Bảo vệ quyền lợi người tiêu dùng 2023 (Luật số 19/2023/QH15) và các quy định liên quan.`,
    sections: [
      {
        heading: "1. Chấp nhận điều khoản",
        paragraphs: [
          "Việc bạn truy cập hoặc sử dụng dịch vụ đồng nghĩa với việc bạn đã đọc, hiểu và chấp nhận các Điều khoản này cùng Chính sách bảo mật và Chính sách cookie. Nếu bạn giao kết thay cho một tổ chức, bạn cam kết có đủ thẩm quyền ràng buộc tổ chức đó. Nếu không đồng ý, vui lòng ngừng sử dụng.",
        ],
      },
      {
        heading: "2. Định nghĩa",
        bullets: [
          "“Dịch vụ”: website, sản phẩm SaaS, API, tính năng AI và tài liệu do chúng tôi cung cấp.",
          "“Người dùng”: cá nhân hoặc tổ chức truy cập, sử dụng Dịch vụ.",
          "“Nội dung của bạn”: dữ liệu, văn bản, tệp và thông tin bạn nhập, tải lên hoặc tạo ra thông qua Dịch vụ.",
          "“Kết quả AI”: nội dung do tính năng AI tạo ra dựa trên dữ liệu đầu vào.",
        ],
      },
      {
        heading: "3. Tài khoản và đăng ký",
        paragraphs: [
          "Một số tính năng yêu cầu tạo tài khoản. Bạn có trách nhiệm cung cấp thông tin chính xác, bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động dưới tài khoản của mình. Vui lòng thông báo ngay khi phát hiện truy cập trái phép.",
        ],
      },
      {
        heading: "4. Quyền sử dụng dịch vụ",
        paragraphs: [
          "Trong thời hạn và phạm vi được cấp phép (hoặc theo hợp đồng riêng), chúng tôi cấp cho bạn quyền sử dụng Dịch vụ không độc quyền, không chuyển nhượng, có thể thu hồi, cho mục đích nội bộ hợp pháp của bạn. Mọi quyền không được cấp rõ ràng đều được bảo lưu.",
        ],
      },
      {
        heading: "5. Tính năng trí tuệ nhân tạo",
        paragraphs: [
          "Dịch vụ có thể bao gồm trợ lý AI, chatbot hoặc tính năng tạo sinh nội dung. Bạn được thông báo khi tương tác với hệ thống AI. Khi sử dụng tính năng AI, bạn hiểu và đồng ý:",
        ],
        bullets: [
          "Kết quả AI được tạo tự động, có thể không chính xác, không đầy đủ hoặc không phù hợp trong một số trường hợp; bạn có trách nhiệm kiểm tra, xác minh trước khi sử dụng.",
          "Kết quả AI không phải là tư vấn pháp lý, y tế, tài chính hay chuyên môn và không thay thế phán đoán của con người.",
          "Bạn không dựa hoàn toàn vào Kết quả AI để ra các quyết định quan trọng mà không có sự xác minh độc lập; chúng tôi không chịu trách nhiệm cho quyết định như vậy.",
          "Dịch vụ có thể sử dụng mô hình AI của bên thứ ba; điều khoản và giới hạn của bên đó có thể áp dụng bổ sung.",
          "Việc dữ liệu đầu vào có được dùng để cải thiện/huấn luyện mô hình hay không được nêu tại Chính sách bảo mật.",
          "Bạn không được nhập dữ liệu trái pháp luật, xâm phạm quyền của bên thứ ba hoặc dữ liệu nhạy cảm không có cơ sở hợp pháp vào tính năng AI.",
        ],
      },
      {
        heading: "6. Hành vi bị cấm",
        paragraphs: ["Khi sử dụng Dịch vụ, bạn đồng ý không:"],
        bullets: [
          "Sử dụng Dịch vụ cho mục đích trái pháp luật, lừa đảo hoặc gây hại.",
          "Truy cập trái phép, dò quét, can thiệp, làm gián đoạn hệ thống hoặc vượt giới hạn sử dụng.",
          "Sao chép, dịch ngược, khai thác trái phép mã nguồn, mô hình hoặc dữ liệu của Dịch vụ.",
          "Tải lên mã độc, nội dung vi phạm bản quyền hoặc xâm phạm quyền của bên thứ ba.",
          "Dùng Dịch vụ để tạo nội dung vi phạm pháp luật hoặc gây hiểu nhầm nghiêm trọng.",
        ],
      },
      {
        heading: "7. Nội dung của bạn và quyền sở hữu dữ liệu",
        paragraphs: [
          "Bạn giữ quyền sở hữu đối với Nội dung của bạn. Bạn cấp cho chúng tôi quyền xử lý Nội dung của bạn ở mức cần thiết để cung cấp và duy trì Dịch vụ. Bạn chịu trách nhiệm về tính hợp pháp của Nội dung và về việc có đủ cơ sở pháp lý đối với dữ liệu cá nhân của bên thứ ba mà bạn đưa vào Dịch vụ.",
        ],
      },
      {
        heading: "8. Quyền sở hữu trí tuệ",
        paragraphs: [
          "Dịch vụ, phần mềm, mô hình, thương hiệu, logo, thiết kế, tài liệu và mọi thành phần liên quan thuộc quyền sở hữu của chúng tôi hoặc bên cấp phép và được pháp luật bảo hộ. Bạn không được sử dụng cho mục đích thương mại hay tạo sản phẩm phái sinh khi chưa có sự đồng ý bằng văn bản.",
        ],
      },
      {
        heading: "9. Phí và thanh toán",
        paragraphs: [
          "Đối với các gói dịch vụ có thu phí, điều kiện về phí, chu kỳ thanh toán, gia hạn và hoàn phí được quy định trong bảng giá hoặc hợp đồng/đơn đặt hàng tương ứng. Trong trường hợp có mâu thuẫn, hợp đồng riêng sẽ được ưu tiên áp dụng.",
        ],
      },
      {
        heading: "10. Mức độ sẵn sàng và hỗ trợ",
        paragraphs: [
          "Chúng tôi nỗ lực duy trì Dịch vụ hoạt động ổn định. Cam kết cụ thể về mức độ sẵn sàng (SLA), bảo trì và hỗ trợ (nếu có) được nêu trong tài liệu SLA hoặc hợp đồng. Chúng tôi có thể bảo trì, cập nhật hoặc điều chỉnh tính năng và sẽ thông báo hợp lý khi có thay đổi trọng yếu.",
        ],
      },
      {
        heading: "11. Bảo vệ dữ liệu cá nhân",
        paragraphs: [
          "Việc xử lý dữ liệu cá nhân được thực hiện theo Chính sách bảo mật. Khi chúng tôi xử lý dữ liệu cá nhân thay mặt bạn trong quá trình cung cấp Dịch vụ, các bên có thể ký thỏa thuận xử lý dữ liệu (DPA) theo quy định pháp luật.",
        ],
      },
      {
        heading: "12. Tuyên bố miễn trừ",
        paragraphs: [
          "Trong phạm vi pháp luật cho phép, Dịch vụ được cung cấp trên cơ sở “nguyên trạng” và “theo khả năng sẵn có”. Chúng tôi không bảo đảm Dịch vụ hoặc Kết quả AI không có lỗi, không gián đoạn hoặc phù hợp tuyệt đối cho mọi mục đích cụ thể của bạn, trừ các cam kết được nêu trong hợp đồng riêng.",
        ],
      },
      {
        heading: "13. Giới hạn trách nhiệm",
        paragraphs: [
          "Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên, hệ quả, mất lợi nhuận hoặc mất dữ liệu phát sinh từ việc sử dụng Dịch vụ. Tổng trách nhiệm của chúng tôi (nếu có) được giới hạn theo mức quy định trong hợp đồng riêng, hoặc theo quy định pháp luật áp dụng. Điều khoản này không loại trừ trách nhiệm mà pháp luật không cho phép loại trừ.",
        ],
      },
      {
        heading: "14. Bồi hoàn",
        paragraphs: [
          "Bạn đồng ý bồi hoàn và giữ cho chúng tôi không bị thiệt hại trước các khiếu nại của bên thứ ba phát sinh từ việc bạn sử dụng Dịch vụ trái Điều khoản, vi phạm pháp luật hoặc xâm phạm quyền của bên thứ ba.",
        ],
      },
      {
        heading: "15. Tạm ngừng và chấm dứt",
        paragraphs: [
          "Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập nếu bạn vi phạm Điều khoản hoặc pháp luật, hoặc để bảo vệ an toàn hệ thống. Bạn có thể ngừng sử dụng bất cứ lúc nào. Một số điều khoản (sở hữu trí tuệ, giới hạn trách nhiệm, bồi hoàn, luật áp dụng) vẫn có hiệu lực sau khi chấm dứt.",
        ],
      },
      {
        heading: "16. Liên kết và nội dung bên thứ ba",
        paragraphs: [
          "Dịch vụ có thể chứa liên kết hoặc tích hợp với nền tảng bên thứ ba. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách hay hoạt động của các bên đó.",
        ],
      },
      {
        heading: "17. Thay đổi điều khoản",
        paragraphs: [
          "Chúng tôi có thể cập nhật Điều khoản để phù hợp với thay đổi pháp luật hoặc Dịch vụ. Phiên bản cập nhật có hiệu lực kể từ khi được đăng tải; việc bạn tiếp tục sử dụng đồng nghĩa với việc chấp nhận phiên bản mới.",
        ],
      },
      {
        heading: "18. Bất khả kháng",
        paragraphs: [
          "Chúng tôi không chịu trách nhiệm cho việc chậm trễ hoặc không thực hiện do sự kiện nằm ngoài tầm kiểm soát hợp lý (thiên tai, sự cố hạ tầng, tấn công mạng, thay đổi pháp luật, gián đoạn dịch vụ của bên thứ ba…).",
        ],
      },
      {
        heading: "19. Luật áp dụng và giải quyết tranh chấp",
        paragraphs: [
          "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Các bên ưu tiên giải quyết tranh chấp thông qua thương lượng, hòa giải; nếu không đạt được, tranh chấp sẽ được giải quyết tại cơ quan tài phán có thẩm quyền theo quy định pháp luật.",
        ],
      },
      {
        heading: "20. Liên hệ",
        paragraphs: ["Mọi thắc mắc về Điều khoản, vui lòng liên hệ với chúng tôi qua trang Liên hệ."],
      },
    ],
  },

  /* ============================ COOKIE ============================ */
  {
    slug: "chinh-sach-cookie",
    route: "/chinh-sach-cookie",
    eyebrow: "Pháp lý",
    title: "Chính sách cookie",
    updated: UPDATED,
    intro:
      `Chính sách này giải thích cách ${OPERATOR} sử dụng cookie và công nghệ tương tự trên website, cơ sở pháp lý và cách bạn quản lý lựa chọn. Chính sách cần được đọc cùng với Chính sách bảo mật.`,
    sections: [
      {
        heading: "1. Cookie là gì?",
        paragraphs: [
          "Cookie là tệp dữ liệu nhỏ được lưu trên thiết bị của bạn khi truy cập website. Cookie giúp website ghi nhớ thao tác và tùy chọn, bảo đảm an toàn và phân tích cách website được sử dụng. Chúng tôi cũng có thể dùng công nghệ tương tự như pixel, local storage.",
        ],
      },
      {
        heading: "2. Các loại cookie chúng tôi sử dụng",
        bullets: [
          "Cookie thiết yếu: cần thiết để website vận hành, đăng nhập và bảo mật. Không thể tắt qua công cụ đồng ý.",
          "Cookie hiệu năng/phân tích: đo lường lưu lượng và cách sử dụng để cải thiện trải nghiệm (thường ẩn danh hoặc tổng hợp).",
          "Cookie chức năng: ghi nhớ tùy chọn của bạn (ngôn ngữ, hiển thị) để cá nhân hóa trải nghiệm.",
          "Cookie tiếp thị/quảng cáo (nếu sử dụng): phục vụ đo lường chiến dịch và nội dung phù hợp; chỉ đặt khi có sự đồng ý.",
        ],
      },
      {
        heading: "3. Cơ sở pháp lý và sự đồng ý",
        paragraphs: [
          "Cookie thiết yếu được sử dụng trên cơ sở lợi ích hợp pháp để cung cấp website. Đối với cookie không thiết yếu (phân tích, chức năng, tiếp thị), chúng tôi chỉ đặt khi bạn đồng ý. Bạn có thể thay đổi hoặc rút lại lựa chọn bất cứ lúc nào.",
        ],
      },
      {
        heading: "4. Cookie của bên thứ ba",
        paragraphs: [
          "Một số cookie có thể do bên thứ ba đặt (ví dụ công cụ phân tích). Việc xử lý dữ liệu của các bên này tuân theo chính sách riêng của họ; chúng tôi khuyến nghị bạn tham khảo chính sách của các bên liên quan.",
        ],
      },
      {
        heading: "5. Quản lý cookie",
        paragraphs: [
          "Bạn có thể quản lý lựa chọn cookie qua công cụ đồng ý trên website (nếu có) và qua thiết lập trình duyệt (chặn, xóa cookie). Lưu ý rằng việc tắt một số cookie có thể ảnh hưởng đến chức năng và trải nghiệm sử dụng.",
        ],
      },
      {
        heading: "6. Thời hạn lưu",
        paragraphs: [
          "Cookie phiên sẽ hết hạn khi bạn đóng trình duyệt; cookie lưu lâu dài tồn tại trong khoảng thời gian được thiết lập tùy theo mục đích và loại cookie.",
        ],
      },
      {
        heading: "7. Thay đổi chính sách",
        paragraphs: [
          "Chính sách cookie có thể được cập nhật theo thời gian. Phiên bản mới sẽ được đăng tải trên trang này kèm ngày cập nhật.",
        ],
      },
      {
        heading: "8. Liên hệ",
        paragraphs: ["Nếu có câu hỏi về việc sử dụng cookie, vui lòng liên hệ với chúng tôi qua trang Liên hệ."],
      },
    ],
  },
];

const BY_ROUTE = new Map(legalDocs.map((d) => [d.route, d]));

/** Server-safe route check (used by the corporate override in page.tsx). */
export function hasLegalRoute(route: string): boolean {
  return BY_ROUTE.has(route);
}

export function legalDocForRoute(route: string): LegalDoc | undefined {
  return BY_ROUTE.get(route);
}
