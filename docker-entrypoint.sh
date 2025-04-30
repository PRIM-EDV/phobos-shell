db = db.getSiblingDB('nest');

db.users.insertOne({
  username: "admin",
  password: "$argon2id$v=19$m=65536,t=3,p=4$eTwQqQU+N5EO+VtNXLj3gA$TVPl1R91M+lI2djVCULbpScc1HSTukoswlSKG/X8Sfs",
  role: "admin"
});