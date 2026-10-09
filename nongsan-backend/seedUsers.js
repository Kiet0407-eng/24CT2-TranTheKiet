const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nongsan_db',
});

async function seedUsers() {
  const db = connection.promise();

  try {
    await db.connect();
    const hashedPassword = bcrypt.hashSync('123456', 10);

    await db.beginTransaction();
    await db.query('DELETE FROM users');
    await db.query(
      'INSERT INTO users (ho_ten, email, mat_khau, vai_tro) VALUES ?',
      [[
        ['Quản trị viên', 'admin@gmail.com', hashedPassword, 'Admin'],
        ['Khách hàng', 'khach@gmail.com', hashedPassword, 'Khách hàng'],
      ]],
    );
    await db.commit();

    console.log('Đã tạo tài khoản mẫu thành công.');
    console.log('Admin: admin@gmail.com / 123456');
    console.log('Khách hàng: khach@gmail.com / 123456');
  } catch (error) {
    try {
      await db.rollback();
    } catch {
      // Ignore rollback errors when the connection or transaction is unavailable.
    }
    console.error('Không thể tạo tài khoản mẫu:', error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

seedUsers();
