import { task } from "hardhat/config";

const airdrop = task("airdrop", "Airdrop event prize").setAction(
  async function (taskArgs, hre) {
    const id = 0;
    const [signer] = await hre.ethers.getSigners();
    const deployment = await hre.deployments.get("NftBond");
    const nftBond = await hre.ethers.getContractAt(
      deployment.abi,
      deployment.address
    );

    console.log("nftBond address: ", nftBond.address);
    console.log("signer", signer.address);
    const amount = 1;

    for await (const receiver of receivers) {
      console.log(`Send ${amount} NFT to ${receiver}`);
      const tx = await nftBond.safeTransferFrom(
        signer.address,
        receiver,
        id,
        amount,
        hre.ethers.utils.formatBytes32String("")
      );
      const receipt = await tx.wait();
      console.log(receipt);
    }
  }
);

const receivers = [
  "0x0d5905F2E2AD24C0b856562C366580C3CE111F76",
  "0x92BB2731dCba31De1530034574c99069021d74f9",
  "0xD88c8D930CE4E6f492FA51E4eB4704730A009965",
  "0x0EEbB24d68ab546d0c1013386469613ce18713fB",
  "0x3ec36E043a75e004a80A8c2A3b73188Bf6e25A4E",
  "0x801b1f4056d998072d6aD41e7B68CeE5e270184C",
  "0x7ABaB8Cf656971Def3E4722e167e56D9Ba16c8c9",
  "0x7a6832eD8a28B68C41f58d51bC4d66D7C426569C",
  "0x1001da03a05cb31ca66E8F6F160982344F086779",
  "0x434Ca3cF235B042EA1EB3097E9D54C637c7f47eD",
  "0xAfC6f259b238FCB10E58ad61aE8599BA51e2239E",
  "0xb1f81c88edb20344447db66340240f00862c3280",
  "0x069C60193AeC9527457AeFD3589f4dBE85579f90",
  "0x8971A58550294Eaf4b79bcB43E929A75BB2A25C2",
  "0xC3B13FDD29181a1b40c96dc74f0B35B737C69EBB",
  "0x589d499993ed5eFb5b44f9e3c85e8a4Dd33Cada3",
  "0x77E917e697F57473e240d6382eB6080bE9F6DeBE",
  "0xd392f85d91b501e6054201272F7A99C860F7b1f9",
  "0x1c815cC47ce9f52dea20075F8366B3CC9314E6b1",
  "0x0000006094141CD5d88b13aA8845DC34E9b1c3A0",
  "0xBfc1427e10a97D25Ef0b9066AD9814ba8B2132A7",
  "0x0cD4Af27775FCcC4Bc6e51E21Cd5c4e063f833Cc",
  "0x6b131b92De66a2A6Da7f208Adecd337c0cc7Ec8e",
  "0x0aE35Daaac1ad64eC2171d851e9560428CB6ee7c",
  "0x0aA123471Cc247604c8abD1BB78Ad0A3AC9bAF2d",
  "0x20C15478872830C7043dafCc0608b02548945F83",
  "0xCA1140Bc43e10e2535c5EEC1FF73687723A44C12",
  "0xdFE3e59CC9766Da6cE5396dD8EBb292dc8fc7C54",
  "0x49a55112cd77d885181c71BED0f62651adCaCeDD",
  "0xE019EEA85dEd339AD0A28359FC104454169cD284",
];

export default airdrop;
