const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'canho.db'));

function setupDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      parent_id INTEGER,
      count_text TEXT DEFAULT '',
      image TEXT DEFAULT '',
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS apartments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      project_id INTEGER,
      project_name TEXT NOT NULL DEFAULT '',
      project_slug TEXT NOT NULL DEFAULT '',
      listing_type TEXT NOT NULL DEFAULT 'ban',
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // Migration: add new columns to apartments if missing (for existing DBs)
  const aptCols = db.prepare('PRAGMA table_info(apartments)').all().map(c => c.name);
  if (!aptCols.includes('project_id')) db.exec('ALTER TABLE apartments ADD COLUMN project_id INTEGER');
  if (!aptCols.includes('project_name')) db.exec("ALTER TABLE apartments ADD COLUMN project_name TEXT NOT NULL DEFAULT ''");
  if (!aptCols.includes('project_slug')) db.exec("ALTER TABLE apartments ADD COLUMN project_slug TEXT NOT NULL DEFAULT ''");
  if (!aptCols.includes('listing_type')) db.exec("ALTER TABLE apartments ADD COLUMN listing_type TEXT NOT NULL DEFAULT 'ban'");

  // Seed projects
  const projectCount = db.prepare('SELECT COUNT(*) as cnt FROM projects').get().cnt;
  if (projectCount === 0) {
    const ins = db.prepare('INSERT INTO projects (name, slug, parent_id, count_text, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');

    // Top-level projects
    ins.run('Chung Cư Đại Thanh', 'dai-thanh', null, '120+ căn', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', 'Khu đô thị Đại Thanh, Thanh Trì - phía Nam Hà Nội', 1);
    const linhdamId = db.prepare("INSERT INTO projects (name, slug, parent_id, count_text, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)").run('KĐT Linh Đàm', 'linh-dam', null, '200+ căn', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', 'Khu đô thị Linh Đàm, Hoàng Mai - bán đảo xanh giữa lòng thành phố', 2).lastInsertRowid;
    ins.run('Chung Cư Kim Văn Kim Lũ', 'kim-van-kim-lu', null, '80+ căn', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', 'Kim Văn - Kim Lũ, Hoàng Mai - khu dân cư hiện đại tiện nghi', 3);
    ins.run('X2 Đại Kim', 'x2-dai-kim', null, '60+ căn', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80', 'X2 Đại Kim, Hoàng Mai - chung cư cao tầng hiện đại', 4);
    ins.run('KĐT Xa La', 'xa-la', null, '90+ căn', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', 'Khu đô thị Xa La, Hà Đông - đô thị xanh phía Tây Nam', 5);
    ins.run('Thông Tấn Xã', 'thong-tan-xa', null, '50+ căn', 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80', 'Chung cư Thông Tấn Xã, Cầu Giấy - trung tâm phía Tây Hà Nội', 6);
    ins.run('Đại Kim Building', 'dai-kim-building', null, '40+ căn', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80', 'Đại Kim Building, Hoàng Mai - tòa nhà văn phòng kết hợp căn hộ', 7);
    ins.run('The Queen 360 Giải Phóng', 'the-queen-360', null, '70+ căn', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&q=80', 'The Queen 360 Giải Phóng, Hoàng Mai - căn hộ cao cấp mặt đường lớn', 8);
    ins.run('KĐT Định Công', 'dinh-cong', null, '55+ căn', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', 'Khu đô thị Định Công, Hoàng Mai - khu dân cư đông đúc sầm uất', 9);

    // Sub-projects under Linh Đàm
    ins.run('HH Linh Đàm', 'hh-linh-dam', linhdamId, '80+ căn', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 'Khu HH Linh Đàm - tòa nhà cao tầng đông dân nhất khu vực', 1);
    ins.run('Bán Đảo Linh Đàm', 'ban-dao-linh-dam', linhdamId, '70+ căn', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', 'Bán đảo Linh Đàm - view hồ đẹp nhất khu Linh Đàm', 2);
    ins.run('Tây Nam Linh Đàm', 'tay-nam-linh-dam', linhdamId, '50+ căn', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80', 'Tây Nam Linh Đàm - khu yên tĩnh, gần trường học', 3);
  }

  // Seed apartments
  const aptCount = db.prepare('SELECT COUNT(*) as cnt FROM apartments').get().cnt;
  if (aptCount === 0) {
    const ins = db.prepare(`
      INSERT INTO apartments (title, project_id, project_name, project_slug, listing_type, price, price_display, bedrooms, bathrooms, size, short_desc, description, location, district, floor, direction, legal, image, images, is_hot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pid = (slug) => db.prepare('SELECT id, name FROM projects WHERE slug = ?').get(slug);

    // Đại Thanh (for sale)
    let p = pid('dai-thanh');
    ins.run('Chỉ 2.9 Tỷ – 2PN Đại Thanh Full Nội Thất', p.id, p.name, 'dai-thanh', 'ban', 2900000000, '2.900.000.000đ', 2, 2, 56, 'Full nội thất – Sổ đỏ chính chủ', 'Căn hộ 2 phòng ngủ đẹp tại Đại Thanh. Full nội thất cao cấp, sổ đỏ chính chủ, hỗ trợ vay ngân hàng đến 70%. Tầng trung view thoáng, ban công Đông Nam đón gió.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 12', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80', '["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"]', 1);
    ins.run('Studio Đại Thanh – Vào Ở Ngay', p.id, p.name, 'dai-thanh', 'ban', 1800000000, '1.800.000.000đ', 1, 1, 38, 'Nhà đẹp như hình – Giá đầu tư tốt', 'Studio thông minh tại Đại Thanh. Thiết kế hiện đại, tối ưu không gian, phù hợp người độc thân hoặc đầu tư cho thuê.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 8', 'Tây Bắc', 'Sổ hồng', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]', 0);
    ins.run('3PN Đại Thanh – Full Nội Thất Cao Cấp', p.id, p.name, 'dai-thanh', 'ban', 3900000000, '3.900.000.000đ', 3, 2, 75, 'Gia đình 3-4 người – View thoáng', 'Căn hộ 3 phòng ngủ rộng rãi, full nội thất nhập khẩu cao cấp, ban công view khu vực. Tầng cao, thoáng mát quanh năm.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 18', 'Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"]', 1);

    // HH Linh Đàm (for sale)
    p = pid('hh-linh-dam');
    ins.run('2PN HH Linh Đàm – VP5 View Hồ', p.id, p.name, 'hh-linh-dam', 'ban', 3300000000, '3.300.000.000đ', 2, 2, 60, 'VP5 – Ban công Đông Nam view hồ', 'Căn hộ 2PN VP5 HH Linh Đàm view hồ tuyệt đẹp. Ban công Đông Nam đón gió, nội thất đầy đủ, sẵn ở ngay. Cho thuê 12-15 triệu/tháng.', 'HH Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 15', 'Đông Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80"]', 1);
    ins.run('1PN HH Linh Đàm VP2 – Giá Tốt', p.id, p.name, 'hh-linh-dam', 'ban', 2200000000, '2.200.000.000đ', 1, 1, 42, 'Gần hồ – Cách 200m đi bộ', 'Căn hộ 1PN VP2 HH Linh Đàm, cách hồ 200m. Thoáng mát, yên tĩnh, phù hợp ở hoặc cho thuê.', 'HH Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 5', 'Đông', 'Sổ hồng', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"]', 0);
    ins.run('3PN HH Linh Đàm – Gia Đình Lớn', p.id, p.name, 'hh-linh-dam', 'ban', 4500000000, '4.500.000.000đ', 3, 2, 80, 'Gia đình 4-5 người – View hồ', 'Căn hộ 3PN rộng 80m2 tại HH Linh Đàm, view hồ. Phù hợp gia đình 4-5 người.', 'HH Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 16', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80', '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"]', 0);

    // Bán đảo Linh Đàm (for sale)
    p = pid('ban-dao-linh-dam');
    ins.run('2PN Bán Đảo Linh Đàm – View Hồ Cực Đẹp', p.id, p.name, 'ban-dao-linh-dam', 'ban', 3800000000, '3.800.000.000đ', 2, 2, 65, 'Bán đảo – 3 mặt nhìn ra hồ', 'Căn hộ 2PN tại Bán đảo Linh Đàm, 3 mặt view hồ. Thiết kế hiện đại, nội thất nhập khẩu cao cấp, tầng cao.', 'Bán Đảo Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 20', 'Bắc', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=600&q=80', '["https://images.unsplash.com/photo-1618219944342-824e40a13285?w=800&q=80"]', 1);
    ins.run('1PN Bán Đảo Linh Đàm – Đầu Tư Tốt', p.id, p.name, 'ban-dao-linh-dam', 'ban', 2600000000, '2.600.000.000đ', 1, 1, 45, 'View hồ – Tiềm năng cho thuê cao', 'Căn hộ 1PN bán đảo Linh Đàm, view hồ, phù hợp đầu tư cho thuê 10-12 triệu/tháng.', 'Bán Đảo Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 10', 'Tây Nam', 'Sổ hồng', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80', '["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"]', 0);

    // Tây Nam Linh Đàm (for sale)
    p = pid('tay-nam-linh-dam');
    ins.run('2PN Tây Nam Linh Đàm – Giá Rẻ Nhất Khu', p.id, p.name, 'tay-nam-linh-dam', 'ban', 2800000000, '2.800.000.000đ', 2, 1, 54, 'Giá rẻ – Gần trường học', 'Căn hộ 2PN tại Tây Nam Linh Đàm. Giá rẻ nhất khu vực, gần trường học, chợ, siêu thị tiện lợi.', 'Tây Nam Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 7', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]', 0);

    // Kim Văn Kim Lũ (for sale)
    p = pid('kim-van-kim-lu');
    ins.run('3.6 Tỷ – Kim Văn Kim Lũ Full Nội Thất', p.id, p.name, 'kim-van-kim-lu', 'ban', 3600000000, '3.600.000.000đ', 2, 2, 62, 'Full nội thất – Vào ở ngay', 'Căn hộ 2PN 62m2 tại Kim Văn Kim Lũ. Full nội thất cao cấp, vào ở ngay. Hỗ trợ vay ngân hàng 70%.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 14', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80', '["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80"]', 1);
    ins.run('3PN Kim Lũ – Penthouse View Đẹp', p.id, p.name, 'kim-van-kim-lu', 'ban', 5200000000, '5.200.000.000đ', 3, 2, 85, 'Tầng cao – View toàn cảnh TP', 'Căn hộ 3PN penthouse view toàn cảnh thành phố. Trần cao 3.2m, ban công lớn. Sản phẩm hiếm.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 25', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]', 0);

    // X2 Đại Kim (for sale)
    p = pid('x2-dai-kim');
    ins.run('2PN X2 Đại Kim – Mới Bàn Giao', p.id, p.name, 'x2-dai-kim', 'ban', 3100000000, '3.100.000.000đ', 2, 2, 58, 'Mới bàn giao – Giá tốt', 'Căn hộ 2PN X2 Đại Kim mới bàn giao. Chủ đầu tư uy tín, tiến độ nhanh, chính sách vay hấp dẫn.', 'X2 Đại Kim, Hoàng Mai', 'Hoàng Mai', 'Tầng 10', 'Đông', 'Sổ hồng', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', '["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"]', 1);
    ins.run('1PN X2 Đại Kim – Đầu Tư Sinh Lời', p.id, p.name, 'x2-dai-kim', 'ban', 2100000000, '2.100.000.000đ', 1, 1, 40, 'Cho thuê 9-10 triệu/tháng', 'Căn hộ 1PN X2 Đại Kim, phù hợp đầu tư cho thuê. Cho thuê 9-10 triệu/tháng, sinh lời ngay.', 'X2 Đại Kim, Hoàng Mai', 'Hoàng Mai', 'Tầng 6', 'Tây', 'Sổ hồng', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80', '["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80"]', 0);

    // KĐT Xa La (for sale)
    p = pid('xa-la');
    ins.run('2PN Xa La – Giá Hợp Lý Hà Đông', p.id, p.name, 'xa-la', 'ban', 2700000000, '2.700.000.000đ', 2, 2, 55, 'Hà Đông – Gần Aeon Mall', 'Căn hộ 2PN KĐT Xa La Hà Đông. Gần Aeon Mall, trường học, bệnh viện. Khu vực đang phát triển nhanh.', 'KĐT Xa La, Hà Đông', 'Hà Đông', 'Tầng 9', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"]', 1);
    ins.run('3PN Xa La – Gia Đình Lớn', p.id, p.name, 'xa-la', 'ban', 3500000000, '3.500.000.000đ', 3, 2, 78, 'Không gian rộng – Tiện ích đầy đủ', 'Căn hộ 3PN KĐT Xa La rộng 78m2. Tiện ích đầy đủ trong khu, bể bơi, gym, sân chơi trẻ em.', 'KĐT Xa La, Hà Đông', 'Hà Đông', 'Tầng 14', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"]', 0);

    // Thông Tấn Xã (for sale)
    p = pid('thong-tan-xa');
    ins.run('2PN Thông Tấn Xã – Cầu Giấy Trung Tâm', p.id, p.name, 'thong-tan-xa', 'ban', 4200000000, '4.200.000.000đ', 2, 2, 60, 'Cầu Giấy – Vị trí đắc địa', 'Căn hộ 2PN chung cư Thông Tấn Xã, Cầu Giấy. Vị trí trung tâm, gần các tuyến xe buýt, đường lớn.', 'Thông Tấn Xã, Cầu Giấy', 'Cầu Giấy', 'Tầng 11', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80', '["https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80"]', 1);

    // Đại Kim Building (for sale)
    p = pid('dai-kim-building');
    ins.run('2PN Đại Kim Building – Hiện Đại', p.id, p.name, 'dai-kim-building', 'ban', 3400000000, '3.400.000.000đ', 2, 2, 62, 'Tòa nhà cao cấp – Full tiện ích', 'Căn hộ 2PN Đại Kim Building, tòa nhà hiện đại với đầy đủ tiện ích: gym, bể bơi, bảo vệ 24/7.', 'Đại Kim Building, Hoàng Mai', 'Hoàng Mai', 'Tầng 13', 'Tây Nam', 'Sổ hồng', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80', '["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80"]', 0);

    // The Queen 360 (for sale)
    p = pid('the-queen-360');
    ins.run('2PN The Queen 360 Giải Phóng – Cao Cấp', p.id, p.name, 'the-queen-360', 'ban', 4800000000, '4.800.000.000đ', 2, 2, 70, 'Mặt đường Giải Phóng – Đẳng cấp', 'Căn hộ 2PN The Queen 360, mặt đường Giải Phóng lớn. Thiết kế sang trọng, view thành phố, hầm đỗ xe.', 'The Queen 360 Giải Phóng, Hoàng Mai', 'Hoàng Mai', 'Tầng 17', 'Đông Nam', 'Sổ đỏ chính chủ', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&q=80', '["https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80"]', 1);

    // KĐT Định Công (for sale)
    p = pid('dinh-cong');
    ins.run('2PN KĐT Định Công – Khu Sầm Uất', p.id, p.name, 'dinh-cong', 'ban', 3000000000, '3.000.000.000đ', 2, 2, 57, 'Khu dân cư đông đúc – Tiện lợi', 'Căn hộ 2PN KĐT Định Công. Khu dân cư sầm uất, chợ, trường học, bệnh viện trong bán kính 1km.', 'KĐT Định Công, Hoàng Mai', 'Hoàng Mai', 'Tầng 8', 'Nam', 'Sổ đỏ', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]', 0);

    // ====== CHO THUÊ CĂN HỘ ======
    p = pid('hh-linh-dam');
    ins.run('Cho Thuê 2PN HH Linh Đàm VP5 – Đủ Đồ', p.id, p.name, 'hh-linh-dam', 'thue', 12000000, '12.000.000đ/tháng', 2, 2, 60, 'Full đồ – Vào ở ngay', 'Cho thuê căn hộ 2PN HH Linh Đàm VP5. Full nội thất, điều hòa, tủ lạnh, máy giặt. Vào ở ngay, giá thương lượng.', 'HH Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 12', 'Đông Nam', null, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]', 1);
    ins.run('Cho Thuê 1PN HH Linh Đàm – Giá Rẻ', p.id, p.name, 'hh-linh-dam', 'thue', 7500000, '7.500.000đ/tháng', 1, 1, 38, 'Giá rẻ nhất khu – Thoáng mát', 'Cho thuê căn hộ 1PN HH Linh Đàm giá tốt. Nội thất cơ bản, thoáng mát, an ninh.', 'HH Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 7', 'Bắc', null, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"]', 0);

    p = pid('dai-thanh');
    ins.run('Cho Thuê 2PN Đại Thanh – Full Nội Thất', p.id, p.name, 'dai-thanh', 'thue', 9000000, '9.000.000đ/tháng', 2, 2, 56, 'Đủ đồ – Giá thương lượng', 'Cho thuê căn hộ 2PN Đại Thanh đủ đồ. Điều hòa, tủ lạnh, máy giặt, bàn ghế đầy đủ.', 'Đại Thanh, Thanh Trì', 'Thanh Trì', 'Tầng 9', 'Nam', null, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]', 1);

    p = pid('kim-van-kim-lu');
    ins.run('Cho Thuê 2PN Kim Văn Kim Lũ – Mới Đẹp', p.id, p.name, 'kim-van-kim-lu', 'thue', 10000000, '10.000.000đ/tháng', 2, 2, 62, 'Mới sửa – View thoáng', 'Cho thuê căn hộ 2PN Kim Văn Kim Lũ mới sửa sang. Nội thất mới, sáng sủa, view thoáng.', 'Kim Văn, Hoàng Mai', 'Hoàng Mai', 'Tầng 11', 'Đông', null, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80', '["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80"]', 0);

    p = pid('xa-la');
    ins.run('Cho Thuê 3PN Xa La – Gia Đình Lớn', p.id, p.name, 'xa-la', 'thue', 14000000, '14.000.000đ/tháng', 3, 2, 78, 'Rộng rãi – Gần Aeon Mall', 'Cho thuê căn hộ 3PN KĐT Xa La, Hà Đông. Rộng rãi, gần Aeon Mall, phù hợp gia đình lớn.', 'KĐT Xa La, Hà Đông', 'Hà Đông', 'Tầng 6', 'Đông Nam', null, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"]', 0);

    p = pid('ban-dao-linh-dam');
    ins.run('Cho Thuê Studio Bán Đảo Linh Đàm – View Hồ', p.id, p.name, 'ban-dao-linh-dam', 'thue', 8000000, '8.000.000đ/tháng', 1, 1, 35, 'Studio đẹp – View hồ lãng mạn', 'Cho thuê studio bán đảo Linh Đàm, view hồ cực đẹp. Nội thất đầy đủ, thoáng mát.', 'Bán Đảo Linh Đàm, Hoàng Mai', 'Hoàng Mai', 'Tầng 8', 'Tây Nam', null, 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=600&q=80', '["https://images.unsplash.com/photo-1618219944342-824e40a13285?w=800&q=80"]', 1);
  }

  const testCount = db.prepare('SELECT COUNT(*) as cnt FROM testimonials').get().cnt;
  if (testCount === 0) {
    const ins = db.prepare('INSERT INTO testimonials (name, location, avatar, content, rating) VALUES (?, ?, ?, ?, ?)');
    ins.run('Anh Tuấn', 'Hoàng Mai', 'https://randomuser.me/api/portraits/men/32.jpg', 'Mình mua được căn giá rất tốt, thủ tục nhanh gọn, hỗ trợ vay ngân hàng rất nhiệt tình. Cảm ơn team Oanh Homes đã tư vấn tận tình từ đầu đến khi nhận bàn giao nhà.', 5);
    ins.run('Chị Hương', 'Thanh Trì', 'https://randomuser.me/api/portraits/women/44.jpg', 'Nhà đẹp, đúng như mô tả, giá cả hợp lý. Đội ngũ tư vấn rất chuyên nghiệp, không ép buộc. Mình đã giới thiệu thêm 2 người bạn và họ đều hài lòng.', 5);
    ins.run('Anh Nam', 'Thanh Xuân', 'https://randomuser.me/api/portraits/men/56.jpg', 'Tư vấn chuyên nghiệp, uy tín, giá tốt hơn thị trường. Được xem nhà trong ngày, thủ tục nhanh, mình rất hài lòng.', 5);
    ins.run('Chị Lan', 'Đống Đa', 'https://randomuser.me/api/portraits/women/22.jpg', 'Ban đầu còn do dự nhưng sau khi được tư vấn tận tình, mình quyết định mua ngay. Căn nhà đúng như kỳ vọng, thậm chí còn đẹp hơn ảnh chụp.', 5);
  }

  return db;
}

module.exports = { setupDatabase, db };
