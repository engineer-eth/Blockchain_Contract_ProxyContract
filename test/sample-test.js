const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upgradable Proxy Pattern", function () {

  let deployer, user;
  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    const UpgradeContractV1 =  await ethers.getContractFactory("UpgradeContractV1", deployer);
    this.upgradeContractV1 = await UpgradeContractV1.deploy();

    const UpgradeContractV2 =  await ethers.getContractFactory("UpgradeContractV2", deployer);
    this.upgradeContractV2 = await UpgradeContractV2.deploy();

    const ProxyContract =  await ethers.getContractFactory("ProxyContract", deployer);
    this.proxyContract = await ProxyContract.deploy(this.upgradeContractV1.address);

    this.proxyPatternV1 = await ethers.getContractAt("UpgradeContractV1", this.proxyContract.address);
    this.proxyPatternV2 = await ethers.getContractAt("UpgradeContractV2", this.proxyContract.address);

  });

  describe("Proxy", function () {
    it("Should return the address of UpgradeContractV1 when calling logicContract() on Proxy", async function (){
      expect(await this.proxyContract.logicContract()).to.eq(this.upgradeContractV1.address);
    });

    it("Should return the address of UpgradeContractV2 after call upgrade() on Proxy", async function (){
      await this.proxyContract.upgrade(this.upgradeContractV2.address);
      expect(await this.proxyContract.logicContract()).to.eq(this.upgradeContractV2.address);
    });

    it("Should revert if anynomous(not owner) call upgrade() on Proxy", async function (){
      await expect(this.proxyContract.connect(user).upgrade(this.upgradeContractV2.address)).to.be.revertedWith("Only owner can do this");     
    });

    it("Calling increaseValue() of UpgradeContractV1 should add 1 to value variable of Proxy's state", async function (){
      await this.proxyPatternV1.increaseValue();
      expect(await this.proxyContract.value()).to.eq(1);
      expect(await this.upgradeContractV1.value()).to.eq(0);
    });

    it("Calling increaseValue() of UpgradeContractV2 should add 2 to value variable of Proxy's state", async function (){
      await this.proxyContract.upgrade(this.upgradeContractV2.address);
      await this.proxyPatternV2.increaseValue();
      expect(await this.proxyContract.value()).to.eq(2);
      expect(await this.upgradeContractV2.value()).to.eq(0);
    });

    it("It should set owner", async function (){
      await this.proxyContract.upgrade(this.upgradeContractV2.address);      
      await this.proxyPatternV2.setOtherValue(6);        
      expect(await this.proxyContract.owner()).to.eq("0x0000000000000000000000000000000000000006");
      
    });

    it("It should update owner", async function (){
      await this.proxyContract.upgrade(this.upgradeContractV2.address);
      console.log("owner before change = ", await this.proxyContract.owner());
      await this.proxyPatternV2.increaseOtherValue(); 
      console.log("owner after  change = ", await this.proxyContract.owner()); 
    });
  });  
});
