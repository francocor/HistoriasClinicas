const bcrypt = require("bcryptjs");

const passwords = ["1234", "1234", "1234"];

Promise.all(passwords.map(p => bcrypt.hash(p, 10))).then(hashed => {
  console.log("Contraseñas encriptadas:");
  hashed.forEach(p => console.log(`'${p}',`));
});
