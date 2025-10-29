import bcrypt from 'bcryptjs';
export default function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export default function compareHashedPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}