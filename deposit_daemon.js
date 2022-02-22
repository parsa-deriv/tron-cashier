require("dotenv").config();
const TronWeb = require("tronweb");
// const TronGrid = require("trongrid");

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io/",
});

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// // address: TRiU4jeZxfd5xJ68mC7cdTdF1TxsXb5zx1
// const MainPrivateKeyHex =
//   "38025293D8DB37173C5DD70EAD6DB5912CE61BB0133ECCFFDC71F215F0A9D90F";

// // address: TLQinQx3rb9xep9ukYGzNHARWSeuSXrb4D
// const clientPrivateKeyHex =
//   "969462154F041CBBF994D846D7CE7DF29C68296FA54E7CEAA88E267DD7D54C64";

// const address = "TSiZfxbwatuJJmRYagdiGdgMoYdAv2GMuy";
// tronWeb.setPrivateKey(accout.privateKey);

// const tronGrid = new TronGrid(tronWeb);

const main = async () => {
  //   const account = await tronWeb.createAccount();
  //   console.log(account);
  const mainAddress = tronWeb.address.fromPrivateKey(
    process.env.MAIN_PRIVATE_KEY
  );
  const clientAddress = tronWeb.address.fromPrivateKey(
    process.env.CLIENT_PRIVATE_KEY
  );
  console.log(`main address: ${mainAddress}`);
  console.log(`client address: ${clientAddress}`);
  try {
    let mainAddressBalance = await tronWeb.trx.getBalance(mainAddress);
    let clientAddressBalance = await tronWeb.trx.getBalance(clientAddress);

    console.log("before sending TRX");
    console.log(`main address balance: ${mainAddressBalance}`);
    console.log(`client address balance: ${clientAddressBalance}`);

    const transaction = await tronWeb.transactionBuilder.sendTrx(
      clientAddress,
      1,
      mainAddress
    );
    const signed = await tronWeb.trx.sign(
      transaction,
      process.env.MAIN_PRIVATE_KEY
    );
    // console.log(signed);
    const response = await tronWeb.trx.sendRawTransaction(signed);
    // console.log(response);

    // const confirmedTX = await tronWeb.trx.getTransaction(
    //   response.transaction.txID
    // );
    // console.log(confirmedTX);

    while (true) {
      let events = await tronWeb.event.getEventsByTransactionID(
        response.transaction.txID
      );
      if (events.length) {
        console.log("events");
        console.log(events);
        break;
      }
      await delay(500);
    }

    mainAddressBalance = await tronWeb.trx.getBalance(mainAddress);
    clientAddressBalance = await tronWeb.trx.getBalance(clientAddress);

    console.log("after sending TRX");
    console.log(`main address balance: ${mainAddressBalance}`);
    console.log(`client address balance: ${clientAddressBalance}`);
  } catch (error) {
    console.log(error);
  }
  //   tronWeb.setPrivateKey("Ky6ats4xCKDTP6kecTrSWMsLLGRd4MbzZDRKf49vthyfk4vm493e");
  //   const balance = await tronWeb.trx.getBalance(mainAddress);
  //   console.log(balance);
  //   const balance = await tronGrid.account.get(
  //     "TSiZfxbwatuJJmRYagdiGdgMoYdAv2GMuy"
  //   );
  //   console.log(balance);
};

main();
