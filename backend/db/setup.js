const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'canho.db'));

function setupDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      count_text TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS apartments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      area_id INTEGER NOT NULL,
      area_name TEXT NOT NULL,
      area_slug TEXT NOT NULL,
      price REAL NOT NULL,
      price_display TEXT NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      size REAL NOT NULL,
      short_desc TEXT,
      description TEXT,
      location TEXT NOT NULL,
      district TEXT NOT NULL,
      floor TEXT,
      direction TEXT,
      legal TEXT,
      image TEXT NOT NULL,
      images TEXT,
      is_hot INTEGER DEFAULT 0,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (area_id) REFERENCES areas(id)
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      avatar TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      area TEXT,
      price_range TEXT,
      bedrooms TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const areaCount = db.prepare('SELECT COUNT(*) as cnt FROM areas').get().cnt;
  if (areaCount === 0) {
    const insertArea = db.prepare('INSERT INTO areas (name, slug, count_text, image, description) VALUES (?, ?, ?, ?, ?)');
    insertArea.run('Chung Cư Đại Thanh', 'dai-thanh', '120+ căn đang bán', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', 'Khu đô thị Đại Thanh, Thanh Trì - vị trí đắc địa phía Nam Hà Nội');
    insertArea.run('Chung Cư Linh Đàm', 'linh-dam', '150+ căn đang bán', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', 'Khu đô thị Linh Đàm, Hoàng Mai - bán đảo xanh giữa lòng thành phố');
    insertArea.run('Kim Nhà - Kim Lú', 'kim-van-kim-lu', '80+ căn đang bán', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', 'Kim Văn - Kim Lũ, Hoàng Mai - khu dân cư hiện đại tiện nghi');
    insertArea.run('Khu Vực Khác', 'khu-vuc-khac', '200+ căn đang bán', 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80', 'Các khu vực khác tại Hà Nội');
  }

  const aptCount = db.prepare('SELECT COUNT(*) as cnt FROM apartments').get().cnt;
  if (aptCount === 0) {
    const insertApt = db.prepare(`
      INSERT INTO apartments (title, area_id, area_name, area_slug, price, price_display, bedrooms, bathrooms, size, short_desc, description, location, district, floor, direction, legal, image, images, is_hot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Đại Thanh apartments
    insertApt.run('Chỉ 2.9 Tỷ – 2PN Đại Thanh', 1, 'Đại Thanh', 'dai-thanh', 2900000000, '2.900.000.000đ', 2, 2, 56, 'Full nội thất – Sổ đỏ chính chủ', 'Căn hộ 2 phòng ngủ đẹp tại Đại Thanh. Full nội thất cao cấp, sổ đỏ chính chủ, hỗ trợ vay ngân hàng đến 70%. Tầng trung view thoáng, ban công Đông Nam đón gió. Khu vực yên tĩnh, an ninh 24/7.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 12', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80', '["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"]', 1);
    insertApt.run('Studio Đại Thanh – Vào Ở Ngay', 1, 'Đại Thanh', 'dai-thanh', 1800000000, '1.800.000.000đ', 1, 1, 38, 'Nhà đẹp như hình – Giá đầu tư tốt', 'Studio thông minh tại Đại Thanh. Thiết kế hiện đại, tối ưu không gian, phù hợp cho người độc thân hoặc đầu tư cho thuê. Nội thất cơ bản, sẵn sàng vào ở.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 8', 'Tây Bắc', 'Sổ hồng', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]', 0);
    insertApt.run('2.5 Tỷ – 1PN Sửa 2PN Đại Thanh', 1, 'Đại Thanh', 'dai-thanh', 2500000000, '2.500.000.000đ', 1, 1, 45, 'Phù hợp đầu tư – Giá tốt', 'Căn hộ 1 phòng ngủ có thể cải tạo thành 2 phòng ngủ. Diện tích 45m², tiềm năng cải tạo cao. Gần trường học, chợ, siêu thị, tiện ích đầy đủ.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 6', 'Đông', 'Sổ đỏ', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', '["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"]', 1);
    insertApt.run('3PN Đại Thanh – Full Nội Thất Cao Cấp', 1, 'Đại Thanh', 'dai-thanh', 3900000000, '3.900.000.000đ', 3, 2, 75, 'Gia đình 3-4 người – View thoáng', 'Căn hộ 3 phòng ngủ rộng rãi, phù hợp gia đình 3-4 người. Full nội thất nhập khẩu cao cấp, ban công view khu vực. Tầng cao, thoáng mát quanh năm.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 18', 'Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"]', 0);

    // Linh Đàm apartments
    insertApt.run('3.3 Tỷ – Linh Đàm View Hồ', 2, 'Linh Đàm', 'linh-dam', 3300000000, '3.300.000.000đ', 2, 2, 60, 'Ban công Đông Nam – Nhà đẹp', 'Căn hộ 2PN view hồ Linh Đàm tuyệt đẹp. Ban công Đông Nam đón gió, view hồ lãng mạn. Nội thất đầy đủ, sẵn ở ngay hoặc cho thuê giá tốt 12-15 triệu/tháng.', 'Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 15', 'Đông Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80"]', 1);
    insertApt.run('1PN Linh Đàm – Gần Hồ – Giá Tốt', 2, 'Linh Đàm', 'linh-dam', 2200000000, '2.200.000.000đ', 1, 1, 42, 'Gần hồ – Cách 200m đi bộ', 'Căn hộ 1 phòng ngủ cách hồ Linh Đàm 200m. Thoáng mát, yên tĩnh, phù hợp ở hoặc cho thuê. Giá tốt nhất khu vực, hỗ trợ vay ngân hàng.', 'Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 5', 'Đông', 'Sổ hồng', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"]', 0);
    insertApt.run('2PN Linh Đàm – Nội Thất Xịn', 2, 'Linh Đàm', 'linh-dam', 3800000000, '3.800.000.000đ', 2, 2, 65, 'Phong cách hiện đại – Tầng cao', 'Căn hộ 2PN thiết kế hiện đại, nội thất nhập khẩu cao cấp. Tầng cao view khoáng đãng, điều hòa âm trần, tủ bếp Acrylic.', 'Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 20', 'Bắc', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=600&q=80', '["https://images.unsplash.com/photo-1618219944342-824e40a13285?w=800&q=80"]', 0);
    insertApt.run('3PN Linh Đàm – Gia Đình Lớn', 2, 'Linh Đàm', 'linh-dam', 4500000000, '4.500.000.000đ', 3, 2, 80, 'Gia đình 4-5 người – View hồ', 'Căn hộ 3 phòng ngủ rộng 80m2, view hồ Linh Đàm. Phù hợp gia đình 4-5 người, tiện ích đầy đủ trong khu đô thị.', 'Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 16', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80', '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"]', 0);

    // Kim Văn - Kim Lú apartments
    insertApt.run('3.6 Tỷ – Kim Văn Kim Lú – Full Nội Thất', 3, 'Kim Văn - Kim Lú', 'kim-van-kim-lu', 3600000000, '3.600.000.000đ', 2, 2, 62, 'Full nội thất – Vào ở ngay', 'Căn hộ 2PN 62m2 tại Kim Văn Kim Lú. Full nội thất cao cấp, vào ở ngay. Khu vực đang phát triển mạnh, tiềm năng tăng giá tốt. Hỗ trợ vay ngân hàng 70%.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 14', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80', '["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]', 1);
    insertApt.run('1PN Kim Văn – Đầu Tư Sinh Lời', 3, 'Kim Văn - Kim Lú', 'kim-van-kim-lu', 2800000000, '2.800.000.000đ', 1, 1, 48, 'Cho thuê 10-12 triệu/tháng', 'Căn hộ 1PN tại Kim Văn, phù hợp đầu tư cho thuê. Hiện đang được thuê 11 triệu/tháng, sinh lời ngay từ khi mua. Vị trí thuận tiện giao thông.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 9', 'Tây', 'Sổ hồng', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80', '["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"]', 0);
    insertApt.run('2PN Kim Lú – Giá Hợp Lý', 3, 'Kim Văn - Kim Lú', 'kim-van-kim-lu', 3200000000, '3.200.000.000đ', 2, 2, 58, 'Nội thất cơ bản – Sổ đỏ', 'Căn hộ 2PN 58m2, nội thất cơ bản, giá tốt khu Kim Lú. Dễ dàng cải tạo theo sở thích, hỗ trợ vay ngân hàng đến 65%.', 'Kim Lú, Hoàng Mai', 'Hoàng Mai', 'Tầng 7', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]', 0);
    insertApt.run('3PN Kim Văn – Penthouse View Đẹp', 3, 'Kim Văn - Kim Lú', 'kim-van-kim-lu', 5200000000, '5.200.000.000đ', 3, 2, 85, 'Tầng cao – View toàn cảnh TP', 'Căn hộ 3PN tầng penthouse với view toàn cảnh thành phố. Thiết kế sang trọng, trần cao 3.2m, ban công lớn. Sản phẩm hiếm, giá trị đầu tư cao.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 25', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]', 0);
  }

  const testCount = db.prepare('SELECT COUNT(*) as cnt FROM testimonials').get().cnt;
  if (testCount === 0) {
    const insertTest = db.prepare('INSERT INTO testimonials (name, location, avatar, content, rating) VALUES (?, ?, ?, ?, ?)');
    insertTest.run('Anh Tuấn', 'Hoàng Mai', 'https://randomuser.me/api/portraits/men/32.jpg', 'Mình mua được căn giá rất tốt, thủ tục nhanh gọn, hỗ trợ vay ngân hàng rất nhiệt tình. Cảm ơn team Oanh Homes đã tư vấn tận tình từ đầu đến khi nhận bàn giao nhà.', 5);
    insertTest.run('Chị Hương', 'Thanh Trì', 'https://randomuser.me/api/portraits/women/44.jpg', 'Nhà đẹp, đúng như mô tả, giá cả hợp lý. Đội ngũ tư vấn rất chuyên nghiệp, không ép buộc. Mình đã giới thiệu thêm 2 người bạn và họ đều hài lòng.', 5);
    insertTest.run('Anh Nam', 'Thanh Xuân', 'https://randomuser.me/api/portraits/men/56.jpg', 'Tư vấn chuyên nghiệp, uy tín, giá tốt hơn thị trường. Được xem nhà trong ngày, thủ tục nhanh, mình rất hài lòng với dịch vụ tại đây.', 5);
    insertTest.run('Chị Lan', 'Đống Đa', 'https://randomuser.me/api/portraits/women/22.jpg', 'Ban đầu còn do dự nhưng sau khi được tư vấn tận tình, mình quyết định mua ngay. Căn nhà đúng như kỳ vọng, thậm chí còn đẹp hơn ảnh chụp.', 5);
  }

  return db;
}

module.exports = { setupDatabase, db };
