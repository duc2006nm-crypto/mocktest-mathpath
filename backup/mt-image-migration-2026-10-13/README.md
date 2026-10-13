# Hoàn tác đợt chuyển ảnh ra tệp (2026-10-13)

## Đã làm gì
Ảnh trước đây nằm dạng base64 ngay trong từng đề thi trên Firestore (khoảng 65MB, làm mỗi lần mở trang phải tải ~70MB). Ảnh được đưa ra thư mục images/ (tên mt_<mã>.<đuôi>) trên GitHub Pages, trong đề chỉ còn đường dẫn images/mt_....
- Mã nguồn trang (index.html) KHÔNG bị sửa trong đợt này.
- Mọi tệp ảnh chỉ được THÊM mới, không sửa/xóa tệp cũ.
- Từng ảnh đã được kiểm tra trên trang thật khớp từng byte với bản gốc.

## Cách hoàn tác (đưa ảnh về lại dạng nhúng như cũ)
1. Đăng nhập quản trị trên trang, nhấn F12 mở Console.
2. Dán nội dung tệp restore.js trong thư mục này, Enter.
3. Chạy: await RESTORE()   (khôi phục tất cả đề) hoặc await RESTORE(['mã_đề']) cho 1 đề.
Mỗi ảnh khôi phục được kiểm tra khớp mã băm gốc trong manifest.json trước khi ghi; sai là dừng, không ghi.
Không cần xóa tệp trong images/ khi hoàn tác (để lại cũng không ảnh hưởng).

## Ghi chú
- manifest.json: danh sách ảnh (mã băm, loại, kích thước) và danh sách đề liên quan.
- skippedBrokenImages: các ảnh đã hỏng sẵn trong dữ liệu (base64 sai), được giữ nguyên, không đụng tới.
