const express = require('express');
const index = require("./data/index");
const users = index.users;
async function main() {
    try {
        console.log(await users.createUser(1, "Kunj", "Kunjdesai@gmail.com", "kunj1234"));
    } catch (error) {
        console.error(error);
    }
}

main()